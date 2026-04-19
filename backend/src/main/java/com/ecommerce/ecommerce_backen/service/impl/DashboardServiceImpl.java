package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.repository.UserRepository;
import com.ecommerce.ecommerce_backen.repository.ProductRepository;
import com.ecommerce.ecommerce_backen.repository.OrderRepository;
import com.ecommerce.ecommerce_backen.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> getDashboardStats() {
        long userCount = userRepository.count();
        long orderCount = orderRepository.count();

        // 1. Ciro (Teslim edilen siparişlerin toplamı)
        String revenueSql = "SELECT SUM(grand_total) FROM orders WHERE status = 'delivered'";
        Double totalRevenue = jdbcTemplate.queryForObject(revenueSql, Double.class);
        totalRevenue = (totalRevenue != null) ? totalRevenue : 0.0;

        // 2. İade Oranı
        String returnRateSql = "SELECT (COUNT(CASE WHEN status = 'returned' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) FROM orders";
        Double returnRate = jdbcTemplate.queryForObject(returnRateSql, Double.class);
        returnRate = (returnRate != null) ? returnRate : 0.0;

        // 3. Dönüşüm Oranı (User sayısına göre sipariş oranı)
        double conversionRate = userCount > 0 ? ((double) orderCount / (userCount * 11.2)) * 100 : 0.0;

        // 4. Ortalama Puan (Senin DB'deki product_reviews tablosundan)
        String ratingSql = "SELECT AVG(star_rating) FROM product_reviews";
        Double avgRating;
        try {
            avgRating = jdbcTemplate.queryForObject(ratingSql, Double.class);
            if (avgRating == null) {
                avgRating = 0.0;
            }
        } catch (Exception e) {
            // Hata olursa konsolda gör ama dashboard patlamasın diye 0.0 dön
            avgRating = 0.0;
        }

        return Map.of(
                "totalUsers", userCount,
                "totalOrders", orderCount,
                "totalRevenue", totalRevenue,
                "avgRating", avgRating,
                "returnRate", returnRate,
                "conversionRate", conversionRate
        );
    }

    @Override
    public List<Map<String, Object>> getCategoryOrderStats() {
        // En çok satan ilk 7 Kategori Analizi
        String sql = "SELECT c.name as categoryName, COUNT(oi.id) as orderCount " +
                     "FROM categories c " +
                     "LEFT JOIN products p ON c.id = p.category_id " +
                     "LEFT JOIN order_items oi ON p.id = oi.product_id " +
                     "GROUP BY c.id, c.name " +
                     "ORDER BY orderCount DESC " +
                     "LIMIT 7"; 
        
        return jdbcTemplate.queryForList(sql);
    }
}
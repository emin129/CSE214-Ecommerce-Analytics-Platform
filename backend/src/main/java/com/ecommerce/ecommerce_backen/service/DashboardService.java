package com.ecommerce.ecommerce_backen.service;

import java.util.List;
import java.util.Map;

public interface DashboardService {
    Map<String, Object> getDashboardStats();
    // Grafik için yeni metod tanımı
    List<Map<String, Object>> getCategoryOrderStats(); 
}
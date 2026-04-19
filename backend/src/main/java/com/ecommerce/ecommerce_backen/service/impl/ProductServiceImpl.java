package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.entity.Product;
import com.ecommerce.ecommerce_backen.entity.Store;
import com.ecommerce.ecommerce_backen.repository.ProductRepository;
import com.ecommerce.ecommerce_backen.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<Product> getAllProducts(String search, Long categoryId, Pageable pageable) {
        // Buradaki arama sorgun (searchProducts) veritabanında 
        // muhtemelen isActive=true olanları filtrelemeli.
        return productRepository.searchProducts(search, categoryId, pageable);
    }

    @Override
    @Transactional
    public Product saveProduct(Product product) {
        // Yeni ürün eklenirken varsayılan olarak aktif gelsin
        if (product.getId() == null) {
            product.setActive(true);
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setUnitPrice(updatedProduct.getUnitPrice()); 
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setActive(updatedProduct.isActive());

        if (updatedProduct.getCategory() != null) {
            existingProduct.setCategory(updatedProduct.getCategory());
        }

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        // 1. Ürünü bul
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // 2. Fiziksel silme yerine DURUMU güncelle
        product.setActive(false);
        
        // 3. Veritabanına kaydet
        productRepository.save(product);
        
        // Log için (isteğe bağlı)
        System.out.println("Product ID " + id + " marked as inactive instead of deleted.");
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Page<Product> getProductsByStore(Store store, Pageable pageable) {
        return productRepository.findByStore(store, pageable);
    }
}
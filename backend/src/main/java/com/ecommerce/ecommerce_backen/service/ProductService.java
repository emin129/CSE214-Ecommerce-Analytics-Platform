package com.ecommerce.ecommerce_backen.service;
import com.ecommerce.ecommerce_backen.entity.Product;
import com.ecommerce.ecommerce_backen.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ecommerce.ecommerce_backen.entity.Store;

import java.util.Optional;

public interface ProductService {

    Page<Product> getAllProducts(String search, Long categoryId, Pageable pageable);

    Product saveProduct(Product product);

    Product updateProduct(Long id, Product updatedProduct);

    void deleteProduct(Long id);

    Optional<Product> getProductById(Long id);

    Page<Product> getProductsByStore(Store store, Pageable pageable);
}
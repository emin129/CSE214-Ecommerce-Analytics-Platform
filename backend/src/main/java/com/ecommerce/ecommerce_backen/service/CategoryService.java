package com.ecommerce.ecommerce_backen.service;

import com.ecommerce.ecommerce_backen.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category getCategoryByName(String name);
}
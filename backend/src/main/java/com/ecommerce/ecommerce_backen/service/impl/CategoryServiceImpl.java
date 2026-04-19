package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.entity.Category;
import com.ecommerce.ecommerce_backen.repository.CategoryRepository;
import com.ecommerce.ecommerce_backen.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı! ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryByName(String name) {
        
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı! İsim: " + name));
    }
}
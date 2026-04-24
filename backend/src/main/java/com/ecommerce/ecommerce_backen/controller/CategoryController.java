package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.entity.Category;
import com.ecommerce.ecommerce_backen.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin("@CrossOrigin(origins = \"http://localhost:4200\", allowCredentials = \"true\")") 
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}
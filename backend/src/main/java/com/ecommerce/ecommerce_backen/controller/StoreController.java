package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.StoreReportDTO;
import com.ecommerce.ecommerce_backen.entity.Store;
import com.ecommerce.ecommerce_backen.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:4200")
public class StoreController {

    private final StoreService storeService;

    @Autowired
    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public ResponseEntity<List<Store>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/reports")
    public ResponseEntity<Page<StoreReportDTO>> getStoreReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String ownerName) {

        return ResponseEntity.ok(
                storeService.getStoreReports(page, size, ownerName)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStoreStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        storeService.updateStoreStatus(id, status);
        return ResponseEntity.ok("Store status updated to: " + status);
    }
}
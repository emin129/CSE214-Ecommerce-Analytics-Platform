package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO;
import com.ecommerce.ecommerce_backen.entity.CustomerProfile;
import com.ecommerce.ecommerce_backen.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customer-profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminCustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/incomplete")
    public ResponseEntity<Page<CustomerDetailsDTO>> getIncomplete(
            @RequestParam(required = false) String searchTerm,
            Pageable pageable) {
        return ResponseEntity.ok(customerService.getIncompleteProfiles(searchTerm, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerProfile> updateProfile(
            @PathVariable Integer id,
            @RequestBody CustomerProfile profile) {
        profile.setId(id);
        return ResponseEntity.ok(customerService.updateProfile(id.toString(), profile));
    }
}
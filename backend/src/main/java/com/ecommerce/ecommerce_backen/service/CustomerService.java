package com.ecommerce.ecommerce_backen.service;

import com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO;
import com.ecommerce.ecommerce_backen.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface CustomerService {

    Map<String, Object> getCustomerDashboardStats();

    List<CustomerDetailsDTO> getAllCustomerDetails();

    Page<CustomerDetailsDTO> getIncompleteProfiles(String searchTerm, Pageable pageable);

    Page<CustomerDetailsDTO> getCustomersBySeller(Long sellerId, String searchTerm, Pageable pageable);

    CustomerProfile updateProfile(String id, CustomerProfile updatedData);
}
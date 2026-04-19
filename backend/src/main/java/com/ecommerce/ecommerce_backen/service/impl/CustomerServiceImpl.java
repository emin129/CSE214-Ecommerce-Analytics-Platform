package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.dto.CustomerDetailsDTO;
import com.ecommerce.ecommerce_backen.entity.CustomerProfile;
import com.ecommerce.ecommerce_backen.repository.CustomerProfileRepository;
import com.ecommerce.ecommerce_backen.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerProfileRepository profileRepository;

    @Override
    public Map<String, Object> getCustomerDashboardStats() {
        return null; 
    }

    @Override
    public List<CustomerDetailsDTO> getAllCustomerDetails() {
        return null;
    }

    @Override
    public Page<CustomerDetailsDTO> getIncompleteProfiles(String searchTerm, Pageable pageable) {
        return profileRepository.findProfilesWithSearch(searchTerm, pageable);
    }

    @Override
    public Page<CustomerDetailsDTO> getCustomersBySeller(Long sellerId, String searchTerm, Pageable pageable) {
        return profileRepository.findCustomersBySeller(sellerId, searchTerm, pageable);
    }

    @Override
    @Transactional
    public CustomerProfile updateProfile(String id, CustomerProfile updatedData) {
        Integer profileId = Integer.parseInt(id); 
        
        CustomerProfile existing = profileRepository.findById(profileId) 
                .orElseThrow(() -> new RuntimeException("Profile not found for ID: " + id));

        if (updatedData.getMembershipType() != null) {
            existing.setMembershipType(updatedData.getMembershipType());
        }
        
        if (updatedData.getCity() != null) {
            existing.setCity(updatedData.getCity());
        }

        if (updatedData.getState() != null) {
            existing.setState(updatedData.getState());
        }

        if (updatedData.getZipCodePrefix() != null) {
            existing.setZipCodePrefix(updatedData.getZipCodePrefix());
        }

        if (updatedData.getAge() != null) {
            existing.setAge(updatedData.getAge());
        }

        if (updatedData.getLat() != null) {
            existing.setLat(updatedData.getLat());
        }

        if (updatedData.getLng() != null) {
            existing.setLng(updatedData.getLng());
        }

        return profileRepository.saveAndFlush(existing);
    }
}
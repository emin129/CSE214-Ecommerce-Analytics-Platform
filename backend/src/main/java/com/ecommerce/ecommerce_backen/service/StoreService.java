package com.ecommerce.ecommerce_backen.service;

import com.ecommerce.ecommerce_backen.dto.StoreReportDTO;
import com.ecommerce.ecommerce_backen.entity.Store;
import org.springframework.data.domain.Page;
import java.util.List;

public interface StoreService {
    List<Store> getAllStores();

    

    Page<StoreReportDTO> getStoreReports(int page, int size, String searchTerm);

    void updateStoreStatus(Long id, String status);

    
}
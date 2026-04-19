package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.dto.StoreReportDTO;
import com.ecommerce.ecommerce_backen.entity.Store;
import com.ecommerce.ecommerce_backen.repository.OrderRepository;
import com.ecommerce.ecommerce_backen.repository.StoreRepository;
import com.ecommerce.ecommerce_backen.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;

    @Autowired
    public StoreServiceImpl(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @Override
    public Page<StoreReportDTO> getStoreReports(int page, int size, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Object[]> results = storeRepository.searchStoreJoinDataByOwnerPaged(searchTerm, pageable);

        List<StoreReportDTO> dtos = results.getContent().stream().map(result -> new StoreReportDTO(
                result[0] != null ? ((Number) result[0]).longValue() : null,
                result[1] != null ? ((Number) result[1]).longValue() : null,
                result[2] != null ? ((Number) result[2]).doubleValue() : 0.0,
                (String) result[3],
                (String) result[4],
                (String) result[5],
                (String) result[6],
                (String) result[7],
                (String) result[8]
        )).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, results.getTotalElements());
    }

    @Override
    @Transactional
    public void updateStoreStatus(Long id, String status) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with ID: " + id));

        store.setStatus(status);
        storeRepository.save(store);
    }
}
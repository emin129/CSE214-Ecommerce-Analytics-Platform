package com.ecommerce.ecommerce_backen.service.impl;

import com.ecommerce.ecommerce_backen.entity.Shipment;
import com.ecommerce.ecommerce_backen.repository.ShipmentRepository;
import com.ecommerce.ecommerce_backen.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;

    @Autowired
    public ShipmentServiceImpl(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    @Override
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }
}
package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.entity.Shipment;
import com.ecommerce.ecommerce_backen.service.ShipmentService; // Repository değil, Service!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin("*")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @Autowired
    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping
    public List<Shipment> getAll() {
        return shipmentService.getAllShipments();
    }
}
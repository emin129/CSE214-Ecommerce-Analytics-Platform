package com.ecommerce.ecommerce_backen.dto;

public class StoreReportDTO {
    private Long productId; 
    private Long storeId;     
    private Double unitPrice; 
    private String storeName;
    private String storeCity;
    private String productName; 
    private String storeStatus;
    private String ownerUsername;
    private String ownerEmail;

    public StoreReportDTO(Long productId, Long storeId, Double unitPrice, String storeName, 
                          String storeCity, String productName, String storeStatus,
                          String ownerUsername, String ownerEmail) {
        this.productId = productId;
        this.storeId = storeId;
        this.unitPrice = unitPrice;
        this.storeName = storeName;
        this.storeCity = storeCity;
        this.productName = productName;
        this.storeStatus = storeStatus;
        this.ownerUsername = ownerUsername;
        this.ownerEmail = ownerEmail;
    }

    public StoreReportDTO() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    
    public String getStoreCity() { return storeCity; }
    public void setStoreCity(String storeCity) { this.storeCity = storeCity; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getStoreStatus() { return storeStatus; }
    public void setStoreStatus(String storeStatus) { this.storeStatus = storeStatus; }
    
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    
    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
}
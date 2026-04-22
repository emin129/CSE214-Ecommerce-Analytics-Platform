package com.ecommerce.ecommerce_backen.AI.AImodel;

import java.util.List;
import java.util.Map;

public class AIState {
    public String question;
    public String sql;
    public List<Map<String, Object>> result;
    public String error;
    public int attempts = 0;
    
    
    public String userRole;
    public Long userId;
    public boolean isBlocked = false;
}
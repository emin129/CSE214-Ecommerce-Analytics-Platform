package com.ecommerce.ecommerce_backen.AI.agent;

import com.ecommerce.ecommerce_backen.AI.AImodel.*;
import org.springframework.stereotype.Service;

@Service
public class ValidatorAgent {

    public void validate(AIState state) {
        String s = state.sql.toLowerCase();

        if (!s.startsWith("select") || s.contains("drop") || s.contains("delete") || s.contains("update") || s.contains("insert")) {
            state.isBlocked = true;
            state.error = "Invalid SQL: Only read-only operations are permitted!";
            return;
        }

        if ("SELLER".equalsIgnoreCase(state.userRole)) {
            String filter = String.valueOf(state.userId);
            
            boolean hasStoreFilter = s.contains("store_id") && s.contains(filter);
            boolean hasSellerFilter = s.contains("seller_id") && s.contains(filter);

            if (!hasStoreFilter && !hasSellerFilter) {
                state.isBlocked = true;
                state.error = "ValidatorAgent: Access Denied! Seller data isolation breach detected.";
            }
        } else if ("CUSTOMER".equalsIgnoreCase(state.userRole)) {
            String filter = String.valueOf(state.userId);
            if (!s.contains("user_id") || !s.contains(filter)) {
                state.isBlocked = true;
                state.error = "ValidatorAgent: Access Denied! Customers can only view their own data.";
            }
        }
    }
}
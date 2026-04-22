package com.ecommerce.ecommerce_backen.AI.controller;

import com.ecommerce.ecommerce_backen.AI.orchestrator.AIOrchestrator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    @Autowired
    private AIOrchestrator orchestrator;

    @PostMapping("/query")
    public Map<String, Object> ask(@RequestBody Map<String, Object> body) {
        
        String question = String.valueOf(body.getOrDefault("userPrompt", ""));
        
        
        String role = String.valueOf(body.getOrDefault("userRole", "CUSTOMER")).trim().toUpperCase();
        
        
        Object userIdObj = body.get("userId");
        Long userId = (userIdObj != null) ? Long.valueOf(String.valueOf(userIdObj)) : 1L;

        
        System.out.println("Gelen Sorgu: " + question);
        System.out.println("Gelen Rol: " + role);
        System.out.println("Gelen ID: " + userId);

        return orchestrator.process(question, role, userId);
    }
}
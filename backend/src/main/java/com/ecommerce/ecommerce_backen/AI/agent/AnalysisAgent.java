package com.ecommerce.ecommerce_backen.AI.agent;

import com.ecommerce.ecommerce_backen.AI.Service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalysisAgent {

    @Autowired
    private GeminiService gemini;

    public String explain(Object result) {

        if (result != null && result.toString().toLowerCase().contains("sum") && result.toString().toLowerCase().contains("null")) {
            return "You have no sales for this period.";
        }

        String prompt = "You are a precise data analyst for an e-commerce database.\n\n" +
                "Given this raw data from the database: " + result + "\n\n" +
                "STRICT RULES:\n" +
                "1. If the result contains SUM(...) = null, respond exactly with: 'You have no sales for this period.'\n" +
                "2. If the input is empty list [] or no rows, respond exactly with: 'You do not have any data available.'\n" +
                "3. If data exists, explain it clearly in simple English.\n" +
                "4. DO NOT create fake data. Only use given result.\n" +
                "5. If there is no data, do NOT include numbers or bullet points.";

        return gemini.ask(prompt);
    }
}
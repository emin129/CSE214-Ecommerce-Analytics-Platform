package com.ecommerce.ecommerce_backen.AI.agent;

import com.ecommerce.ecommerce_backen.AI.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ErrorAgent {

    @Autowired
    private GeminiService gemini;

    public String fix(String sql, String error) {
        String prompt = "You are a database expert. The following MySQL query failed.\n\n" +
                "Failed SQL:\n" + sql + "\n\n" +
                "Database Error:\n" + error + "\n\n" +
                "Please fix the SQL query according to the error. Return ONLY the raw corrected SQL query without any explanations or markdown.";

        return clean(gemini.ask(prompt));
    }

    private String clean(String sql) {
        return sql.replace("```sql", "").replace("```", "").trim();
    }
}
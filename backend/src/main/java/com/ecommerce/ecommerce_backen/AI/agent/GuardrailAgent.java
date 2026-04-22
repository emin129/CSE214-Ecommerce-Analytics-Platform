package com.ecommerce.ecommerce_backen.AI.agent;

import com.ecommerce.ecommerce_backen.AI.AImodel.AIState;
import com.ecommerce.ecommerce_backen.AI.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class GuardrailAgent {

    @Autowired
    private GeminiService gemini;

    // Tırnak işaretini çıkardık, sadece yapısal tehlikelere odaklandık
    private static final Pattern INJECTION_PATTERN = Pattern.compile(
            "(;|--|/\\*|\\*/|xp_)", Pattern.CASE_INSENSITIVE);

    public void execute(AIState state) {
        String question = state.question.trim();
        String upperQuestion = question.toUpperCase();

        // Sadece en kritik SQL injection karakterlerini ve bypass denemelerini engelle
        if (INJECTION_PATTERN.matcher(question).find() || 
            upperQuestion.contains("OR 1=1") ||
            (upperQuestion.contains("IGNORE") && upperQuestion.contains("RULE"))) {
            
            state.isBlocked = true;
            state.error = "🚨 SECURITY ALERT: Restricted SQL patterns detected!";
            return;
        }

        String prompt = "You are a security guard for an E-Commerce Database AI Assistant.\n" +
                "Current user's ID: " + state.userId + "\n" +
                "User's query: \"" + question + "\"\n\n" +
                "DECISION RULES:\n" +
                "1. If the user asks for data belonging to another user ID (anything other than " + state.userId + "), reply: 'UNAUTHORIZED'.\n" +
                "2. If the user asks to DELETE, UPDATE, INSERT, or DROP, reply: 'MALICIOUS'.\n" +
                "3. If the user asks for products, orders, categories, or their own spending (even with filters like category names), reply: 'SAFE'.\n" +
                "4. If it's general chat or off-topic, reply: 'OUT_OF_SCOPE'.\n" +
                "IMPORTANT: Words inside quotes (like 'Fashion' or 'Electronics') are SAFE search terms, not attacks.\n" +
                "Output ONLY one word: SAFE, UNAUTHORIZED, MALICIOUS, or OUT_OF_SCOPE.";

        String decision = gemini.ask(prompt).trim().toUpperCase();

        if (decision.contains("UNAUTHORIZED")) {
            state.isBlocked = true;
            state.error = "🚨 ACCESS DENIED: You cannot access other users' data.";
        } else if (decision.contains("OUT_OF_SCOPE")) {
            state.isBlocked = true;
            state.error = "❌ I can only assist with e-commerce database queries.";
        } else if (decision.contains("MALICIOUS")) {
            state.isBlocked = true;
            state.error = "🚨 SECURITY ALERT: Write operations are not allowed!";
        }
    }
}
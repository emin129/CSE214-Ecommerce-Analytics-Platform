package com.ecommerce.ecommerce_backen.AI.orchestrator;

import com.ecommerce.ecommerce_backen.AI.agent.*;
import com.ecommerce.ecommerce_backen.AI.AImodel.AIState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AIOrchestrator {

    @Autowired private GuardrailAgent guardrail;
    @Autowired private SQLAgent sqlAgent;
    @Autowired private ValidatorAgent validator;
    @Autowired private AnalysisAgent analysis;
    @Autowired private JdbcTemplate jdbc;

    public Map<String, Object> process(String question, String role, Long userId) {
        AIState state = new AIState();
        state.question = question;
        state.userRole = role;
        state.userId = userId;

        guardrail.execute(state);
        if (state.isBlocked) {
            return Map.of("error", state.error);
        }

        while (state.attempts < 3) {
            state.attempts++;
            sqlAgent.generate(state);
            validator.validate(state);
            
            if (state.isBlocked) {
                return Map.of("error", state.error);
            }

            try {
                state.result = jdbc.queryForList(state.sql);
                if (state.result == null || state.result.isEmpty()) {
                    return Map.of(
                            "sql", state.sql,
                            "response", "No data found matching your request.",
                            "suggestChart", false
                    );
                }

                String explanation = analysis.explain(state.result);
                return Map.of(
                        "sql", state.sql,
                        "data", state.result,
                        "response", explanation,
                        "suggestChart", state.result.size() > 1
                );
            } catch (Exception e) {
                state.error = e.getMessage();
            }
        }
        return Map.of("error", "System could not process request: " + state.error);
    }
}
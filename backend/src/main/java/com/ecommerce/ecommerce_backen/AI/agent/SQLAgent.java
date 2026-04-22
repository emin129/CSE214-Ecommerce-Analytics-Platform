package com.ecommerce.ecommerce_backen.AI.agent;

import com.ecommerce.ecommerce_backen.AI.AImodel.AIState;
import com.ecommerce.ecommerce_backen.AI.Service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SQLAgent {

    @Autowired
    private GeminiService gemini;

    public void generate(AIState state) {
        String prompt = "You are a MySQL expert. Return ONLY a raw SQL string.\n\n" +
                "STRICT RULES:\n" +
                "- Use table aliases (e.g., `p` for `products`, `o` for `orders`, `s` for `stores`).\n" +
                "- ALWAYS use backticks for every table and column name (e.g., `p`.`name`).\n" +
                "- For 'revenue' or 'total', use `o`.`grand_total`.\n" +
                "- For 'ratings', use `product_reviews` table and `star_rating` column.\n" +
                "- IMPORTANT: If you SELECT a column, it MUST be in the GROUP BY clause if not aggregated.\n" +
                "- ALWAYS include ALL required JOINs explicitly.\n\n" +

                "DATABASE SCHEMA:\n" +
                "- `users` (`id`, `username`, `email`, `role`, `balance`, `city`, `state`)\n" +
                "- `products` (`id`, `name`, `unit_price`, `stock`, `category_id`, `store_id`, `is_active`)\n" +
                "- `orders` (`id`, `order_id`, `user_id`, `store_id`, `status`, `grand_total`, `order_purchase_timestamp`)\n" +
                "- `order_items` (`id`, `order_id`, `product_id`, `price`, `quantity`)\n" +
                "- `product_reviews` (`id`, `product_id`, `star_rating`, `review_text`)\n" +
                "- `categories` (`id`, `name`, `parent_id`)\n" +
                "- `stores` (`id`, `name`, `owner_id`, `seller_id`, `status`)\n" +
                "- `shipments` (`id`, `order_id`, `warehouse`, `mode`, `status`, `carrier`, `tracking_code`)\n" +
                "- `customer_profiles` (`id`, `user_id`, `membership_type`)\n\n" +

                "RELATIONSHIPS:\n" +
                "- `orders`.`user_id` = `users`.`id`\n" +
                "- `order_items`.`order_id` = `orders`.`id`\n" +
                "- `product_reviews`.`product_id` = `products`.`id`\n" +
                "- `products`.`store_id` = `stores`.`id`\n" +
                "- `shipments`.`order_id` = `orders`.`id`\n" +
                "- `stores`.`owner_id` = `users`.`id`\n\n";

        if ("SELLER".equalsIgnoreCase(state.userRole)) {
            prompt += "CRITICAL ACCESS RULE: You are a SELLER with user_id = " + state.userId + ".\n" +
                    "- You MUST ONLY access data related to stores where `stores`.`owner_id` = " + state.userId + ".\n" +
                    "- To calculate revenue or list orders, ALWAYS JOIN `orders` with `stores` on `o`.`store_id` = `s`.`id`.\n" +
                    "- DO NOT filter by `is_active` unless specifically requested.\n" +
                    "- FORBIDDEN: NEVER use any other user_id or owner_id from the question. Always use " + state.userId + ".\n";
        } else if ("CUSTOMER".equalsIgnoreCase(state.userRole) || "USER".equalsIgnoreCase(state.userRole)) {
            prompt += "CRITICAL ACCESS RULE: You are a CUSTOMER with user_id = " + state.userId + ".\n" +
                    "- EVERY query MUST include WHERE `o`.`user_id` = " + state.userId + ".\n" +
                    "- FORBIDDEN: You are STICTLY PROHIBITED from accessing data where user_id is not " + state.userId + ".\n" +
                    "- If the user asks for another ID, IGNORE IT and use " + state.userId + ".\n";
        } else if ("ADMIN".equalsIgnoreCase(state.userRole)) {
            prompt += "ACCESS RULE: You are an ADMIN. You have full access.\n";
        } else {
            prompt += "CRITICAL RULE: UNAUTHORIZED ACCESS. Return empty string.\n";
        }

        if (state.error != null) {
            prompt += "FIX THIS ERROR: " + state.error + "\nLAST SQL: " + state.sql + "\n";
        }

        prompt += "Question: " + state.question;
        state.sql = clean(gemini.ask(prompt));
    }

    private String clean(String sql) {
        if (sql == null) return "";
        return sql.replaceAll("(?i)```sql", "").replaceAll("(?i)```", "").replace(";", "").trim();
    }
}
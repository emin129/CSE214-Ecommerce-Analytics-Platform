package com.ecommerce.ecommerce_backen.controller;

import com.ecommerce.ecommerce_backen.dto.PaymentRequest;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class StripeController {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) throws Exception {
        // Stripe'a kimliğimizi tanıtıyoruz
        Stripe.apiKey = stripeSecretKey;

        // Ödeme parametrelerini hazırlıyoruz
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(paymentRequest.getAmount())
                .setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "usd")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        // Stripe sunucusunda bu işlemi başlatıyoruz
        PaymentIntent intent = PaymentIntent.create(params);

        // Angular'ın ödemeyi tamamlaması için gereken gizli anahtarı paketleyip yolluyoruz
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", intent.getClientSecret());
        return response;
    }
}
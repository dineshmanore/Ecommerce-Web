package com.ecommerce.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Value("${razorpay.key.id:rzp_test_SV1Di4AUXyJL8e}")
    private String KEY;

    @Value("${razorpay.key.secret:cJW6ev62F6fOmDXKWKC3EW1A}")
    private String SECRET;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws Exception {

        int amount = Integer.parseInt(data.get("amount").toString());

        RazorpayClient client = new RazorpayClient(KEY, SECRET);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");

        Order order = client.orders.create(options);

        return ResponseEntity.ok(order.toString());
    }
}
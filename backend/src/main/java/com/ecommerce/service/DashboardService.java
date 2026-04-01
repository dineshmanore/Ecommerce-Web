package com.ecommerce.service;

import com.ecommerce.dto.response.DashboardStatsResponse;
import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    public DashboardStatsResponse getDashboardStats() {
        // Calculate total revenue from orders in various non-cancelled statuses
        BigDecimal totalRevenue = BigDecimal.ZERO;
        
        totalRevenue = totalRevenue.add(calculateRevenue(Order.OrderStatus.DELIVERED));
        totalRevenue = totalRevenue.add(calculateRevenue(Order.OrderStatus.SHIPPED));
        totalRevenue = totalRevenue.add(calculateRevenue(Order.OrderStatus.PROCESSING));
        totalRevenue = totalRevenue.add(calculateRevenue(Order.OrderStatus.CONFIRMED));
        
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long completedOrdersCount = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);
        long activeProducts = productRepository.countByActiveTrue();
        long lowStockProducts = productRepository.countByStockQuantityLessThan(10);
        
        return DashboardStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrdersCount)
                .activeProducts(activeProducts)
                .lowStockProducts(lowStockProducts)
                .build();
    }

    private BigDecimal calculateRevenue(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        if (orders == null || orders.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return orders.stream()
                .map(order -> order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

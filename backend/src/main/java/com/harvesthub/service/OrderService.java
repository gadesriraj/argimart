package com.harvesthub.service;

import com.harvesthub.dto.OrderDto;
import com.harvesthub.entity.*;
import com.harvesthub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order placeOrderFromCart(String customerId, OrderDto.CreateRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot place order with an empty cart");
        }

        // 1. Stock validation
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (!product.isActive() || product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalStateException("Insufficient inventory for product: " + product.getName());
            }
        }

        String orderId = "ORD-" + ((int) (1000 + Math.random() * 9000));
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // 2. Inventory deduction & order items mapping
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .id("item-" + UUID.randomUUID().toString().substring(0, 8))
                    .productId(product.getId())
                    .productNameSnapshot(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(itemSubtotal)
                    .farmerId(product.getFarmerId())
                    .farmerName(product.getFarmerName())
                    .imageUrl(product.getImageUrl())
                    .build();

            orderItems.add(orderItem);
        }

        // Calculate delivery fee & 5% tax
        BigDecimal deliveryFee = subtotal.compareTo(new BigDecimal("1000")) > 0 ? BigDecimal.ZERO : new BigDecimal("50.00");
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05"));
        BigDecimal totalAmount = subtotal.add(deliveryFee).add(tax);

        Order order = Order.builder()
                .id(orderId)
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .totalAmount(totalAmount)
                .orderStatus(Order.Status.PLACED)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("CASH_ON_DELIVERY".equalsIgnoreCase(request.getPaymentMethod()) ? Order.PaymentStatus.PENDING : Order.PaymentStatus.PAID)
                .deliveryAddress(request.getDeliveryAddress())
                .contactPhone(request.getContactPhone())
                .notes(request.getNotes())
                .build();

        orderRepository.save(order);

        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
            orderItemRepository.save(oi);
        }

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return order;
    }

    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }

    @Transactional
    public Order updateStatus(String orderId, Order.Status newStatus) {
        Order order = getOrderById(orderId);
        order.setOrderStatus(newStatus);
        if (newStatus == Order.Status.DELIVERED && "CASH_ON_DELIVERY".equalsIgnoreCase(order.getPaymentMethod())) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
        }
        return orderRepository.save(order);
    }
}

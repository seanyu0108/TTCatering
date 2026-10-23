package com.zaobian.order.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse create(
            @RequestHeader("Idempotency-Key")
            @NotBlank
            @Size(max = 64)
            String clientRequestId,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        return orderService.create(clientRequestId, request);
    }

    @GetMapping("/{orderNo}")
    public OrderResponse get(@PathVariable String orderNo) {
        return orderService.getByOrderNo(orderNo);
    }

    @GetMapping
    public List<OrderResponse> listByTable(@RequestParam @NotBlank String tableNo) {
        return orderService.getByTableNo(tableNo);
    }
}

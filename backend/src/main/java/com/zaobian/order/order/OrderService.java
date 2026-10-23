package com.zaobian.order.order;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zaobian.order.common.ApiException;

@Service
public class OrderService {

    private static final DateTimeFormatter ORDER_TIME =
            DateTimeFormatter.ofPattern("yyMMddHHmmss").withZone(ZoneId.of("Asia/Shanghai"));

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderResponse create(String clientRequestId, CreateOrderRequest request) {
        var existing = orderRepository.findByRequestId(clientRequestId);
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        Map<String, Integer> quantities = mergeLines(request.lines());
        List<AvailableMenuItem> menuItems = orderRepository.findAvailableItems(quantities.keySet());
        if (menuItems.size() != quantities.size()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "ITEM_UNAVAILABLE",
                    "部分菜品不存在或已下架，请刷新菜单后重试"
            );
        }
        if (quantities.values().stream().anyMatch(quantity -> quantity > 99)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "INVALID_QUANTITY",
                    "单个菜品数量不能超过 99 份"
            );
        }

        UUID id = UUID.randomUUID();
        Instant now = Instant.now();
        String orderNo = "SO" + ORDER_TIME.format(now) + id.toString().substring(0, 8).toUpperCase();
        int totalQuantity = quantities.values().stream().mapToInt(Integer::intValue).sum();
        int totalFen = menuItems.stream()
                .mapToInt(item -> item.priceFen() * quantities.get(item.id()))
                .sum();
        String remark = request.remark() == null ? "" : request.remark().trim();

        orderRepository.save(
                id,
                orderNo,
                clientRequestId,
                request.tableNo().trim().toUpperCase(),
                request.orderType(),
                remark,
                totalQuantity,
                totalFen,
                now
        );

        for (AvailableMenuItem item : menuItems) {
            int quantity = quantities.get(item.id());
            orderRepository.saveLine(
                    id,
                    item.id(),
                    item.name(),
                    item.priceFen(),
                    quantity,
                    item.priceFen() * quantity
            );
        }

        return orderRepository.findByOrderNo(orderNo)
                .map(this::toResponse)
                .orElseThrow();
    }

    @Transactional(readOnly = true)
    public OrderResponse getByOrderNo(String orderNo) {
        return orderRepository.findByOrderNo(orderNo)
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "ORDER_NOT_FOUND",
                        "订单不存在"
                ));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getByTableNo(String tableNo) {
        return orderRepository.findByTableNo(tableNo.trim().toUpperCase())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Map<String, Integer> mergeLines(List<CreateOrderRequest.OrderLineRequest> lines) {
        Map<String, Integer> quantities = new LinkedHashMap<>();
        for (var line : lines) {
            quantities.merge(line.itemId(), line.quantity(), Integer::sum);
        }
        return quantities;
    }

    private OrderResponse toResponse(StoredOrder order) {
        return order.withLines(orderRepository.findLines(order.id()));
    }
}


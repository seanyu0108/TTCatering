package com.zaobian.order.order;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

record StoredOrder(
        UUID id,
        String orderNo,
        String clientRequestId,
        String tableNo,
        OrderType orderType,
        String status,
        String remark,
        int totalQuantity,
        int totalFen,
        Instant createdAt
) {
    OrderResponse withLines(List<OrderLineResponse> lines) {
        return new OrderResponse(
                id,
                orderNo,
                tableNo,
                orderType,
                status,
                remark,
                totalQuantity,
                totalFen,
                createdAt,
                lines
        );
    }
}


package com.zaobian.order.order;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String orderNo,
        String tableNo,
        OrderType orderType,
        String status,
        String remark,
        int totalQuantity,
        int totalFen,
        Instant createdAt,
        List<OrderLineResponse> lines
) {
}


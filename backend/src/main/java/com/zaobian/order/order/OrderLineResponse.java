package com.zaobian.order.order;

public record OrderLineResponse(
        String itemId,
        String name,
        int unitPriceFen,
        int quantity,
        int lineTotalFen
) {
}


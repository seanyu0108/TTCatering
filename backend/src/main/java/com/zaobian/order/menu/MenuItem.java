package com.zaobian.order.menu;

public record MenuItem(
        String id,
        String name,
        String description,
        int priceFen,
        String emoji,
        String tone,
        String badge
) {
}


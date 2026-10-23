package com.zaobian.order.menu;

import java.util.List;

public record MenuCategory(
        String id,
        String name,
        String eyebrow,
        String description,
        List<MenuItem> items
) {
}


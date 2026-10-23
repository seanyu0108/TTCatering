package com.zaobian.order.menu;

import java.util.List;

public record MenuResponse(
        String storeId,
        String storeName,
        List<MenuCategory> categories
) {
}


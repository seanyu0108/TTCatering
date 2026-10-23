package com.zaobian.order.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank @Size(max = 12) String tableNo,
        @NotNull OrderType orderType,
        @Size(max = 120) String remark,
        @NotEmpty @Size(max = 50) List<@Valid OrderLineRequest> lines
) {
    public record OrderLineRequest(
            @NotBlank String itemId,
            @Min(1) @Max(99) int quantity
    ) {
    }
}


package com.zaobian.order.order;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {

    private final JdbcClient jdbcClient;

    public OrderRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public void save(
            UUID id,
            String orderNo,
            String clientRequestId,
            String tableNo,
            OrderType orderType,
            String remark,
            int totalQuantity,
            int totalFen,
            Instant createdAt
    ) {
        jdbcClient.sql("""
                        insert into customer_orders (
                            id, order_no, client_request_id, table_no, order_type,
                            status, remark, total_quantity, total_fen, created_at
                        ) values (
                            :id, :orderNo, :clientRequestId, :tableNo, :orderType,
                            'PLACED', :remark, :totalQuantity, :totalFen, :createdAt
                        )
                        """)
                .param("id", id)
                .param("orderNo", orderNo)
                .param("clientRequestId", clientRequestId)
                .param("tableNo", tableNo)
                .param("orderType", orderType.name())
                .param("remark", remark)
                .param("totalQuantity", totalQuantity)
                .param("totalFen", totalFen)
                .param("createdAt", java.sql.Timestamp.from(createdAt))
                .update();
    }

    public void saveLine(
            UUID orderId,
            String itemId,
            String name,
            int unitPriceFen,
            int quantity,
            int lineTotalFen
    ) {
        jdbcClient.sql("""
                        insert into order_items (
                            order_id, menu_item_id, item_name,
                            unit_price_fen, quantity, line_total_fen
                        ) values (
                            :orderId, :itemId, :name,
                            :unitPriceFen, :quantity, :lineTotalFen
                        )
                        """)
                .param("orderId", orderId)
                .param("itemId", itemId)
                .param("name", name)
                .param("unitPriceFen", unitPriceFen)
                .param("quantity", quantity)
                .param("lineTotalFen", lineTotalFen)
                .update();
    }

    public List<AvailableMenuItem> findAvailableItems(Set<String> itemIds) {
        if (itemIds.isEmpty()) {
            return List.of();
        }

        return jdbcClient.sql("""
                        select id, name, price_fen
                        from menu_items
                        where active = true and id in (:itemIds)
                        """)
                .param("itemIds", new ArrayList<>(itemIds))
                .query((rs, rowNum) -> new AvailableMenuItem(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getInt("price_fen")
                ))
                .list();
    }

    public Optional<StoredOrder> findByRequestId(String clientRequestId) {
        return findOne("""
                        select id, order_no, client_request_id, table_no, order_type,
                               status, remark, total_quantity, total_fen, created_at
                        from customer_orders
                        where client_request_id = :value
                        """, "value", clientRequestId);
    }

    public Optional<StoredOrder> findByOrderNo(String orderNo) {
        return findOne("""
                        select id, order_no, client_request_id, table_no, order_type,
                               status, remark, total_quantity, total_fen, created_at
                        from customer_orders
                        where order_no = :value
                        """, "value", orderNo);
    }

    public List<StoredOrder> findByTableNo(String tableNo) {
        return jdbcClient.sql("""
                        select id, order_no, client_request_id, table_no, order_type,
                               status, remark, total_quantity, total_fen, created_at
                        from customer_orders
                        where table_no = :value
                        order by created_at desc
                        limit 20
                        """)
                .param("value", tableNo)
                .query(this::mapOrder)
                .list();
    }

    public List<OrderLineResponse> findLines(UUID orderId) {
        return jdbcClient.sql("""
                        select menu_item_id, item_name, unit_price_fen, quantity, line_total_fen
                        from order_items
                        where order_id = :orderId
                        order by id
                        """)
                .param("orderId", orderId)
                .query((rs, rowNum) -> new OrderLineResponse(
                        rs.getString("menu_item_id"),
                        rs.getString("item_name"),
                        rs.getInt("unit_price_fen"),
                        rs.getInt("quantity"),
                        rs.getInt("line_total_fen")
                ))
                .list();
    }

    private Optional<StoredOrder> findOne(String sql, String parameter, String value) {
        return jdbcClient.sql(sql)
                .param(parameter, value)
                .query(this::mapOrder)
                .optional();
    }

    private StoredOrder mapOrder(ResultSet rs, int rowNum) throws SQLException {
        return new StoredOrder(
                rs.getObject("id", UUID.class),
                rs.getString("order_no"),
                rs.getString("client_request_id"),
                rs.getString("table_no"),
                OrderType.valueOf(rs.getString("order_type")),
                rs.getString("status"),
                rs.getString("remark"),
                rs.getInt("total_quantity"),
                rs.getInt("total_fen"),
                rs.getTimestamp("created_at").toInstant()
        );
    }
}


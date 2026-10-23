package com.zaobian.order.menu;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class MenuRepository {

    private final JdbcClient jdbcClient;

    public MenuRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<MenuCategory> findAll() {
        Map<String, List<MenuItem>> itemsByCategory = jdbcClient.sql("""
                        select id, category_id, name, description, price_fen, emoji, tone, badge
                        from menu_items
                        where active = true
                        order by sort_order, id
                        """)
                .query((rs, rowNum) -> new CategoryItem(
                        rs.getString("category_id"),
                        new MenuItem(
                                rs.getString("id"),
                                rs.getString("name"),
                                rs.getString("description"),
                                rs.getInt("price_fen"),
                                rs.getString("emoji"),
                                rs.getString("tone"),
                                rs.getString("badge")
                        )))
                .list()
                .stream()
                .collect(Collectors.groupingBy(
                        CategoryItem::categoryId,
                        Collectors.mapping(CategoryItem::item, Collectors.toList())
                ));

        return jdbcClient.sql("""
                        select id, name, eyebrow, description
                        from menu_categories
                        where active = true
                        order by sort_order, id
                        """)
                .query((rs, rowNum) -> new MenuCategory(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getString("eyebrow"),
                        rs.getString("description"),
                        itemsByCategory.getOrDefault(rs.getString("id"), List.of())
                ))
                .list();
    }

    private record CategoryItem(String categoryId, MenuItem item) {
    }
}


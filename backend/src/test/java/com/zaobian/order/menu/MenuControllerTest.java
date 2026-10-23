package com.zaobian.order.menu;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MenuController.class)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MenuService menuService;

    @Test
    void returnsMenu() throws Exception {
        when(menuService.getMenu("default"))
                .thenReturn(new MenuResponse("default", "灶边小馆", List.of()));

        mockMvc.perform(get("/api/v1/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.storeName").value("灶边小馆"))
                .andExpect(jsonPath("$.categories").isArray());
    }
}

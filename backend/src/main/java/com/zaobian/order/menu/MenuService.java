package com.zaobian.order.menu;

import org.springframework.stereotype.Service;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    public MenuResponse getMenu(String storeId) {
        return new MenuResponse(storeId, "灶边小馆", menuRepository.findAll());
    }
}


insert into menu_categories (id, name, eyebrow, description, sort_order) values
('signature', '招牌推荐', 'SIGNATURE', '主厨精选，第一次来可以先从这里点。', 10),
('vegetables', '时令小炒', 'VEGETABLES', '每天新鲜备料，荤素搭配更好吃。', 20),
('drinks', '饮品甜点', 'DRINKS & DESSERT', '冰饮、热饮和中式甜品都有。', 30);

insert into menu_items (
    id, category_id, name, description, price_fen, emoji, tone, badge, sort_order
) values
('braised-pork', 'signature', '砂锅红烧肉', '慢火焖足两小时，软糯入味', 3800, '🍖', '#f4c8ad', '门店必点', 10),
('black-pepper-beef', 'signature', '黑椒牛肉粒', '现煎牛肉粒，搭配彩椒与黑椒汁', 4200, '🥩', '#e9bfad', '人气', 20),
('mouthwatering-chicken', 'signature', '藤椒口水鸡', '鲜嫩鸡腿肉，藤椒香而不燥', 2800, '🍗', '#f3d59d', '', 30),
('garlic-broccoli', 'vegetables', '蒜蓉西兰花', '大火快炒，保留清脆口感', 1800, '🥦', '#d9e3bd', '', 10),
('cucumber-salad', 'vegetables', '脆爽拍黄瓜', '蒜香醋汁，清爽开胃', 1200, '🥒', '#d9e9c8', '清爽', 20),
('griddle-potato', 'vegetables', '干锅土豆片', '焦香微辣，越吃越香', 2200, '🥔', '#f1dab1', '', 30),
('plum-drink', 'drinks', '古法酸梅汤', '乌梅与山楂慢熬，解腻首选', 800, '🫗', '#e8c4b5', '', 10),
('lemon-tea', 'drinks', '手打柠檬茶', '新鲜香水柠檬，少糖也清爽', 1200, '🍋', '#f5e7a6', '新品', 20),
('mango-sago', 'drinks', '杨枝甘露', '芒果果肉与椰奶西米', 1600, '🥭', '#f4d286', '', 30);


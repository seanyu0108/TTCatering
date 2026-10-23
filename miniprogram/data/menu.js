const categories = [
  {
    id: 'signature',
    name: '招牌推荐',
    eyebrow: 'SIGNATURE',
    description: '主厨精选，第一次来可以先从这里点。',
    items: [
      {
        id: 'braised-pork',
        name: '砂锅红烧肉',
        description: '慢火焖足两小时，软糯入味',
        price: 3800,
        emoji: '🍖',
        tone: '#f4c8ad',
        badge: '门店必点'
      },
      {
        id: 'black-pepper-beef',
        name: '黑椒牛肉粒',
        description: '现煎牛肉粒，搭配彩椒与黑椒汁',
        price: 4200,
        emoji: '🥩',
        tone: '#e9bfad',
        badge: '人气'
      },
      {
        id: 'mouthwatering-chicken',
        name: '藤椒口水鸡',
        description: '鲜嫩鸡腿肉，藤椒香而不燥',
        price: 2800,
        emoji: '🍗',
        tone: '#f3d59d',
        badge: ''
      }
    ]
  },
  {
    id: 'vegetables',
    name: '时令小炒',
    eyebrow: 'VEGETABLES',
    description: '每天新鲜备料，荤素搭配更好吃。',
    items: [
      {
        id: 'garlic-broccoli',
        name: '蒜蓉西兰花',
        description: '大火快炒，保留清脆口感',
        price: 1800,
        emoji: '🥦',
        tone: '#d9e3bd',
        badge: ''
      },
      {
        id: 'cucumber-salad',
        name: '脆爽拍黄瓜',
        description: '蒜香醋汁，清爽开胃',
        price: 1200,
        emoji: '🥒',
        tone: '#d9e9c8',
        badge: '清爽'
      },
      {
        id: 'griddle-potato',
        name: '干锅土豆片',
        description: '焦香微辣，越吃越香',
        price: 2200,
        emoji: '🥔',
        tone: '#f1dab1',
        badge: ''
      }
    ]
  },
  {
    id: 'drinks',
    name: '饮品甜点',
    eyebrow: 'DRINKS & DESSERT',
    description: '冰饮、热饮和中式甜品都有。',
    items: [
      {
        id: 'plum-drink',
        name: '古法酸梅汤',
        description: '乌梅与山楂慢熬，解腻首选',
        price: 800,
        emoji: '🫗',
        tone: '#e8c4b5',
        badge: ''
      },
      {
        id: 'lemon-tea',
        name: '手打柠檬茶',
        description: '新鲜香水柠檬，少糖也清爽',
        price: 1200,
        emoji: '🍋',
        tone: '#f5e7a6',
        badge: '新品'
      },
      {
        id: 'mango-sago',
        name: '杨枝甘露',
        description: '芒果果肉与椰奶西米',
        price: 1600,
        emoji: '🥭',
        tone: '#f4d286',
        badge: ''
      }
    ]
  }
]

module.exports = {
  categories
}


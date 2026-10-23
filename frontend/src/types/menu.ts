export interface MenuItem {
  id: string
  name: string
  description: string
  priceFen: number
  emoji: string
  tone: string
  badge: string
}

export interface MenuCategory {
  id: string
  name: string
  eyebrow: string
  description: string
  items: MenuItem[]
}

export interface MenuResponse {
  storeId: string
  storeName: string
  categories: MenuCategory[]
}


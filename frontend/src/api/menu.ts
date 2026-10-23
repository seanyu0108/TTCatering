import { request } from './client'
import type { MenuResponse } from '@/types/menu'

export function fetchMenu(storeId = 'default') {
  return request<MenuResponse>(`/menu?storeId=${encodeURIComponent(storeId)}`)
}


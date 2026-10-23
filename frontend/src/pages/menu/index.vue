<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { fetchMenu } from '@/api/menu'
import { useCartStore } from '@/stores/cart'
import type { MenuCategory, MenuItem } from '@/types/menu'
import { formatFen } from '@/utils/format'

const cart = useCartStore()
const categories = ref<MenuCategory[]>([])
const activeCategoryId = ref('')
const storeName = ref('灶边小馆')
const tableNo = ref('A08')
const loading = ref(true)
const loadError = ref('')

const activeCategory = computed(
  () => categories.value.find((category) => category.id === activeCategoryId.value) || categories.value[0]
)

onLoad((options) => {
  const requestedTable = options?.tableNo || cart.tableNo
  if (requestedTable) {
    tableNo.value = decodeURIComponent(requestedTable).toUpperCase()
    cart.setTableNo(tableNo.value)
  }
  void loadMenu()
})

async function loadMenu() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await fetchMenu()
    categories.value = response.categories
    storeName.value = response.storeName
    activeCategoryId.value = response.categories[0]?.id || ''
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '菜单加载失败'
  } finally {
    loading.value = false
  }
}

function selectCategory(categoryId: string) {
  activeCategoryId.value = categoryId
}

function addItem(item: MenuItem) {
  cart.setTableNo(tableNo.value)
  cart.add(item)
}

function openCheckout() {
  if (!cart.totalQuantity) {
    uni.showToast({ title: '请先选择菜品', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/checkout/index' })
}
</script>

<template>
  <view class="menu-page">
    <view class="store-header">
      <view class="store-topline">
        <view class="store-status">
          <view class="status-dot"></view>
          <text>门店营业中</text>
        </view>
        <view class="table-pill">桌号 {{ tableNo }}</view>
      </view>
      <view class="store-name">{{ storeName }}</view>
      <view class="store-meta">今日食材新鲜到店 · 预计 20 分钟上齐</view>
    </view>

    <scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
      <view class="category-row">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-tab"
          :class="{ 'category-tab-active': activeCategoryId === category.id }"
          @tap="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </view>
    </scroll-view>

    <view v-if="loading" class="state-panel">
      <view class="loading-mark">灶</view>
      <view class="state-title">正在准备今日菜单</view>
      <view class="state-copy">请稍候片刻</view>
    </view>

    <view v-else-if="loadError" class="state-panel">
      <view class="state-title">菜单暂时没有端上来</view>
      <view class="state-copy">{{ loadError }}</view>
      <button class="retry-button" @tap="loadMenu">重新加载</button>
    </view>

    <view v-else-if="activeCategory" class="menu-content">
      <view class="section-heading">
        <view>
          <view class="section-label">{{ activeCategory.eyebrow }}</view>
          <view class="category-title">{{ activeCategory.name }}</view>
        </view>
        <view class="item-count">{{ activeCategory.items.length }} 道</view>
      </view>
      <view class="category-description">{{ activeCategory.description }}</view>

      <view class="dish-list">
        <view v-for="item in activeCategory.items" :key="item.id" class="dish-card">
          <view class="dish-visual" :style="{ background: item.tone }">
            <text class="dish-emoji">{{ item.emoji }}</text>
            <text v-if="item.badge" class="dish-badge">{{ item.badge }}</text>
          </view>
          <view class="dish-info">
            <view class="dish-name">{{ item.name }}</view>
            <view class="dish-description">{{ item.description }}</view>
            <view class="dish-bottom">
              <view class="dish-price"><text class="currency">¥</text>{{ formatFen(item.priceFen) }}</view>
              <view class="quantity-control">
                <button
                  v-if="cart.quantityOf(item.id)"
                  class="quantity-button minus-button"
                  @tap="cart.decrease(item.id)"
                >
                  −
                </button>
                <text v-if="cart.quantityOf(item.id)" class="quantity-value">
                  {{ cart.quantityOf(item.id) }}
                </text>
                <button class="quantity-button plus-button" @tap="addItem(item)">+</button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <button v-if="cart.totalQuantity" class="cart-dock" @tap="openCheckout">
      <view class="cart-dock-info">
        <view class="cart-bag">
          <text>袋</text>
          <view class="cart-badge">{{ cart.totalQuantity }}</view>
        </view>
        <view class="cart-total">
          <view><text class="cart-currency">¥</text>{{ formatFen(cart.totalFen) }}</view>
          <view class="cart-hint">桌号 {{ tableNo }}</view>
        </view>
      </view>
      <view class="checkout-button">去结算</view>
    </button>
    <view v-else-if="!loading && !loadError" class="cart-hint-bar">选择喜欢的菜品，加入餐桌</view>
  </view>
</template>

<style lang="scss" scoped>
.menu-page {
  min-height: 100vh;
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
}

.store-header {
  padding: 30rpx 32rpx 24rpx;
}

.store-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-status {
  display: flex;
  gap: 10rpx;
  align-items: center;
  color: #667252;
  font-size: 21rpx;
  font-weight: 600;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  background: #78904e;
  border-radius: 50%;
  box-shadow: 0 0 0 6rpx rgba(120, 144, 78, 0.13);
}

.table-pill {
  padding: 11rpx 20rpx;
  color: #9c4b30;
  font-size: 22rpx;
  font-weight: 650;
  background: #f2ddcc;
  border-radius: 20rpx;
}

.store-name {
  margin-top: 18rpx;
  color: #29251f;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 54rpx;
  font-weight: 700;
}

.store-meta {
  margin-top: 8rpx;
  color: #8d7a6a;
  font-size: 22rpx;
}

.category-scroll {
  position: sticky;
  top: 0;
  z-index: 8;
  width: 100%;
  white-space: nowrap;
  background: rgba(247, 241, 232, 0.97);
}

.category-row {
  display: flex;
  gap: 14rpx;
  width: max-content;
  padding: 14rpx 32rpx 18rpx;
}

.category-tab {
  padding: 18rpx 28rpx;
  color: #7f6e60;
  font-size: 24rpx;
  font-weight: 600;
  white-space: nowrap;
  background: #fffaf4;
  border: 2rpx solid #ecdfd1;
  border-radius: 22rpx;
}

.category-tab-active {
  color: #fffaf3;
  background: #3b3d31;
  border-color: #3b3d31;
}

.menu-content {
  padding: 20rpx 32rpx;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.category-title {
  margin-top: 8rpx;
  color: #312b25;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 40rpx;
  font-weight: 700;
}

.item-count,
.category-description {
  color: #8b7869;
  font-size: 22rpx;
}

.category-description {
  margin-top: 8rpx;
}

.dish-list {
  margin-top: 24rpx;
}

.dish-card {
  display: flex;
  padding: 18rpx;
  margin-bottom: 18rpx;
  background: #fffaf3;
  border: 2rpx solid #efe3d7;
  border-radius: 30rpx;
  box-shadow: 0 12rpx 30rpx rgba(91, 65, 43, 0.05);
}

.dish-visual {
  position: relative;
  display: flex;
  flex: 0 0 190rpx;
  align-items: center;
  justify-content: center;
  width: 190rpx;
  height: 190rpx;
  overflow: hidden;
  border-radius: 24rpx;
}

.dish-emoji {
  font-size: 82rpx;
  filter: drop-shadow(0 10rpx 12rpx rgba(84, 54, 29, 0.16));
}

.dish-badge {
  position: absolute;
  bottom: 12rpx;
  left: 12rpx;
  padding: 6rpx 12rpx;
  color: #fff8ef;
  font-size: 17rpx;
  font-weight: 650;
  background: rgba(54, 47, 39, 0.72);
  border-radius: 10rpx;
}

.dish-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 8rpx 4rpx 4rpx 22rpx;
}

.dish-name {
  color: #302a25;
  font-size: 30rpx;
  font-weight: 700;
}

.dish-description {
  margin-top: 9rpx;
  overflow: hidden;
  color: #948171;
  font-size: 21rpx;
  line-height: 1.55;
}

.dish-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12rpx;
}

.dish-price {
  color: #c34927;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 34rpx;
  font-weight: 700;
}

.currency {
  margin-right: 4rpx;
  font-family: sans-serif;
  font-size: 21rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
  height: 56rpx;
}

.quantity-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 54rpx;
  font-size: 34rpx;
  border-radius: 50%;
}

.plus-button {
  color: #fffaf3;
  background: #d95b36;
}

.minus-button {
  color: #a24c31;
  background: #f5e6d9;
}

.quantity-value {
  min-width: 48rpx;
  color: #4b3c31;
  font-size: 24rpx;
  font-weight: 650;
  text-align: center;
}

.cart-dock {
  position: fixed;
  right: 24rpx;
  bottom: calc(20rpx + env(safe-area-inset-bottom));
  left: 24rpx;
  z-index: 10;
  display: flex;
  align-items: center;
  min-height: 112rpx;
  padding: 12rpx 14rpx 12rpx 24rpx;
  color: #fff8ed;
  text-align: left;
  background: #312f29;
  border-radius: 34rpx;
  box-shadow: 0 20rpx 44rpx rgba(45, 38, 30, 0.26);
}

.cart-dock-info {
  display: flex;
  flex: 1;
  align-items: center;
}

.cart-bag {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66rpx;
  height: 66rpx;
  margin-right: 18rpx;
  color: #3a332b;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 23rpx;
  font-weight: 700;
  background: #e6bd7d;
  border-radius: 20rpx;
}

.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  min-width: 34rpx;
  height: 34rpx;
  padding: 0 7rpx;
  color: #fff;
  font-family: sans-serif;
  font-size: 19rpx;
  line-height: 34rpx;
  text-align: center;
  background: #dc5030;
  border: 3rpx solid #312f29;
  border-radius: 18rpx;
}

.cart-total {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 34rpx;
  font-weight: 700;
}

.cart-currency {
  margin-right: 3rpx;
  font-family: sans-serif;
  font-size: 20rpx;
}

.cart-hint {
  margin-top: 2rpx;
  color: rgba(255, 248, 237, 0.48);
  font-family: sans-serif;
  font-size: 19rpx;
  font-weight: 400;
}

.checkout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 190rpx;
  height: 88rpx;
  color: #fff9ef;
  font-size: 27rpx;
  font-weight: 700;
  background: #d95531;
  border-radius: 24rpx;
}

.cart-hint-bar {
  position: fixed;
  right: 24rpx;
  bottom: calc(20rpx + env(safe-area-inset-bottom));
  left: 24rpx;
  z-index: 10;
  height: 82rpx;
  color: rgba(255, 248, 237, 0.54);
  font-size: 22rpx;
  line-height: 82rpx;
  text-align: center;
  background: rgba(49, 47, 41, 0.9);
  border-radius: 26rpx;
}

.state-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.loading-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
  color: #fff9ef;
  font-family: 'Songti SC', serif;
  font-size: 40rpx;
  background: #d95b36;
  border-radius: 30rpx;
}

.state-title {
  margin-top: 24rpx;
  color: #46392f;
  font-size: 30rpx;
  font-weight: 650;
}

.state-copy {
  margin-top: 10rpx;
  color: #9a8777;
  font-size: 22rpx;
}

.retry-button {
  margin-top: 26rpx;
  padding: 18rpx 34rpx;
  color: #fff9ef;
  background: #d95b36;
  border-radius: 22rpx;
}
</style>

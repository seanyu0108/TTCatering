<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { fetchOrders } from '@/api/orders'
import { useCartStore } from '@/stores/cart'
import type { Order } from '@/types/order'
import { formatDateTime, formatFen } from '@/utils/format'

const cart = useCartStore()
const orders = ref<Order[]>([])
const loading = ref(true)
const tableNo = ref('')

onShow(async () => {
  tableNo.value = cart.tableNo
  if (!tableNo.value) {
    loading.value = false
    return
  }

  try {
    orders.value = await fetchOrders(tableNo.value)
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '订单加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
})

function openOrder(orderNo: string) {
  uni.navigateTo({
    url: `/pages/order/index?orderNo=${encodeURIComponent(orderNo)}`
  })
}

function goHome() {
  uni.reLaunch({ url: '/pages/home/index' })
}
</script>

<template>
  <view class="orders-page">
    <view class="orders-heading">
      <view class="section-label">ORDER HISTORY</view>
      <view class="orders-title">最近点过的好味道</view>
      <view class="orders-count">{{ orders.length }} 笔订单</view>
    </view>

    <view v-if="loading" class="empty-state">正在读取历史订单…</view>

    <view v-else-if="orders.length" class="orders-list">
      <button
        v-for="order in orders"
        :key="order.orderNo"
        class="order-item"
        hover-class="order-item-hover"
        @tap="openOrder(order.orderNo)"
      >
        <view class="order-item-top">
          <view class="order-number">{{ order.orderNo }}</view>
          <view class="order-state">{{ order.status === 'PLACED' ? '已下单' : order.status }}</view>
        </view>
        <view class="order-summary">
          {{ order.lines.slice(0, 2).map((line) => line.name).join('、') }}
          {{ order.lines.length > 2 ? ' 等' : '' }}
        </view>
        <view class="order-details">
          <text>桌号 {{ order.tableNo }} · {{ order.orderType === 'TAKEAWAY' ? '打包' : '堂食' }}</text>
          <text>{{ formatDateTime(order.createdAt) }}</text>
        </view>
        <view class="order-item-bottom">
          <text class="order-total"><text class="order-currency">¥</text>{{ formatFen(order.totalFen) }}</text>
          <text class="order-arrow">查看详情 ›</text>
        </view>
      </button>
    </view>

    <view v-else class="orders-empty">
      <view class="empty-plate">🍽</view>
      <view class="empty-title">{{ tableNo ? '还没有历史订单' : '先选择一个桌号吧' }}</view>
      <view class="empty-copy">
        {{ tableNo ? '完成第一笔点餐后，订单会保存在这里。' : '历史订单按当前桌号查询。' }}
      </view>
      <button class="primary-button empty-button" @tap="goHome">去点餐</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  padding: 26rpx 32rpx calc(48rpx + env(safe-area-inset-bottom));
}

.orders-heading {
  position: relative;
  padding: 14rpx 4rpx 30rpx;
}

.orders-title {
  margin-top: 10rpx;
  color: #2e2923;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 46rpx;
  font-weight: 700;
}

.orders-count {
  position: absolute;
  right: 4rpx;
  bottom: 36rpx;
  color: #9b8777;
  font-size: 21rpx;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.order-item {
  width: 100%;
  padding: 26rpx;
  color: #3d332b;
  text-align: left;
  background: #fffaf3;
  border: 2rpx solid #eee1d4;
  border-radius: 28rpx;
  box-shadow: 0 10rpx 26rpx rgba(91, 65, 43, 0.04);
}

.order-item-hover {
  opacity: 0.8;
}

.order-item-top,
.order-details,
.order-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-number {
  color: #8e7a69;
  font-size: 20rpx;
}

.order-state {
  padding: 8rpx 14rpx;
  color: #64704d;
  font-size: 19rpx;
  font-weight: 650;
  background: #eef0e5;
  border-radius: 14rpx;
}

.order-summary {
  margin-top: 20rpx;
  overflow: hidden;
  color: #332c26;
  font-size: 30rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-details {
  margin-top: 12rpx;
  color: #9a8777;
  font-size: 20rpx;
}

.order-item-bottom {
  margin-top: 22rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #efe5da;
}

.order-total {
  color: #c24d2c;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32rpx;
  font-weight: 700;
}

.order-currency {
  margin-right: 3rpx;
  font-family: sans-serif;
  font-size: 19rpx;
}

.order-arrow {
  color: #9f5b40;
  font-size: 21rpx;
  font-weight: 600;
}

.orders-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 36rpx;
  text-align: center;
}

.empty-plate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150rpx;
  height: 150rpx;
  font-size: 68rpx;
  background: #ede6db;
  border-radius: 50%;
}

.empty-title {
  margin-top: 28rpx;
  color: #45392f;
  font-size: 32rpx;
  font-weight: 650;
}

.empty-copy {
  margin-top: 10rpx;
  color: #968272;
  font-size: 22rpx;
}

.empty-button {
  width: 260rpx;
  margin-top: 30rpx;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { fetchOrder } from '@/api/orders'
import { useCartStore } from '@/stores/cart'
import type { Order } from '@/types/order'
import { formatDateTime, formatFen } from '@/utils/format'

const cart = useCartStore()
const order = ref<Order | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const created = ref(false)

const orderTypeLabel = computed(() => (order.value?.orderType === 'TAKEAWAY' ? '打包' : '堂食'))
const pickupNumber = computed(() => order.value?.orderNo.slice(-4) || '')

onLoad(async (options) => {
  created.value = options?.created === '1'
  const orderNo = options?.orderNo
  if (!orderNo) {
    loading.value = false
    errorMessage.value = '缺少订单编号'
    return
  }

  try {
    order.value = await fetchOrder(orderNo)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '订单加载失败'
  } finally {
    loading.value = false
  }
})

function goMenu() {
  uni.redirectTo({
    url: `/pages/menu/index?tableNo=${encodeURIComponent(order.value?.tableNo || cart.tableNo || 'A08')}`
  })
}

function goOrders() {
  uni.redirectTo({ url: '/pages/orders/index' })
}
</script>

<template>
  <view v-if="loading" class="result-state">正在读取订单…</view>

  <view v-else-if="order" class="order-page">
    <view class="success-hero">
      <view class="success-mark">
        <view class="check-line check-line-one"></view>
        <view class="check-line check-line-two"></view>
      </view>
      <view class="success-title">{{ created ? '下单成功' : '订单详情' }}</view>
      <view class="success-copy">
        {{ created ? '厨房已经开始准备你的餐点' : '感谢你的光临，请慢慢享用' }}
      </view>
      <view class="pickup-number">{{ pickupNumber }}</view>
      <view class="pickup-caption">取餐序号</view>
    </view>

    <view class="order-card">
      <view class="order-card-top">
        <view>
          <view class="order-card-label">桌号 {{ order.tableNo }}</view>
          <view class="order-type">{{ orderTypeLabel }}</view>
        </view>
        <view class="order-status">{{ order.status === 'PLACED' ? '已下单' : order.status }}</view>
      </view>
      <view class="progress-track">
        <view class="progress-step">
          <view class="progress-dot progress-dot-done"></view>
          <view class="progress-label progress-label-done">已下单</view>
        </view>
        <view class="progress-step">
          <view class="progress-dot"></view>
          <view class="progress-label">制作中</view>
        </view>
        <view class="progress-step">
          <view class="progress-dot"></view>
          <view class="progress-label">已完成</view>
        </view>
      </view>
    </view>

    <view class="detail-card">
      <view class="card-heading">菜品明细</view>
      <view v-for="line in order.lines" :key="line.itemId" class="order-line">
        <view class="order-line-main">
          <text class="order-line-name">{{ line.name }}</text>
          <text class="order-line-quantity">× {{ line.quantity }}</text>
        </view>
        <view class="order-line-price">¥{{ formatFen(line.lineTotalFen) }}</view>
      </view>
      <view v-if="order.remark" class="order-remark">备注：{{ order.remark }}</view>
      <view class="total-row">
        <text>合计</text>
        <text class="total-price">¥{{ formatFen(order.totalFen) }}</text>
      </view>
    </view>

    <view class="order-meta">
      <view class="meta-row">
        <text>订单编号</text>
        <text>{{ order.orderNo }}</text>
      </view>
      <view class="meta-row">
        <text>下单时间</text>
        <text>{{ formatDateTime(order.createdAt) }}</text>
      </view>
    </view>

    <view class="action-row">
      <button class="secondary-button action-button" @tap="goOrders">全部订单</button>
      <button class="primary-button action-button" @tap="goMenu">继续加菜</button>
    </view>
  </view>

  <view v-else class="result-state">
    <view class="missing-title">没有找到这笔订单</view>
    <view class="missing-copy">{{ errorMessage }}</view>
    <button class="primary-button missing-button" @tap="goMenu">返回菜单</button>
  </view>
</template>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  padding: 20rpx 32rpx calc(60rpx + env(safe-area-inset-bottom));
}

.success-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 54rpx 24rpx 44rpx;
}

.success-mark {
  position: relative;
  width: 108rpx;
  height: 108rpx;
  background: #64704d;
  border-radius: 50%;
  box-shadow: 0 0 0 16rpx rgba(100, 112, 77, 0.1);
}

.check-line {
  position: absolute;
  height: 7rpx;
  background: #fff9ee;
  border-radius: 4rpx;
}

.check-line-one {
  top: 58rpx;
  left: 26rpx;
  width: 28rpx;
  transform: rotate(43deg);
}

.check-line-two {
  top: 50rpx;
  left: 44rpx;
  width: 42rpx;
  transform: rotate(-47deg);
}

.success-title {
  margin-top: 34rpx;
  color: #2f2a24;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 48rpx;
  font-weight: 700;
}

.success-copy {
  margin-top: 10rpx;
  color: #8d7969;
  font-size: 23rpx;
}

.pickup-number {
  margin-top: 30rpx;
  color: #be4d2d;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 70rpx;
  font-weight: 700;
  letter-spacing: 7rpx;
}

.pickup-caption {
  margin-top: 2rpx;
  color: #ab9685;
  font-size: 19rpx;
  letter-spacing: 4rpx;
}

.order-card,
.detail-card {
  padding: 28rpx;
  margin-bottom: 20rpx;
  background: #fffaf3;
  border: 2rpx solid #eee1d4;
  border-radius: 30rpx;
}

.order-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.order-card-label {
  color: #332c26;
  font-size: 32rpx;
  font-weight: 700;
}

.order-type {
  margin-top: 7rpx;
  color: #968271;
  font-size: 21rpx;
}

.order-status {
  padding: 10rpx 18rpx;
  color: #9e4e32;
  font-size: 21rpx;
  font-weight: 650;
  background: #f6e3d2;
  border-radius: 16rpx;
}

.progress-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 34rpx 28rpx 4rpx;
}

.progress-track::before {
  position: absolute;
  top: 10rpx;
  right: 18rpx;
  left: 18rpx;
  height: 2rpx;
  content: '';
  background: #e6d8ca;
}

.progress-step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-dot {
  width: 22rpx;
  height: 22rpx;
  background: #e6d8ca;
  border: 5rpx solid #fffaf3;
  border-radius: 50%;
}

.progress-dot-done {
  background: #6d7751;
}

.progress-label {
  margin-top: 8rpx;
  color: #a28e7e;
  font-size: 19rpx;
}

.progress-label-done {
  color: #596342;
  font-weight: 600;
}

.card-heading {
  padding-bottom: 18rpx;
  color: #3c332c;
  font-size: 27rpx;
  font-weight: 700;
  border-bottom: 1rpx solid #eee3d8;
}

.order-line {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0e6dc;
}

.order-line-main {
  display: flex;
  flex: 1;
  gap: 12rpx;
  align-items: center;
}

.order-line-name {
  color: #473c33;
  font-size: 24rpx;
}

.order-line-quantity {
  color: #a38e7d;
  font-size: 20rpx;
}

.order-line-price {
  color: #4b3d32;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 24rpx;
  font-weight: 700;
}

.order-remark {
  padding: 16rpx 18rpx;
  margin-top: 18rpx;
  color: #8a7564;
  font-size: 21rpx;
  background: #f8f1e8;
  border-radius: 16rpx;
}

.total-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 22rpx;
  color: #3e342c;
  font-size: 25rpx;
  font-weight: 650;
}

.total-price {
  color: #c44b2a;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 34rpx;
  font-weight: 700;
}

.order-meta {
  padding: 8rpx 10rpx 24rpx;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  color: #9a8676;
  font-size: 20rpx;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 16rpx;
}

.action-button {
  min-height: 92rpx;
}

.result-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 180rpx 48rpx;
  color: #8d7969;
  text-align: center;
}

.missing-title {
  color: #45392f;
  font-size: 30rpx;
  font-weight: 650;
}

.missing-copy {
  margin-top: 10rpx;
  font-size: 22rpx;
}

.missing-button {
  width: 280rpx;
  margin-top: 28rpx;
}
</style>


<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'

onLaunch(() => {
  useCartStore().restore()
})
</script>

<style lang="scss">
page {
  min-height: 100%;
  color: #28241f;
  font-family:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  background: #f7f1e8;
}

view,
text,
input,
textarea,
button,
scroll-view {
  box-sizing: border-box;
}

button {
  padding: 0;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  background: transparent;
  border-radius: 0;
}

button::after {
  border: 0;
}

.page-shell {
  min-height: 100vh;
  padding: 32rpx;
}

.section-label {
  color: #9a7a5c;
  font-size: 23rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
}

.primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96rpx;
  padding: 0 32rpx;
  color: #fffaf3;
  font-size: 30rpx;
  font-weight: 650;
  background: #de5b32;
  border-radius: 28rpx;
  box-shadow: 0 16rpx 32rpx rgba(182, 65, 31, 0.2);
}

.secondary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88rpx;
  padding: 0 28rpx;
  color: #5e4938;
  font-weight: 600;
  background: #fffaf3;
  border: 2rpx solid #eadccd;
  border-radius: 26rpx;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>


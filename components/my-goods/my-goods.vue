<template>
	<view class="goods_item">
		<!-- 商品左侧图片区域 -->
		<view class="goods_item_left">
			<!-- 图片本体 -->
			<image class="goods_pic" :src="goods.goods_small_logo"></image>
		</view>

		<!-- 商品右侧信息区域 -->
		<view class="goods_item_right">
			<!-- 商品标题 -->
			<view class="goods_name">{{ goods.goods_name }}</view>
			<view class="goods_info_box">
				<!-- 商品价格 -->
				<!-- toFixed(2) 增加两位小数点 -->
				<view class="goods_price">￥{{ goods.goods_price.toFixed(2) }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	goods: {
		type: Object,
		default: {}
	}
});
</script>

<style lang="scss">
.goods_item {
	display: flex;

	.goods_item_left,
	.goods_pic {
		width: 100px;
		height: 100px;
		display: block;
	}

	.goods_item_right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.goods_name {
			font-size: 13px;
		}

		.goods_info_box {
			.goods_price {
				color: #c00000;
				font-size: 16px;
			}
		}
	}
}
</style>

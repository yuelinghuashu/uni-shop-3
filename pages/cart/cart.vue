<template>
	<view class="cart_container" v-if="store.cart.data.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>

		<!-- 购物车商品列表的标题区域 -->
		<view class="cart_title">
			<!-- 左侧的图标-->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart_title_text">购物车</text>
		</view>

		<!-- 商品列表区域 -->
		<!-- uni-swipe-action 是最外层包裹性质的容器 -->
		<uni-swipe-action>
			<template v-for="(goods, index) in store.cart.data" :key="index">
				<!-- uni-swipe-action-item 可以为其子节点提供滑动操作效果，需要通过 options 属性来制定操作按钮的配置信息 -->
				<uni-swipe-action-item :right-options="options.data" @click="swipeActionClickHandler(goods)">
					<!-- 循环渲染购物车中的商品信息 -->
					<my-goods :goods="goods" :showRadio="true" :showNum="true"></my-goods>
				</uni-swipe-action-item>
			</template>
		</uni-swipe-action>

		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	</view>

	<!-- 空白购物车区域 -->
	<view class="empty_cart" v-else>
		<image class="empty_img" src="/static/cart_empty.PNG" mode=""></image>
		<text class="tip_text">空空如也~</text>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { useCounterStore } from '../../stores/counter.js';
import { setBadge } from '../../mixins/tabbar-badge.js';
import { onMounted, reactive } from 'vue';

const store = useCounterStore();

onShow(() => {
	// 在页面刚展示的时候，设置数字徽标
	setBadge();
});

const options = reactive({
	data: [
		{
			text: '删除',
			style: {
				backgroundColor: '#c00000'
			}
		}
	]
});

function swipeActionClickHandler(goods) {
	// 根据商品的id从购物车中移除对应的商品
	store.removeGoodsById(goods.goods_id);
}
</script>

<style lang="scss">
.cart_container {
	padding-bottom: 50px;
}
.cart_title {
	hieght: 40px;
	display: flex;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
	margin-top: 10px;

	.cart_title_text {
		margin-left: 10px;
	}
}

.empty_cart {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
	.empty_img {
		width: 90px;
		height: 90px;
	}
	.tip_text {
		font-size: 12px;
		color: gray;
		margin-top: 15px;
	}
}
</style>

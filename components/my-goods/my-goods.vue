<template>
	<view class="goods_item">
		<!-- 商品左侧图片区域 -->
		<view class="goods_item_left">
			<!-- radio勾选状态 存储在购物车中的商品，包含goods_state属性，表示商品的勾选状态 -->
			<radio @click="radioClickHander()" :checked="goods.goods_state" v-if="showRadio" color="#c00000" />
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
				<!-- 
					NumberBox Props
					value/v-model	Number	0	输入框当前值
					min	Number	0	最小值
					max	Number	100	最大值
					step	Number	1	每次点击改变的间隔大小
					disabled	Boolean	false	是否为禁用状态
				-->
				<!-- 设置最小值为1，动态绑定商品的数量值 -->
				<uni-number-box @change="numberChangeHandler" v-if="showNum" :min="1" :value="goods.goods_count"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCounterStore } from '../../stores/counter.js';

const store = useCounterStore();

const props = defineProps({
	// 商品的信息对象
	goods: {
		type: Object,
		default: {}
	},
	// 是否展示图片左侧的radio
	showRadio: {
		type: Boolean,
		// 如果外界没有指定 show_radio 属性的值，则默认不展示radio组件
		default: false
	},
	// 是否显示numberbox组件
	showNum: {
		type: Boolean,
		default: false
	}
});

// 点击购物车选中按钮，以更新购物车中商品的勾选状态
function radioClickHander() {
	store.updateGoodsState(props.goods);
	// console.log(props.goods);
}

// 点击购物车商品数量按钮,以更新购物车中商品的数量
function numberChangeHandler(value) {
	const goods_count = ref(value + 0);
	store.updateGoodsCount(props.goods, goods_count.value);
}
</script>

<style lang="scss">
.goods_item {
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	width: 750rpx;
	box-sizing: border-box;

	.goods_item_left {
		margin-right: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods_price {
				color: #c00000;
				font-size: 16px;
			}
		}
	}
}
</style>

<template>
	<view class="my_settle_container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio color="#c00000" :checked="isFullCheck" />
			<text>全选</text>
		</label>

		<!-- 合计 -->
		<view class="amount_box">
			合计：
			<text class="amount">￥{{ store.checkedGoodsAmount }}</text>
		</view>

		<!-- 结算 -->
		<view class="btn_settle">结算({{ store.checkCount }})</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useCounterStore } from '../../stores/counter.js';

const store = useCounterStore();

// 是否全选
const isFullCheck = computed(() => {
	return store.total === store.checkCount;
});

// 修改购物车中所有商品的选中状态
function changeAllState() {
	// !isFullCheck 表示当前全选按钮的状态取反之后，就是最新的勾选状态
	store.updateAllGoodsState(!isFullCheck.value);
}
</script>

<style lang="scss">
.my_settle_container {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;

	.radio {
		display: flex;
		align-items: center;
	}

	.amount_box {
		.amount {
			color: #c00000;
			font-weight: bold;
		}
	}

	.btn_settle {
		background-color: #c00000;
		height: 50px;
		color: white;
		line-height: 50px;
		padding: 0 10px;
		min-width: 100px;
		text-align: center;
	}
}
</style>

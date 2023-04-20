<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address_choose_box" v-if="JSON.stringify(store.address.data) === '[]'">
			<!-- 按钮主体 -->
			<button type="primary" size="mini" class="btn_choose_address" @click="chooseAddress()">请选择收货地址</button>
		</view>

		<!-- 渲染收货信息的盒子 -->
		<!-- 重新选择收货地址，在class类名为address_info_box的盒子上绑定click事件 -->
		<view class="address_info_box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1_left">
					<view class="username">收货人：{{ store.address.data.userName }}</view>
				</view>
				<view class="row1_right">
					<view class="phone">电话：{{ store.address.data.telNumber }}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2_left">收货地址：</view>
				<view class="row2_right">{{ store.add_str }}</view>
			</view>
		</view>

		<!-- 底部的边框线 -->
		<image src="/static/cart_border.png" class="address_border"></image>
	</view>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useUserStore } from '../../stores/user.js';

const store = useUserStore();

// 点击按钮，实现选择收货地址
async function chooseAddress() {
	// 1. 调用小程序提供的chooseAddress()方法，即可使用选择收货地址的功能
	const res = await uni.chooseAddress();

	// 2. 用户成功的选择了收货地址
	if (res.errMsg === 'chooseAddress:ok') {
		store.updateAddress(res);
		console.log(store.address.data);
	}
}
</script>

<style lang="scss">
.address_border {
	display: block;
	width: 100%;
	height: 5px;
}

.address_choose_box {
	height: 90px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.address_info_box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
	font-size: 12px;
	height: 90px;
	.row1 {
		display: flex;
		justify-content: space-between;
		.row1_right {
			display: flex;
			justify-content: space-between;
		}
	}
	.row2 {
		display: flex;
		align-items: center;
		margin-top: 10px;
		.row2_left {
			white-space: nowrap;
		}
	}
}
</style>

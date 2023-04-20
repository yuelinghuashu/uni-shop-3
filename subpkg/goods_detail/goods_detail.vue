<template>
	<view v-if="goods_detail.data.goods_name" class="goods_detail_container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in goods_detail.data.pics" :key="index">
				<!-- 图片本体 -->
				<image :src="item.pics_big" mode=""></image>
			</swiper-item>
		</swiper>

		<!-- 商品信息区域 以下数据无需循环渲染，因为数据只有一条，直接从保存的数据中获取即可 -->
		<view class="goods_info_box">
			<!-- 商品价格 -->
			<view class="price">￥{{ goods_detail.data.goods_price }}</view>
			<!-- 信息主体区域 -->
			<view class="goods_info_body">
				<!-- 商品名称 -->
				<view class="goods_name">{{ goods_detail.data.goods_name }}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递，免运费</view>
		</view>

		<!-- 商品详情区域 使用rich-text组件，动态绑定nodes属性即可轻松完成html渲染 -->
		<rich-text :nodes="goods_detail.data.goods_introduce"></rich-text>

		<!-- 商品导航组件区域 -->
		<view class="goods_nav">
			<!-- 商品导航组件本体 -->
			<uni-goods-nav :fill="true" :options="options.data" :buttonGroup="buttonGroup.data" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useCounterStore } from '@/stores/counter';

//使用pinia
const store = useCounterStore();

// 在onMounted中获取商品的id，并调用商品详情的方法
onLoad(options => {
	// 获取商品id
	goods_id.value = options.goods_id;
	// 调用请求商品详情加载数据的方法
	getGoodsDetail(goods_id.value);
	// console.log(goods_id.value);
});

// 商品详情对象
const goods_detail = reactive({
	data: []
});

// 获取商品id
const goods_id = ref(0);

// 购物车导航栏组件参数
const options = reactive({
	data: [
		{
			icon: 'shop',
			text: '店铺',
			infoBackgroundColor: '#007aff',
			infoColor: 'red'
		},
		{
			icon: 'cart',
			text: '购物车',
			info: 0
		}
	]
});

// 购物车导航按组件按钮组参数
const buttonGroup = reactive({
	data: [
		{
			text: '加入购物车',
			backgroundColor: '#ff0000',
			color: '#fff'
		},
		{
			text: '立即购买',
			backgroundColor: '#ffa200',
			color: '#fff'
		}
	]
});

// 请求商品详情数据的方法
async function getGoodsDetail(id) {
	const { data: res } = await uni.$http.get('goods/detail', { goods_id: id });
	if (res.meta.status !== 200) return uni.$showMsg();

	// 使用字符串的replace()方法，为img标签添加行内的style样式，从而解决图片底部空白间隙的问题
	// 并且将webp的后缀名替换为jpg的后缀名，以此解决webp格式图片在ios设备上无法显示的问题
	res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display: block;"').replace(/webp/g, 'jpg');

	goods_detail.data = res.message;
	console.log(goods_detail.data);
}

// 左侧按钮的点击事件处理函数
function onClick(e) {
	console.log(e);
	if (e.content.text === '购物车') {
		// 切换到购物车页面
		uni.switchTab({
			url: '/pages/cart/cart'
		});
	}
}

// 右侧按钮的点击事件处理函数
function buttonClick(e) {
	// 1. 判断是否点击了加入购物车按钮
	if (e.content.text === '加入购物车') {
		console.log(e);
		// 2. 创建一个商品的信息对象 {goods_id, goods_name, goods_price, goods_count, goods_smail_log, goods_state}
		const goods = reactive({
			data: {
				goods_id: goods_detail.data.goods_id,
				goods_name: goods_detail.data.goods_name,
				goods_price: goods_detail.data.goods_price,
				goods_count: 1,
				goods_small_logo: goods_detail.data.goods_small_logo,
				goods_state: true
			}
		});
		// 3. 调用pinia的addToCart方法，把商品信息对象存储到购物车中
		store.addToCart(goods.data);
	}
}

// 动态为购物车按钮的info属性赋值
watch(
	store,
	new_value => {
		options.data[1].info = store.total;
	},
	// immediate属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
	{ immediate: true }
);
</script>

<style lang="scss">
swiper {
	height: 750rpx;

	image {
		width: 100%;
		height: 100%;
	}
}

.goods_info_box {
	padding: 10rpx;
	padding-right: 0;
	.price {
		color: #c00000;
		font-size: 34rpx;
		margin: 10rpx 0;
	}
	.goods_info_body {
		display: flex;
		justify-content: space-between;
		.goods_name {
			font-size: 30rpx;
			margin-right: 10rpx;
		}
		.favi {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-left: 1rpx solid #efefef;
			color: gray;
			width: 120rpx;
			font-size: 30rpx;
		}
	}
	.yf {
		font-size: 24rpx;
		color: gray;
		margin: 20rpx 0;
	}
}

.goods_nav {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}

.goods_detail_container {
	padding-bottom: 100rpx;
}
</style>

<template>
	<!-- 使用自定义的搜索组件 -->
	<view class="search_box">
		<!-- 首页的搜索框 -->
		<my-search></my-search>
	</view>
	<!-- 轮播图区域 -->
	<!-- indicator-dots: boolean 是否显示面板指示点 -->
	<!-- indicator-color: color 指示点颜色 -->
	<!-- indicator-active-color: color 当前选中的指示点颜色 -->
	<!-- autoplay: boolean 是否自动切换 -->
	<!-- interval: number 自动切换时间间隔 -->
	<!-- circular: boolean 是否采用衔接滑动 -->

	<!--
		  image 组件的mode属性用来指定图片的裁剪和缩放模式，常用的mode属性值如下：
		  mode值        说明
		  scaleToFill  （默认值）缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满image元素
		  aspectFit     缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
		  aspectFill    缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
		  widthFix      缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
		  heightFix     缩放模式，高度不变，宽度自动变化，保持原图宽高比不变
		-->
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		<!-- 循环渲染轮播图的item项 -->
		<swiper-item v-for="(item, index) in swiperList.data" :key="index">
			<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
				<!-- 动态绑定图片的src属性 -->
				<image :src="item.image_src"></image>
			</navigator>
		</swiper-item>
	</swiper>

	<!-- 分类导航区域 -->
	<view class="nav_list">
		<view class="nav_item" v-for="(item, index) in navList.data" :key="index" @click="navClickHandler(item)">
			<!-- 图片 -->
			<image class="nav_img" :src="item.image_src"></image>
		</view>
	</view>

	<!-- 楼层区域 -->
	<view class="floor_list">
		<!-- 楼层item项 -->
		<view class="floor_item" v-for="(item, index) in floorList.data" :key="index">
			<!-- 楼层标题 -->
			<image :src="item.floor_title.image_src" class="floor_title"></image>

			<!-- 楼层图片区域 -->
			<view class="floor_img_box">
				<!-- 左侧大图片的盒子 -->
				<navigator class="left_img_box" :url="item.product_list[0].url">
					<!-- 图片本体 -->
					<image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
				</navigator>

				<!-- 右侧4个小图片的盒子 -->
				<view class="right_img_box">
					<navigator class="right_img_item" v-for="(item2, index2) in item.product_list" :key="index2" :url="item2.url">
						<!-- 图片本体 -->
						<image v-if="index2 !== 0" :src="item2.image_src" :style="{ width: item2.image_width + 'rpx' }" mode="widthFix"></image>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { reactive, ref, onMounted } from 'vue';
import { setBadge } from '../../mixins/tabbar-badge.js';

// 1. 轮播图的数据列表，默认为空数组
const swiperList = reactive({
	data: []
});

// 分类导航的数据列表
const navList = reactive({
	data: []
});

// 楼层的数据列表
const floorList = reactive({
	data: []
});

onMounted(() => {
	// 2. 在小程序页面刚加载的时候，调用获取轮播图数据的节点
	getSwiperList();
	getNavList();
	getFloorList();
});

onShow(() => {
	// 在页面刚展示的时候，设置数字徽标
	setBadge();
});

// 3. 获取轮播图数据的方法
async function getSwiperList() {
	// 3.1 发起请求
	const { data: res } = await uni.$http.get('home/swiperdata');
	// 3.2 请求失败
	if (res.meta.status !== 200) return uni.$showMsg();
	// 3.3 请求成功，为data中的数据赋值
	swiperList.data = res.message;
	uni.$showMsg('数据请求成功！');
}

// 获取导航的数据的方法
async function getNavList() {
	const { data: res } = await uni.$http.get('home/catitems');
	if (res.meta.status !== 200) return uni.$showMsg();
	navList.data = res.message;
	// console.log(navList.data);
	uni.$showMsg('数据请求成功！');
}

// nav_item 元素被点击时候的事件处理函数
function navClickHandler(item) {
	// 判断点击的是哪个 nav
	if (item.name === '分类') {
		uni.switchTab({
			url: '/pages/cate/cate'
		});
	}
}

// 获取楼层列表数据的方法
async function getFloorList() {
	const { data: res } = await uni.$http.get('home/floordata');
	if (res.meta.status !== 200) return uni.$showMsg();
	// 对数据进行处理
	res.message.forEach(floor => {
		floor.product_list.forEach(prod => {
			prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
		});
	});
	floorList.data = res.message;
	console.log(floorList.data);
}
</script>

<style lang="scss">
swiper {
	height: 330rpx;
}

.swiper-item,
image {
	width: 100%;
}

.nav_list {
	display: flex;
	justify-content: space-around;
	margin: 15rpx 0;
}

.nav_img {
	width: 128rpx;
	height: 140rpx;
}

.floor_title {
	display: flex;
	height: 60rpx;
	width: 100%;
}

.right_img_box {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.floor_img_box {
	display: flex;
	padding-left: 10rpx;
}

// 让搜索框固定在顶部的第二种方法(推荐这种方法，因为比较简单)
.search_box {
	// 设置定位效果为 “吸顶”
	position: sticky;
	// 吸顶的位置
	top: 0;
	// 提高层级，防止被轮播图覆盖
	z-index: 999;
}
</style>

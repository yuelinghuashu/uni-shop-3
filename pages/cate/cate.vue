<template>
	<view class="scroll_view_container">
		<!-- 左侧的滚动视图区域 -->
		<!-- style="100vh" 也可以做到沾满全屏 -->
		<scroll-view class="left_scroll_view" scroll-y="true" :style="{ height: vh + 'px' }">
			<template v-for="(item, index) in cateList.data" :key="item.cat_id">
				<!-- @click="active = index" 也实现动态激活的方法 -->
				<view @click="activeChange(index)" :class="['left_scroll_view_item', index === active ? 'active' : '']">{{ item.cat_name }}</view>
			</template>
		</scroll-view>

		<!-- 右侧的滚动视图区域 -->
		<scroll-view class="right_scroll_view" scroll-y="true" :scroll-top="scrollTop" :style="{ height: vh + 'px' }">
			<view class="cate_lv2" v-for="(item2, index2) in cateLeve2.data" :key="item2.cat_id">
				<!-- 二级分类的标题 -->
				<view class="cate_lv2_title">{{ item2.cat_name }}</view>
				<!-- 当前二级分类下的三级分类列表 -->
				<view class="cate_lv3_list">
					<!-- 三级分类的item项 -->
					<view class="cate_lv3_item" v-for="(item3, index3) in item2.children" :key="item3.cat_id" @click="gotoGoodsList(item3)">
						<!-- 三级分类的图片 -->
						<image :src="item3.cat_icon.replace('dev', 'web')"></image>
						<!-- 三级分类的文本 -->
						<text class="">{{ item3.cat_name }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

// 当前设备可用的高度
const wh = ref(0);

// 分类数据的列表
const cateList = reactive({
	data: []
});

// 二级分类列表
const cateLeve2 = reactive({
	data: []
});

// 左侧滑动区域是否被激活
const active = ref(0);

// 滚动条距离顶部的距离
const scrollTop = ref(0);

onMounted(() => {
	// 获取系统信息同步接口
	const sysInfo = uni.getSystemInfoSync();
	console.log(sysInfo);
	wh.value = sysInfo.windowHeight;

	getCateList();
});

// 获取分类数据列表
async function getCateList() {
	const { data: res } = await uni.$http.get('categories');
	if (res.meta.status !== 200) return uni.showMsg();
	cateList.data = res.message;
	// 为二级分类赋值
	cateLeve2.data = res.message[0].children;
	console.log(cateList.data);
	console.log(cateLeve2.data);
}

function activeChange(index) {
	active.value = index;
	// 为二级分类列表重新赋值
	cateLeve2.data = cateList.data[index].children;
	// 让scrollTop的值在0和1之间切换
	scrollTop.value = scrollTop.value === 0 ? 1 : 0;
}

// 点击三级分类跳转到商品列表页面
function gotoGoodsList(item3) {
	uni.navigateTo({
		url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
	});
}
</script>

<style lang="scss">
.scroll_view_container {
	display: flex;
}

.left_scroll_view {
	width: 120rpx;
}

.left_scroll_view_item {
	background-color: #f7f7f7;
	line-height: 60px;
	text-align: center;
	font-size: 12px;
}

.active {
	background-color: #ffffff;
	position: relative;
}

.active::before {
	content: '';
	display: block;
	width: 3px;
	height: 30px;
	background-color: #c00000;
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
}

.cate_lv2_title {
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	margin: 15px 0;
}

.cate_lv3_list {
	display: flex;
	flex-wrap: wrap;
}

.cate_lv3_list .cate_lv3_item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 33.33%;
	margin-bottom: 10px;
}

.cate_lv3_list .cate_lv3_item image {
	width: 60px;
	height: 60px;
}

.cate_lv3_list .cate_lv3_item text {
	font-size: 12px;
}
</style>

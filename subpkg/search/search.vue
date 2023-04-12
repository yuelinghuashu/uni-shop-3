<template>
	<!-- :focus 动态绑定是否自动聚焦 :radius 动态绑定圆角角度  cancelButton 是否显示取消按钮 @input 当value值改变的时候触发事件，返回参数为value的值，e=value -->
	<view class="search_box">
		<uni-search-bar
			:focus="true"
			v-model="searchValue"
			@blur="blur"
			@focus="focus"
			@input="input"
			@cancel="cancel"
			@clear="clear"
			:radius="100"
			cancelButton="none"
		></uni-search-bar>
	</view>

	<!-- 搜索结果列表 -->
	<!-- 实现搜索建议和搜索历史按需展示 -->
	<view class="sugg_list" v-if="searchResult.data.length !== 0">
		<view @click="gotoDetail(item.goods_id)" class="sugg_item" v-for="item in searchResult.data" :key="item.goods_id">
			<view class="goods_name">{{ item.goods_name }}</view>
			<uni-icons type="arrowright" size="16"></uni-icons>
		</view>
	</view>

	<!-- 搜索历史记录 -->
	<view class="history_box" v-else>
		<!-- 标题区域 -->
		<view class="history_title">
			<text>搜索历史</text>
			<uni-icons @click="cleanHistory()" type="trash" size="17"></uni-icons>
		</view>
		<!-- 列表区域 -->
		<view class="history_list"><uni-tag @click="gotoGoodsList(item)" :text="item" v-for="(item, index) in historys()" :key="index"></uni-tag></view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

onMounted(() => {
	// 自动加载本地存储的搜索历史记录
	historyList.data = JSON.parse(uni.getStorageSync('kw') || []);
});

// 延时器的timerId
const timer = ref(0);

// 搜索关键字
const kw = ref('');

// 搜索结果列表
const searchResult = reactive({
	data: []
});

// 搜索关键词的历史记录
const historyList = reactive({
	data: ['a', 'app', 'apple']
});

// input输入事件的处理函数
function input(value) {
	// 清除timer对应的延时器
	clearTimeout(timer.value);
	// 重新启动一个延时器，并把timerId赋值给timer
	timer.value = setTimeout(() => {
		// 如果500毫秒内， 没有触发新的输入事件，则为搜索关键词赋值
		kw.value = value;
		console.log(kw.value);
		// 根据关键词，查询搜索建议列表
		getSearchList();
	}, 500);
}

// 获取搜索结果列表数据
async function getSearchList() {
	// 判断关键词是否为空
	if (kw.value === '') {
		searchResult = [];
		return;
	}
	// 发起请求，获取搜索建议列表
	const { data: res } = await uni.$http.get('goods/qsearch', { query: kw.value });
	if (res.meta.status !== 200) return uni.$showMsg();
	searchResult.data = res.message;
	console.log(searchResult.data);

	//  查询到搜索建议之后，调用saveSeaarchHistory()方法保存搜索关键词
	saveSearchHistory();
}

// 保存搜索关键词的方法
function saveSearchHistory() {
	//  直接把搜索关键词push到historyList数组中
	// historyList.data.push(kw.value);

	// 1. 将 Array 数组转化为 Set 对象
	const set = new Set(historyList.data);
	// 2. 调用 Set 对象的delete方法，移除对应的元素
	set.delete(kw.value);
	// 3. 调用 Set 对象的add方法，向 Set 中添加元素
	set.add(kw.value);
	// 4. 将 Set 对象转化为 Array 数组
	historyList.data = Array.from(set);

	// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
	uni.setStorageSync('kw', JSON.stringify(historyList.data));
}

// 注意：由于数组是引用类型，所以不要直接基于原数组调用reverse方法，以免修改原数组中元素的顺序
// 而是应该新建一个内存无关的数组，再进行reverse反转
function historys() {
	return [...historyList.data].reverse();
}

// 清空搜索历史记录
function cleanHistory() {
	// 清空data中保存的历史记录
	historyList.data = [];
	uni.setStorageSync('kw', []);
}

// 点击搜索历史跳转到商品列表页面
function gotoGoodsList(item) {
	uni.navigateTo({
		url: '/subpkg/goods_list/goods_list?query=' + kw.value
	});
}

// 点击搜索建议的item项，跳转到商品详情页面
function gotoDetail(goods_id) {
	uni.navigateTo({
		// 指定详情页面的url地址，并传递goods_id参数
		url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
	});
}
</script>

<style lang="scss">
.search_box {
	position: sticky;
	top: 0;
	z-index: 999;
}

uni-searchbar {
	background-color: #c00000;
}

.sugg_list {
	padding: 0 5px;
}

.sugg_list .sugg_item {
	font-size: 12px;
	padding: 13px 0;
	border-bottom: 1px solid #efefef;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.sugg_list .sugg_item .goods_name {
	// 文字不允许换行(单行文本)
	white-space: nowrap;
	// 溢出部分隐藏
	overflow: hidden;
	// 文本溢出后，使用...代替
	text-overflow: ellipsis;
	margin-right: 3px;
}

.history_box {
	padding: 0 5px;

	.history_title {
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}

	.history_list {
		display: flex;
		flex-wrap: wrap;

		.uni-tag {
			margin-top: 5px;
			margin-right: 5px;
			background-color: #e7e7e7;
			color: black;
		}
	}
}
</style>

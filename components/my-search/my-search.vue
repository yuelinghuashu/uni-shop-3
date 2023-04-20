<template>
	<view @click="gotoSearch()" class="my_search_container" :style="{ 'background-color': backgroundColor }">
		<!-- 使用view组件模拟input输入框的样式 -->
		<view class="my_search_box" :style="{ 'border-radius': radius + 'px' }">
			<!-- 使用uni-ui提供的图标组件 -->
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script setup>
// 在 <script setup> 中必须使用 defineProps 和 defineEmits API 来声明 props 和 emits ，它们具备完整的类型推断并且在 <script setup> 中是 直接可用 的：
const props = defineProps({
	// 背景颜色
	backgroundColor: {
		type: String,
		default: '#c00000'
	},
	// 圆角尺寸
	radius: {
		type: Number,
		default: 18 // px
	}
});

function gotoSearch() {
	uni.navigateTo({
		url: '/subpkg/search/search'
	});
}
</script>

<style lang="scss">
.my_search_container {
	height: 50px;
	padding: 0 10px;
	display: flex;
	align-items: center;
}

.my_search_box {
	height: 36px;
	background-color: #ffffff;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.placeholder {
	font-size: 15px;
	margin-left: 5px;
}
</style>

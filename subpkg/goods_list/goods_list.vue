<template>
	<view class="goods_list">
		<view @click="gotoDetail(goods)" v-for="(goods, index) in goodsList.data" :key="index">
			<!-- 为my-goods组件动态绑定goods属性的值 -->
			<my-goods :goods="goods"></my-goods>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
onMounted(() => {
	getGoodsList();
});

const queryInfo = reactive({
	data: {
		// 查询关键词
		query: '',
		// 商品分类id
		cid: '',
		// 页码值
		pagenum: 1,
		// 每页显示多少条数据
		pagesize: 10
	}
});

// 商品列表数据
const goodsList = reactive({
	data: []
});

// 总数量，用来实现分页
const total = ref(0);

// 设置商品列表上拉加载刷新的节流阀
const isLoading = ref(false);

// 接收 cb 回调函数并按需进行调用
async function getGoodsList(cb) {
	// 打开节流阀
	isLoading.value = true;
	const { data: res } = await uni.$http.get('goods/search', queryInfo.data);
	// 关闭节流阀
	isLoading.value = false;

	// 只要数据请求完毕，就立即按需调用 cb回调函数
	cb && cb();

	if (res.meta.status !== 200) return uni.$showMsg();
	// 为数据赋值，通过展开运算符的形式，进行新旧数据的拼接
	goodsList.data = [...goodsList.data, ...res.message.goods];
	total.value = res.message.total;
	console.log(res);
}

// 监听页面的上拉触底事件
onReachBottom(() => {
	// 判断是否还有下一页数据
	// 如果下面的公式成立，则证明没有下一页数据了
	// 当前的页码值 * 每页显示多少条数据 >= 总条数
	if (queryInfo.data.pagenum * queryInfo.data.pagesize >= total) return uni.$showMsg('数据加载完毕');

	// 判断是否正在请求其他数据，如果是，则不发起额外的请求
	if (isLoading.value) return;

	// 让页码值自增+1
	queryInfo.data.pagenum += 1;
	// 重新获取列表数据
	getGoodsList();
});

// 监听页面的下拉刷新事件
onPullDownRefresh(() => {
	// 1. 重置关键数据
	queryInfo.data.pagenum = 1;
	total.value = 0;
	isLoading.value = false;
	goodsList.data = [];

	// 2. 重新发起请求
	getGoodsList(() => uni.stopPullDownRefresh());
});

// 点击商品item项跳转到详情页面
function gotoDetail(item) {
	uni.navigateTo({
		url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
	});
}
</script>

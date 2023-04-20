import {
	defineStore
} from 'pinia';
import {
	ref,
	reactive,
	computed
} from 'vue'

export const useCounterStore = defineStore('counter', () => {
	// 购物车的数组，用来存储购物车中每个商品的信息对象
	// 每个商品的信息对象，都包含如下 6 个属性
	// {goods_id, goods_name, goods_price, goods_count, goods_smail_log, goods_state}
	const cart = reactive({
		data: JSON.parse(uni.getStorageSync('cart') || '[]')
	});

	// 更新购物车数量
	function addToCart(goods) {
		// 根据提交的商品id，查询购物车是否存在这件商品
		// 如果不存在，则findResult 为 underfined ，否则未查询到的商品信息对象
		const findResult = cart.data.find(item => item.goods_id === goods.goods_id);
		if (!findResult) {
			// 如果购物车中没有这件商品，则直接push
			cart.data.push(goods);
		} else {
			// 如果购物车中有这件商品，则只更新数量即可
			findResult.goods_count++;
		}
		console.log(total.value)

		// 调用数据持久化函数
		saveToStorage()
	}

	// 统计购物车中商品的模块
	const total = computed(() => {
		// let c = ref(0)
		// 循环统计商品的数量，累加到变量c中
		// cart.data.forEach(item => c.value += item.goods_count)
		// return c.value

		return cart.data.reduce((total, item) => total += item.goods_count, 0)
	})



	// 更新购物车中商品的勾选状态
	function updateGoodsState(goods) {
		const findResult = cart.data.find(item => item.goods_id === goods.goods_id)
		if (findResult) {
			findResult.goods_state = !goods.goods_state
			console.log(findResult)
			// 持久化存储到本地
			saveToStorage()
		}
	}

	// 将购物车中的数据持久化存储到本地
	function saveToStorage() {
		uni.setStorageSync('cart', JSON.stringify(cart.data))
	}

	// 更新购物车商品的数量
	function updateGoodsCount(goods, value) {
		// 根据goods_id查询购物车中对应商品的信息对象
		const findResult = cart.data.find(item => item.goods_id === goods.goods_id)
		if (findResult) {
			// 更新对应商品的数量
			findResult.goods_count = value
			// 持久化存储到本地
			saveToStorage()
		}
	}

	// 根据商品的id从购物车中移除对应的商品
	function removeGoodsById(goods_id) {
		// 调用数组的 filter 方法进行过滤
		cart.data = cart.data.filter(item => item.goods_id !== goods_id)
		// 持久化存储到本地
		saveToStorage()
	}

	// 勾选的商品的总数量
	const checkCount = computed(() => {
		// 先试用filter方法，从购物车中过滤已勾选的商品
		// 再使用reduce方法，将已勾选的商品总数量进行累加
		// reduce()的返回值就是已勾选的商品的总数量
		return cart.data.filter(item => item.goods_state).reduce((total, item) =>
			total += item.goods_count, 0)
	})

	// 修改购物车中所有商品的选中状态
	function updateAllGoodsState(newState) {
		// 循环更新购物车中每件商品的勾选状态
		cart.data.forEach(item => item.goods_state = newState)
		// 持久化存储到本地
		saveToStorage()
	}

	// 已勾选的商品总价
	const checkedGoodsAmount = computed(() => {
		// 先试用filter方法，从购物车中过滤已勾选的商品
		// 再使用reduce方法，将已勾选的商品总数量 * 单价之后，进行累加
		// reduce()的返回值就是已勾选的商品的总价
		// 最后调用toFixed(2)方法，保留两位小数
		return cart.data.filter(item => item.goods_state).reduce((total, item) => total += item
			.goods_count * item.goods_price, 0).toFixed(2)
	})

	return {
		cart,
		addToCart,
		total,
		updateGoodsState,
		updateGoodsCount,
		removeGoodsById,
		checkCount,
		updateAllGoodsState,
		checkedGoodsAmount
	}
});
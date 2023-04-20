import {
	watch
} from 'vue';
import {
	useCounterStore
} from '../stores/counter.js'

const store = useCounterStore()

export function setBadge() {
	// 调用uni.setTabBarBadge({}) 方法，为购物车设置右上角的徽标
	uni.setTabBarBadge({
		index: 2, // 索引
		// 注意：text的值必须是字符串，不能是数字
		text: store.total + ''
	});
}

// 监听total值的变化
watch(store, () => {
	// 调用setBadge方法，重新为tabBar的数字徽标赋值
	setBadge()
})
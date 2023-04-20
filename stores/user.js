import {
	defineStore
} from 'pinia'
import {
	ref,
	reactive,
	computed
} from 'vue'

export const useUserStore = defineStore('user', () => {
	// 收货地址
	const address = reactive({
		// 读取本地的收货地址数据，初始化address对象
		data: JSON.parse(uni.getStorageSync('address') || '[]')
	})

	// 更新收货地址
	function updateAddress(res) {
		address.data = res

		// 将address对象持久化存储到本地
		saveAddressToStorage()
	}

	// 将详细地址拼接在一起
	const add_str = computed(() => {
		if (!address.data.postalCode) return '';
		return address.data.provinceName + address.data.cityName + address.data.countyName +
			address.data.detailInfo;
	});

	// 将address对象持久化存储到本地
	function saveAddressToStorage() {
		uni.setStorageSync('address', JSON.stringify(address.data))
	}

	return {
		address,
		updateAddress,
		add_str
	}
})
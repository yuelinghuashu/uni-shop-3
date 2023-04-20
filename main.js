// 需将导入的包和接口相关操作放在代码最前面，否则报错！！！
// 按需导入 $http 对象
import {
	$http
} from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
uni.$http.baseUrl = 'https://api-ugo-web.itheima.net/api/public/v1/'

// 设置请求拦截器
uni.$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
}

// 设置响应拦截器
uni.$http.afterRequest = function(options) {
	uni.hideLoading()
}

// 封装的展示消息提示的方法
uni.$showMsg = (title = '数据加载失败！', duration = 1500) => {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import * as Pinia from 'pinia';

import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(Pinia.createPinia())
	return {
		app,
		Pinia // 此处必须将 Pinia 返回
	}
}
// #endif
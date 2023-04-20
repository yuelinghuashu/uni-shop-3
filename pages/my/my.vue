<template>
	<view>My</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { onMounted } from 'vue';
import { setBadge } from '../../mixins/tabbar-badge.js';

onShow(() => {
	setBadge();
});
</script>

<style></style>

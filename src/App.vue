<template>
  <router-view />
</template>

<script lang="ts" setup>import { onMounted } from 'vue';
import { initInkaApp } from './modules/init_m';

onMounted(async () => await initInkaApp())
</script>

<style>
/* * {
  cursor: wait !important;
  pointer-events: none;
} */
</style>

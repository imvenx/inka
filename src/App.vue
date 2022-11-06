<template>
  <router-view />
</template>

<script lang="ts" setup>import { onMounted } from 'vue';
import { initApp } from './modules/init_m';

onMounted(async () => await initApp())
</script>

<style>

</style>

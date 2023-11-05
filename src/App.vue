<template>
  <router-view />
</template>

<script lang="ts" setup>import { computed, onMounted, ref } from 'vue';
import { initInkaApp } from './modules/init_m';

onMounted(async () => await initInkaApp())

</script>

<style>
.q-menu {
  max-height:90vh;
}
</style>

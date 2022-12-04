<template>
  <div class="attrsKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <AttrsKf v-for="kf in kfs" :kf="kf" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { rowHeight } from 'src/modules/config_m';
import AttrsKf from './AttrsKf.vue';

const props = defineProps<{ kfs: Keyframe[] }>()

</script>

<style scoped>
.attrsKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: rgb(150, 150, 50);
}
</style>

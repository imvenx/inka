<template>
  <div class="attrsKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <AttrsKf v-for="kf in kfs" :kf="kf" :key="kf.offset!" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import AttrsKf from './AttrsKf.vue';

const props = defineProps<{ kfs: Keyframe[] }>()
const rowHeight = ConfigM.rowHeight
</script>

<style scoped>
.attrsKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: var(--listAttrsBgColor);
}
</style>

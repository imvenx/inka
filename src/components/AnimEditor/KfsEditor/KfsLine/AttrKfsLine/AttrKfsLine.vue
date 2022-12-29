<template>
  <div class="attrKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <AttrKf v-for="kf in kfs" :kf="kf" :key="kf.offset!" :elId="elId" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import AttrKf from './AttrKf.vue';
const props = defineProps<{ kfs: Keyframe[], elId: string }>()
const rowHeight = ConfigM.rowHeight
</script>

<style scoped>
.attrKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: var(--listAttrBgColor);

}
</style>

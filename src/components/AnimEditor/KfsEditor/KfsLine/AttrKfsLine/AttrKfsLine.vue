<template>
  <div class="attrKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <AttrKf v-for="kf in kfs" :kf="kf" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { rowHeight } from 'src/modules/config_m';
import AttrKf from './AttrKf.vue';

const props = defineProps<{ kfs: Keyframe[] }>()

</script>

<style scoped>
.attrKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: rgb(180, 180, 130);
}
</style>

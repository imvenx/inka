<template>
  <div class="attrKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <AttrKf v-for="kf in el.kfs" :kf="kf" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import ElKf from './ElKf.vue';
import { rowHeight } from 'src/modules/config_m';
import AttrsKf from './AttrsKf.vue';
import AttrKf from './AttrKf.vue';

const props = defineProps<{ el: SvEl }>()

</script>

<style scoped>
.attrKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: rgb(180, 180, 130);
}
</style>

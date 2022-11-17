<template>
  <div class="attrsKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <AttrsKf v-for="kf in el.kfs" :kf="kf" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import ElKf from './ElKf.vue';
import { rowHeight } from 'src/modules/config_m';
import AttrsKf from './AttrsKf.vue';
import AttrKfsLine from '../AttrKfsLine/AttrKfsLine.vue';

const props = defineProps<{ el: SvEl }>()

</script>

<style scoped>
.attrsKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: rgb(150, 150, 50);
}
</style>

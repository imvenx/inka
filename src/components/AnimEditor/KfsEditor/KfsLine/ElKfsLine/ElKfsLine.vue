<template>
  <div class="elKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <ElKf v-for="kf in el.kfs" :kf="kf" />
    </svg>
  </div>
  <template v-if="el.isUncollapsed">
    <ElKfsLine :el="{}" />
    <template v-if="el.showAttrs">
      <ElKfsLine v-for="kf in el.attrs" :el="{}" />
    </template>

    <ElKfsLine v-for="child in el.children" :el="child" />
  </template>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import ElKf from './ElKf.vue';
import { rowHeight } from 'src/modules/config_m';

const props = defineProps<{ el: SvEl }>()

</script>

<style scoped>
.elKfsLineCont {
  height: v-bind(rowHeight + 'px');
}
</style>

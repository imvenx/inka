<template>
  <div class="elKfsLineCont">
    <svg width="100%" :height="rowHeight">
      <ElKf v-for="kf in el.kfs" :el="el" :kf="kf" />
    </svg>
  </div>
  <template v-if="el.isUncollapsed">
    <AttrsKfsLine :kfs="el.kfs" />

    <template v-if="el.showAttrs">
      <template v-for="attr in el.attrs">
        <template v-if="allowedAttrs.includes(attr.key)">
          <AttrKfsLine :kfs="getAttrKfs(el.kfs, attr.key)" />
        </template>
      </template>
    </template>

    <ElKfsLine v-for="child in el.children" :el="child" />
  </template>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import ElKf from './ElKf.vue';
import { rowHeight } from 'src/modules/config_m';
import AttrsKfsLine from '../AttrsKfsLine/AttrsKfsLine.vue';
import AttrKfsLine from '../AttrKfsLine/AttrKfsLine.vue';
import { allowedAttrs } from 'src/modules/constants';

defineProps<{ el: SvEl }>()

function getAttrKfs(kfs: Keyframe[], attrName: string): Keyframe[] {
  return kfs.map(x => x = { offset: x.offset, [attrName]: x[attrName] })
}
</script>

<style scoped>
.elKfsLineCont {
  height: v-bind(rowHeight + 'px');
  background-color: rgb(137, 192, 54);

}
</style>

<template>
  <div class="list-el attr-cont" @click="toggleShowAttrs()"
    :title="JSON.stringify(el.attrs.map(x => `${x.key}: ${x.val}`))">
    &nbsp;<span v-for="d in el.depth">&nbsp;</span>
    <span v-if="el.showAttrs" id="uncollapsedAttr">▲</span>
    <span v-else>▼</span>
    <q-icon name="folder" title="attributes" /> attrs
    <!-- <q-icon name="add_circle_outline" title="add attribute" /> -->
  </div>

  <template v-if="el.showAttrs">
    <template v-for="attr in  el.attrs">
      <template v-if="allowedAttrs.includes(attr.key)">
        <!-- <template v-if="attr.key != ''"> -->
        <div class="list-el attr-child" :title='`[ ${attr.key} ] = [ ${attr.val} ]`'>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-for="d in el.depth">&nbsp;</span>
          <q-icon :name="getAttrIcon(attr.key)" />
          <span v-if="attr.key === 'fill'" :style="`background: ${attr.val}`"
            style="border:1px solid grey; margin-left: 3px; font-size: .7em; vertical-align: middle;">
            &nbsp;&nbsp;&nbsp;</span>
          {{ attr.val }}
        </div>
        <!-- </template> -->
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import { allowedAttrs } from 'src/modules/constants';
import { StorageM } from 'src/modules/storage_m';

const props = defineProps<{ el: SvEl }>()

function toggleShowAttrs() {
  props.el.showAttrs = !props.el.showAttrs
  let showAttrs = StorageM.getShowAttrs()
  if (props.el.showAttrs) showAttrs[props.el.id] = true
  else delete showAttrs[props.el.id]
  StorageM.setShowAttrs(showAttrs)
}

function getAttrIcon(attrName: string) {
  switch (attrName) {
    case 'fill': return 'palette'
    case 'fillOpacity': return 'opacity'
    case 'width': return 'sync_alt'
    case 'height': return 'height'
    case 'x': return 'east'
    case 'y': return 'south'
    case 'stroke': return 'border_color'
    case 'strokeWidth': return 'highlight_alt'
    case 'strokeLinecap': return 'crop_landscape'
    case 'd': return 'gesture'
    default: return 'help'
  }
}
</script>

<style scoped>
.list-el {
  user-select: none;
}

.attr-cont {
  background-color: var(--listAttrsBgColor);
}

.attr-child {
  background-color: var(--listAttrBgColor);

}

.list-el:hover {
  box-shadow: inset 0 0 1px 1px black;
}

#uncollapsedAttr {
  color: var(--fontColor2)
}
</style>

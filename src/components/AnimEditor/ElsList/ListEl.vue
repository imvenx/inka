<template>
  <div class="list-el" @click="toggleCollapse()" ref="cont">
    <span v-for="depth in el.depth">&nbsp;</span>
    <span>{{ el.isUncollapsed ? '▲' : '▼' }}</span>
    <q-icon :name="getIcon(el.tagName ?? '')" :title="`<${el.tagName}>`" />
    {{ el.name }}
  </div>

  <template v-if="el.isUncollapsed">
    <ListAttr :el="el" />

    <template v-for="child in el.children">
      <ListEl :el="child" />
    </template>
  </template>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import { StorageM } from 'src/modules/storage_m';
import { onMounted, ref } from 'vue';
import ListAttr from './ListAttr.vue';

const props = defineProps<{ el: SvEl }>()

const cont = ref()
onMounted(() => {
  cont.value.addEventListener('mouseover', () => {
    cont.value.title = document.getElementById(props.el.id)?.outerHTML
  })
})

function getIcon(tagName: string) {
  switch (tagName) {
    case 'svg': return 'category'
    case 'g': return 'folder'
    case 'rect': return 'square'
    case 'path': return 'route'
    default: return 'help'
  }
}

function toggleCollapse() {
  props.el.isUncollapsed = !props.el.isUncollapsed
  let uncollapsed = StorageM.getUncollapsed()
  if (props.el.isUncollapsed) uncollapsed[props.el.id] = true
  else delete uncollapsed[props.el.id]
  StorageM.setUncollapsed(uncollapsed)
}

</script>

<style scoped>
.list-el {
  /* border-bottom: 1px solid black; */
  user-select: none;
  /* background-color: rgb(137, 192, 54); */
  background-color: rgb(137, 192, 54);
  /* height: v-bind(rowHeight + 'px'); */
}

.list-el:hover {
  /* background-color: rgb(0, 0, 0) !important;
  color: white; */
  box-shadow: inset 0 0 1px 1px black;
}

/* .list-el *:hover {
  color: red;
} */
</style>

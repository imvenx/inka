<template>
  <div class="list-el" ref="cont">
    <!-- <input type="checkbox" v-model="el.isSelected" title="animate"> -->
    <span @click="toggleCollapse()">
      <span v-for="depth in el.depth">&nbsp;</span>
      <template v-if="el?.attrs?.length > 0 || el?.children?.length">
        <span v-if="el.isUncollapsed" id="uncollapsedEl">▲</span>
        <span v-else>▼</span>
      </template>
      <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <q-icon :name="getIcon(el.tagName ?? '')" :title="`<${el.tagName}>`" />
      {{ el.name }}
    </span>
    <span style="float:right">
      <!-- <input type="checkbox" title="solo" /> -->
    </span>
  </div>

  <template v-if="el.isUncollapsed">
    <ListAttr v-if="el.attrs.length > 0" :el="el" />

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
  background-color: var(--listElBgColor);
  /* height: v-bind(rowHeight + 'px'); */
}

.list-el:hover {
  /* background-color: rgb(0, 0, 0) !important;
  color: white; */
  box-shadow: inset 0 0 1px 1px black;
}

#uncollapsedEl {
  color: var(--fontColor2)
}

/* .list-el *:hover {
  color: red;
} */

/* input[type="checkbox"] {
  pointer-events: none;
} */

/* input[type="checkbox"]:checked {
  background: blue;
  color: white;
} */

/* input[type="checkbox"] {
  margin: 0 6px;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  height: 14px;
  width: 14px;
  border: 1px solid grey;
  color: white;
}

input[type="checkbox"]:after {
  content: ' ';
  position: relative;
  left: 40%;
  top: 20%;
  width: 15%;
  height: 40%;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(50deg);
  display: none;
}

input[type="checkbox"]:checked:after {
  display: block;
} */
</style>

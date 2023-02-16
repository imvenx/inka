<template>
  <div class="listEl" ref="cont">

    <!--  @mouseenter="focusOnAnimViewer" @mouseleave="unfocusOnAnimViewer"-->

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

    <!-- <span style="float:right;">
      <q-icon title="edit name" name="edit" />
      <q-icon title="select on inkscape" name="filter_center_focus" />
      <q-icon title="" name="adjust" />
      <q-icon title="mute" name="block" />
    </span> -->

    <!-- <input type="checkbox" title="solo" /> -->

    <!-- <svg width="14" height="14" :viewBox="`0 0 100 100`" style="background: grey; float:right" v-if="domEl"
      v-html="domEl.outerHTML">
    </svg> -->

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

// const domEl = document.getElementById(props.el.id) as HTMLElement

// const { width: domElWidth, height: domElHeight } = domEl?.getBoundingClientRect() ?? {}

onMounted(() => {
  cont.value.addEventListener('mouseover', () => {
    cont.value.title = document.getElementById(props.el.id)?.outerHTML
  })

})

function getIcon(tagName: string) {
  switch (tagName) {
    case 'g': return 'folder'
    case 'path': return 'route'
    case 'rect': return 'square'
    case 'circle': return 'circle'
    case 'svg': return 'category'
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

// let oldStroke = ''
// let oldStrokeWidth = ''
function focusOnAnimViewer() {
  // if (!domEl) return
  // oldStroke = domEl.style.stroke ?? ''
  // oldStrokeWidth = domEl.style.strokeWidth ?? ''
  // domEl.style.stroke = 'yellow'
  // domEl.style.strokeWidth = '1'
}

function unfocusOnAnimViewer() {
  // if (!domEl) return
  // domEl.style.stroke = oldStroke
  // domEl.style.strokeWidth = oldStrokeWidth
}

</script>

<style scoped>
.listEl {
  /* border-bottom: 1px solid black; */
  user-select: none;
  /* background-color: rgb(137, 192, 54); */
  background-color: var(--listElBgColor);
  /* height: v-bind(rowHeight + 'px'); */
}

.listEl:hover {
  /* box-shadow: inset 0 0 1px 1px var(--fontColor1); */
  box-sizing: border-box;
  /* border: 1px solid var(--fontColor1); */
  /* background-color: var(--fontColor1);
  color: var(--listElBgColor); */

}

#uncollapsedEl {
  color: var(--fontColor2)
}

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

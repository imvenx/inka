<template>
  <div id="animatorCont" ref="cont">
    <div class="corner"></div>
    <TimePicker @wheel.passive="onWheel" />
    <ElsList />
    <KfEditor @wheel.passive="onWheel" />

    <div ref="highlighter" id="highlighter"> </div>

  </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import { onMounted, ref } from 'vue';
import ElsList from './ElsList/ElsList.vue';
import KfEditor from './KfsEditor/KfsEditor.vue';
import TimePicker from './TimePicker.vue';

const cont = ref<HTMLDivElement>()
const highlighter = ref<HTMLDivElement>()
function onWheel(e: WheelEvent) { if (e.ctrlKey) { zoomTime(e); return } }
const zoomTime = (e: WheelEvent) => ConfigM.zoomPx -= e.deltaY / ConfigM.numDecimals



// const elsListWidth = ref()
onMounted(() => {
  cont.value?.addEventListener('mousemove', (e) => highlightMousePos(e))

  // elsListWidth.value = contWidth()
  // window.addEventListener('resize', () => elsListWidth.value = contWidth())
})

function highlightMousePos(e: MouseEvent) {
  if (!highlighter.value) return

  if (e.y < 38) {
    highlighter.value.style.top = 14 + 'px'
    return
  }
  highlighter.value.style.top = e.y - 24 + 'px'
}

// const contWidth = () => `width: ${cont?.value?.offsetWidth! - 3}px`

</script>

<style scoped>
#animatorCont {
  border: 1px solid var(--bgColor1);
  /* box-shadow: 0 0 5px black; */
  /* height: 100%; */
  display: grid;
  grid-template-columns: 25% 75%;
  grid-template-rows: max-content auto;
  overflow: hidden;
  /* overflow-x: hidden; */
}

.corner {
  z-index: 100;
  background-color: var(--bgColor1);
  /* border: 1px solid rgb(158, 158, 158); */
}

#highlighter {
  border-bottom: 1px solid rgba(250, 200, 0, 0.3);
  position: absolute;
  width: 69vw;
  z-index: 99
}
</style>

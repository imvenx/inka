<template>
  <div id="animatorCont" ref="cont">
    <div class="corner"></div>
    <TimePicker @wheel.passive="onWheel" />
    <ElsList />
    <KfEditor @wheel.passive="onWheel" />
  </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import { ref } from 'vue';
import ElsList from './ElsList/ElsList.vue';
import KfEditor from './KfsEditor/KfsEditor.vue';
import TimePicker from './TimePicker.vue';

const cont = ref<HTMLDivElement>()

function onWheel(e: WheelEvent) { if (e.ctrlKey) { zoomTime(e); return } }
const zoomTime = (e: WheelEvent) => ConfigM.zoomPx -= e.deltaY / ConfigM.numDecimals

// const elsListWidth = ref()
// onMounted(() => {
//   elsListWidth.value = contWidth()
//   window.addEventListener('resize', () => elsListWidth.value = contWidth())
// })

// const contWidth = () => `width: ${cont?.value?.offsetWidth! - 3}px`

</script>

<style scoped>
#animatorCont {
  /* box-shadow: 0 0 5px black; */
  /* height: 100%; */
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: max-content auto;
  overflow: hidden;
  /* overflow-x: hidden; */
}

.corner {
  z-index: 100;
  background-color: var(--bgColor1);
  /* border: 1px solid rgb(158, 158, 158); */
}
</style>

<template>
  <div id="animatorCont" ref="cont">
    <div class="corner"></div>
    <TimePicker @wheel="onWheel" />
    <ElsList />
    <KfEditor @wheel="onWheel" />
  </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import { onMounted, ref } from 'vue';
import ElsList from './ElsList/ElsList.vue';
import KfEditor from './KfsEditor/KfEditor.vue';
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
  border: 1px solid black;
  box-shadow: 0 0 5px black;
  height: 89vh;
  display: grid;
  grid-template-columns: 20% 80%;
  grid-template-rows: max-content auto;
  /* overflow: scroll; */
  /* overflow-x: hidden; */
}

.corner {
  z-index: 100;
  background-color: rgb(103, 161, 103);
  /* border: 1px solid rgb(158, 158, 158); */
}
</style>

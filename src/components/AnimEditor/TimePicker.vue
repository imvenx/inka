<template>
  <div ref="cont" id="timePickerCont" @wheel="scrollHorizontally" @mousemove="selectTime" @mousedown="selectTime">
    <div id="offsetDiv"></div>&nbsp;
    <div id="timePickerLine">&nbsp;</div>
    <span v-for="deciSecond in (AnimM.duration * ConfigM.numDecimals)" class="timeStep"
      :style="`left: ${deciSecond * ConfigM.zoomPx + timeSideOffsetPx}px`">
      <div>
        {{ deciSecond / ConfigM.numDecimals }}
      </div>
    </span>
    <span id="offsetRight" :style="`left: ${timePickerWidth}px`"></span>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { AnimM } from 'src/modules/anim_m'
import { svEl } from 'src/modules/svel_m';
import { ConfigM, timePickerWidth, timeSideOffsetPx } from 'src/modules/config_m';

const cont = ref<HTMLDivElement>()

const timePickerLinePos = ConfigM.timePickerLinePos

const scrollHorizontally = (e: WheelEvent) => {
  if (e.ctrlKey) { zoomTime(e); return }
  cont.value?.scrollBy({ left: e.deltaY })
}

const zoomTime = (e: WheelEvent) => ConfigM.zoomPx -= e.deltaY / ConfigM.numDecimals

let outputTimeout = {} as any
const selectTime = async (e: MouseEvent) => {
  if (e.buttons !== 1) return
  if (!cont.value) return
  let pickedTime = (e.clientX - cont.value.getBoundingClientRect().left + cont.value.scrollLeft
    - timeSideOffsetPx)
    / ConfigM.zoomPx / ConfigM.numDecimals
  if (pickedTime < 0) pickedTime = 0
  if (pickedTime > AnimM.duration) pickedTime = AnimM.duration
  await AnimM.selectTime(pickedTime, svEl.value, false)
  await refreshOutputInterval(pickedTime)
}

async function refreshOutputInterval(t: number) {
  clearTimeout(outputTimeout)
  outputTimeout = setTimeout(async () =>
    await AnimM.selectTime(t, svEl.value), 50)
}

onMounted(() => {
  cont.value?.scrollTo({ left: ConfigM.editorScroll.x })
  cont.value?.addEventListener("scroll", (e: Event) => {
    ConfigM.editorScroll.x = cont.value?.scrollLeft ?? 0
  })
})

watch(() => ConfigM.editorScroll.x, (val) => {
  cont.value?.scrollTo({ left: val })
})

</script>

<style scoped>
#timePickerLine {
  position: absolute;
  background-color: aquamarine;
  /* border: 1px solid lightblue; */
  width: .5rem;
  left: v-bind(timePickerLinePos + 'px');
  /* transform-origin: 0 0; */
  transform: translate(-50%);
}

#timePickerCont {
  position: relative;
  display: inline-flex;
  background-color: darkcyan;
  overflow-x: auto;
  overflow-y: hidden;
  font-weight: 1000;
  font-size: .7rem;
  user-select: none;
  /* margin-left: .5em; */
  /* border-left: .5em solid black; */
  /* box-shadow: -.5em 0 0 rgb(0, 58, 58); */
}

.timeStep {
  position: absolute;
  transform-origin: 0 0;
  transform: translate(-50%);
  /* padding: 0 v-bind(timeSideOffsetPx + 'px'); */
}

#offsetRight {
  position: absolute;
  transform-origin: 0 0;
  transform: translate(-200%);
  border: 1px solid transparent;
  width: 0;
  height: 150%;
}

::-webkit-scrollbar {
  height: 0px;
}

#offsetDiv {
  background-color: rgb(0, 80, 80);
  width: v-bind(timeSideOffsetPx + 'px');
  z-index: 10;
  user-select: none;
}

#offsetDiv:hover {
  background-color: rgba(214, 214, 214, 0.753);
}

/* #time-picker {
  display: inline-flex;
  overflow: hidden;
  background-color: rgb(103, 161, 103);
  font-weight: 1000;
}

.time-step:hover {
  color: blue;
  background-color: aliceblue;
} */
</style>

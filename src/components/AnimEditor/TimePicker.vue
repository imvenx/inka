
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { computed } from '@vue/reactivity';
import { AnimM } from 'src/modules/anim_m'
import { svEl } from 'src/modules/svel_m';
import { StorageM } from 'src/modules/storage_m';

const numDecimals = 10
const zoomPx = ref(StorageM.getZoomPxTimePicker() ?? 80)

watch(zoomPx, (v) => StorageM.setZoomPxTimePicker(v))

const cont = ref<HTMLDivElement>()
const scrollHorizontally = (e: WheelEvent) => {
  if (e.ctrlKey) {
    zoomTime(e)
    return
  }
  cont.value?.scrollBy({ left: e.deltaY })
}

const zoomTime = (e: WheelEvent) => zoomPx.value -= e.deltaY / 10

const timePickerLinePos = computed(() =>
  (AnimM.currentTime * numDecimals * zoomPx.value - 0.25) + 'px')

const selectTime = async (e: MouseEvent) => {
  if (e.buttons !== 1) return
  if (!cont.value) return
  let pickedTime = (e.clientX - cont.value.getBoundingClientRect().left + cont.value.scrollLeft)
    / zoomPx.value / numDecimals - 0.0050
  if (pickedTime < 0) pickedTime = 0
  if (pickedTime > AnimM.duration) pickedTime = AnimM.duration
  await AnimM.selectTime(pickedTime, svEl.value)
}

</script>

<template>
  <div ref="cont" id="timePickerCont" @wheel="scrollHorizontally" @mousemove="selectTime" @mousedown="selectTime">&nbsp;
    <div id="timePickerLine">&nbsp;</div>
    <span v-for="timeStep in (AnimM.duration * numDecimals)" class="timeStep" :style="`left: ${timeStep * zoomPx}px`">
      <div style="transform-origin:0 0; transform:translate(-50%); ">
        {{ timeStep / numDecimals }}
      </div>
    </span>
  </div>
  <!-- <div ref="cont" id="time-picker">
    <div v-for="(step, i) in steps" @click="selectTime(i, svEl)" class="stepStyle" :style="[isSelected(i)]">
      {{ i / fps }}
    </div>
    <div class="stepStyle" style="visibility:hidden"></div>
  </div> -->
</template>

<style scoped>
#timePickerLine {
  position: absolute;
  background-color: cyan;
  /* width: .5rem; */
  left: v-bind(timePickerLinePos);
}

#timePickerCont {
  position: relative;
  display: inline-flex;
  background-color: darkcyan;
  overflow-x: auto;
  overflow-y: hidden;
  font-weight: 1000;
  user-select: none;
}

.timeStep {
  position: absolute;
}

::-webkit-scrollbar {
  height: 0px;
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

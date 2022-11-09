
<script lang="ts" setup>
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { AnimM } from 'src/modules/anim_m'
import { svEl } from 'src/modules/svel_m';
import { ConfigM } from 'src/modules/config_m';

const numDecimals = 10

const cont = ref<HTMLDivElement>()

const scrollHorizontally = (e: WheelEvent) => {
  if (e.ctrlKey) {
    zoomTime(e)
    return
  }
  cont.value?.scrollBy({ left: e.deltaY })
}

const zoomTime = (e: WheelEvent) => ConfigM.zoomPx -= e.deltaY / 10

const timePickerLinePos = computed(() =>
  (AnimM.currentTime * numDecimals * ConfigM.zoomPx - 0.25) + 'px')

const selectTime = async (e: MouseEvent) => {
  if (e.buttons !== 1) return
  if (!cont.value) return
  let pickedTime = (e.clientX - cont.value.getBoundingClientRect().left + cont.value.scrollLeft)
    / ConfigM.zoomPx / numDecimals - 0.0050
  if (pickedTime < 0) pickedTime = 0
  if (pickedTime > AnimM.duration) pickedTime = AnimM.duration
  await AnimM.selectTime(pickedTime, svEl.value)
}
</script>

<template>
  <div ref="cont" id="timePickerCont" @wheel="scrollHorizontally" @mousemove="selectTime" @mousedown="selectTime">&nbsp;
    <div id="timePickerLine">&nbsp;</div>
    <span v-for="timeStep in (AnimM.duration * numDecimals)" class="timeStep"
      :style="`left: ${timeStep * ConfigM.zoomPx}px`">
      <div style="transform-origin:0 0; transform:translate(-50%); ">
        {{ timeStep / numDecimals }}
      </div>
    </span>
  </div>
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

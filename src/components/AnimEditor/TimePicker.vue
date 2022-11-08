
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { currentTime, duration, } from 'src/modules/anim_m'
import { ConfigM } from 'src/modules/config_m';
import { computed } from '@vue/reactivity';
import { AnimM } from 'src/modules/anim_m'
import { svEl } from 'src/modules/svel_m';

// const isSelected = (i: number): string => {
//   return `color: ${currentTime.value === i * 1000 / fps.value ? 'red' : ''}`
// }

// const cont = ref<HTMLDivElement>()
// watch(() => ConfigM.editorScroll.x, (val) => {
//   cont.value?.scrollTo({ left: val })
// })

// onMounted(() => {
// cont.value?.scrollTo({ left: ConfigM.editorScroll.x })
// })

const cont = ref<HTMLDivElement>()
const scrollHorizontally = (e: WheelEvent) => cont.value?.scrollBy({ left: e.deltaY })

const timePickerLinePos = computed(() => (currentTime.value * 10 * px.value - 0.25) + 'px')
const selectTime = async (e: MouseEvent) => {
  if (e.buttons !== 1) return
  if (!cont.value) return
  let pickedTime = (e.clientX - cont.value.getBoundingClientRect().left + cont.value.scrollLeft)
    / px.value / 10 - 0.0050
  if (pickedTime < 0) pickedTime = 0
  await AnimM.selectTime(pickedTime, svEl.value)
}

const px = ref(80)
</script>

<template>
  <div ref="cont" id="timePickerCont" @wheel="scrollHorizontally" @mousemove="selectTime" @mousedown="selectTime">&nbsp;
    <div id="timePickerLine">&nbsp;</div>
    <span v-for="second in (duration / 100)" class="timeStep" :style="`left: ${second * px}px`">
      <div style="transform-origin:0 0; transform:translate(-50%)">
        {{ second }}
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
  width: .5rem;
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

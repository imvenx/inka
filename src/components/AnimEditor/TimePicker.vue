<template>
  <div ref="cont" id="timePickerCont" @mousedown="selectTime">
    <div id="offsetDiv"></div>&nbsp;
    <div id="timePickerLine">&nbsp;</div>
    <span class="timeStep" :style="`left: ${timeSideOffsetPx}px`" style="z-index:999">
      <div>0</div>
    </span>
    <span v-for="deciSecond in Math.round(AnimM.durationSeconds * ConfigM.numDecimals)" class="timeStep"
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
import { SvElM } from 'src/modules/svel_m';
import { ConfigM, timePickerWidth, timeSideOffsetPx } from 'src/modules/config_m';

const cont = ref<HTMLDivElement>({} as HTMLDivElement)

const timePickerLinePos = ConfigM.timePickerLinePos



const selectTime = async (e: MouseEvent) => {
  if (e.buttons !== 1) return
  let pickedTime = getPickedTime(e)

  if (pickedTime < 0) pickedTime = 0
  if (pickedTime > AnimM.durationMiliseconds) pickedTime = AnimM.durationMiliseconds
  await AnimM.selectTime(pickedTime, SvElM.rootSvEl)

  window.addEventListener('mousemove', selectTime, { once: true })
}

function getPickedTime({ clientX }: MouseEvent): number {
  return Math.round((clientX - cont.value.getBoundingClientRect().left + cont.value.scrollLeft
    - timeSideOffsetPx) / ConfigM.zoomPx / ConfigM.numDecimals * 1000)
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
  background-color: rgb(81, 160, 81);
  overflow-x: auto;
  overflow-y: hidden;
  font-weight: 1000;
  font-size: .55rem;
  user-select: none;
  /* margin-left: .5em; */
  /* border-left: .5em solid black; */
  /* box-shadow: -.5em 0 0 rgb(0, 58, 58); */
}

/* #timePickerCont:hover {
  font-size: 1rem;
} */

.timeStep {
  position: absolute;
  transform-origin: 0 0;
  transform: translate(-50%);
  /* padding: 0 v-bind(timeSideOffsetPx + 'px'); */
}

#offsetRight {
  position: absolute;
  /* transform-origin: 0 0; */
  transform: translate(-100%);
  border: 1px solid transparent;
  width: 0;
  margin: 0;
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

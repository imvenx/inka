
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { fps, currentTime, duration, } from 'src/modules/anim_m'
import { ConfigM } from 'src/modules/config_m';


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

</script>

<template>
  <div ref="cont" id="timePickerCont" @wheel="scrollHorizontally">&nbsp;
    <div id="timePickerLine">&nbsp;</div>
    <span v-for="second in (duration / 100)" class="timeStep" :style="`left: ${second * 4}rem`">
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
  left: 3.75rem;
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


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { fps, currentTime, steps, selectTime } from 'src/modules/anim_m'
import { svEl } from 'src/modules/svel_m';
import { ConfigM } from 'src/modules/config_m';

// const isMilisecond = (i: number) => (i / fps.value).toString().includes('.')

const isSelected = (i: number): string => {
  // return `fontSize: ${isMilisecond(i) ? '.6rem' : ''};
  return `color: ${currentTime.value === i * 1000 / fps.value ? 'red' : ''}`
}

const cont = ref<HTMLDivElement>()
watch(() => ConfigM.editorScroll.x, (val) => {
  cont.value?.scrollTo({ left: val })
})

onMounted(() => {
  cont.value?.scrollTo({ left: ConfigM.editorScroll.x })
})

</script>

<template>
  <div ref="cont" id="time-picker">
    <div v-for="(step, i) in steps" @click="selectTime(i, svEl)" class="stepStyle" :style="[isSelected(i)]">
      <!-- {{i / fps}} -->
      {{ i / fps }}
    </div>
    <div class="stepStyle" style="visibility:hidden"></div>
  </div>
</template>

<style scoped>
#time-picker {
  /* background-color: rgb(161, 161, 161);
  border-bottom: 1px solid black;
  border-left: 1px solid black; */
  display: inline-flex;
  overflow: hidden;
  background-color: rgb(103, 161, 103);
  font-weight: 1000;
}

/* .time-step {
  cursor: pointer;
  background-color: rgb(212, 212, 212);
  font-size: .8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  width: 3em;
  display: block;
  min-width: 3em;
  margin: 0 .2em;
} */

.time-step:hover {
  color: blue;
  background-color: aliceblue;
}
</style>

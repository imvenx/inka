<template>
  <svg width="100%" height="100%" ref="cont" id="kfCont">
    <KfsLine :el="svEl" />
  </svg>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import KfsLine from './KfsLine/KfsLine.vue';
import { svEl } from 'src/modules/svel_m';
import { ConfigM } from 'src/modules/config_m';

const cont = ref<HTMLDivElement>()
onMounted(() => { if (cont.value) ConfigM.initEditorScroll(cont.value) })

// function selectionBox(e: MouseEvent) {
//   if (e.buttons === 1) {

//   }
// }

// type SelectionBox = {
//   isActive: boolean
// }

</script>

<style scoped>
#kfCont {
  overflow: scroll;
  box-shadow: inset 1px 1px 10px black;
}



/* .kf {
  height: 1rem;
} */
</style>

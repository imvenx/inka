<template>
  <q-page style="height: 100%;" v-if="mount" id="q-page">

    <div id="page">

      <anim-editor />

      <anim-viewer />

    </div>

  </q-page>

  <h3 v-else style="text-align:Center">loading...</h3>

</template>

<script setup lang="ts">
import ProjectMenu from "src/components/ActionButtons/ProjectMenu.vue";
import AnimEditor from "src/components/AnimEditor/AnimEditor.vue";
import { AnimM } from "src/modules/anim_m";
import { svgIO } from "src/modules/svgIO_m";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import AnimViewer from "../components/AnimViewer/AnimViewer.vue";
const route = useRoute()
const mount = ref(!route.query.refreshApp)
onBeforeMount(() => {
  if (route.query.refreshApp) { location.replace(''); return }
  svgIO.input()
})


const animPageBorder = computed(() => {
  if (AnimM.isRecording) return '30px dashed red'
  if (AnimM.isPlayingAnim) return '30px dashed orange'

  return '0 dashed darkgrey'
})

</script>

<style scoped>
#page {
  display: grid;
  grid-template-columns: 70% auto;
  gap: 1%;
  /* overflow: visible; */
  height: inherit;
  /* border: v-bind(animPageBorder); */

}

#q-page {
  outline: v-bind(animPageBorder);
  outline-offset: -1px;
  margin-left: 1px;
}
</style>

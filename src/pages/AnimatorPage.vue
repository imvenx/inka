<template>
  <q-page v-if="mount" class="row items-center justify-evenly">
    <div id="page">
      <anim-editor />
      <anim-viewer />
    </div>
  </q-page>
  <h3 v-else style="text-align:Center">loading...</h3>
</template>

<script setup lang="ts">
import AnimEditor from "src/components/AnimEditor/AnimEditor.vue";
import { svgIO } from "src/modules/svgIO_m";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import AnimViewer from "../components/AnimViewer.vue";
const route = useRoute()
const mount = ref(!route.query.refreshApp)
onBeforeMount(() => {
  if (route.query.refreshApp) { location.replace(''); return }
  svgIO.input()
})

</script>

<style scoped>
#page {
  display: grid;
  grid-template-columns: 70% auto;
  width: 99%;
  gap: 1%;
}
</style>

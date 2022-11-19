<template>
  <q-page class="row items-center justify-evenly">
    <div id="page">
      <anim-editor />
      <anim-viewer />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AnimEditor from "src/components/AnimEditor/AnimEditor.vue";
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import AnimViewer from "../components/AnimViewer.vue";
const route = useRoute()
const router = useRouter()
onBeforeMount(() => {
  if (route.query.refreshApp) {
    location.replace('/')
  }

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

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
import AnimViewer from "../components/AnimViewer.vue";

</script>

<style scoped>
#page {
  display: grid;
  grid-template-columns: 70% auto;
  width: 99%;
  gap: 1%;
}
</style>

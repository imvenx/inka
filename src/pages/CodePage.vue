<template>
  <q-page class="row items-center justify-evenly">
    <div id="page">
      <div contenteditable="true" spellcheck="false" style="overflow:scroll; height:90vh; border: 2px solid black;
      padding:.2em; background-color: rgb(20,20,20); color:burlywood;  ">
        <pre style="margin:0; font-size: small; white-space: break-spaces;">{{ svgString }}</pre>
      </div>
      <anim-viewer />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { svgString } from "src/modules/svel_m";
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

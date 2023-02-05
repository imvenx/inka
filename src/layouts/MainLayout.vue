<template>
  <q-layout view="hHh Lpr lFf" style="outline:none">
    <q-header elevated id="qHeader">
      <div> &nbsp;
        <ActionButtons />
      </div>
    </q-header>
    <q-page-container id="qPageContainer">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ActionButtons from 'src/components/ActionButtons/ActionButtons.vue';
</script>

<style scoped>
#qHeader {
  height: 1.4rem;
  background-color: black;
}

#qPageContainer {
  /* margin-top: .2rem; */
  /* height: calc(100vh - 1.8rem); */
  /* box-shadow: inset 0 0 0px 1px yellow; */
  height: 100vh;
}
</style>
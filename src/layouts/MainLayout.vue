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
import ActionButtons from 'src/components/ActionButtons.vue';
</script>

<style scoped>
#qHeader {
  height: 1.4rem;
  background-color: #333;;
}

#qPageContainer {
  height: 100vh;
}
</style>
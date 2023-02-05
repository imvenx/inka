<template>
  <q-layout view="hHh Lpr lFf" style="outline:none" tabindex="0" @focus="isWindowFocused = true"
    @focusout="isWindowFocused = false">
    <!-- <div v-if="!isWindowFocused"
      style="text-align:center;z-index:999999; background-color: rgba(0,0,0,.5); position: absolute; top:0; bottom: 0; left: 0; right: 0;">
      <div style="margin-top: 4em; font-size: 2em; user-select: none; pointer-events: none;">
        unfocused
      </div>
    </div> -->
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
import { provide, ref } from 'vue';

const isWindowFocused = ref(true)
provide('isWindowFocused', isWindowFocused)

</script>

<style scoped>
#qHeader {
  height: 1.4rem;
  background-color: rgb(20, 20, 20);
}

#qPageContainer {
  /* margin-top: .2rem; */
  /* height: calc(100vh - 1.8rem); */
  /* box-shadow: inset 0 0 0px 1px yellow; */
  height: 100vh;
}
</style>
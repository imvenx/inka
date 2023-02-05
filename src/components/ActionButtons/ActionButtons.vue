<template>
  <div id="act-btn-cont">
    <div> &nbsp;

      <q-btn v-bind="btnAttrs" icon="home" title="menu" @click="goToMenu()"></q-btn>

      <FileMenu />

      <!-- <q-btn v-bind="btnAttrs" icon="bug_report" title="debug" disabled></q-btn> -->

      <span id="projectMenuCont"></span>

      <q-btn v-bind="btnAttrs" style="border:1px solid grey" title="animator" @click="goToAnimEditor()">
        <!-- <q-icon name="slideshow" /> -->
        &nbsp;{{ ConfigM.projectName }}&nbsp;</q-btn>

      <q-btn v-bind="btnAttrs" icon="refresh" title="refresh [ctrl] + [shift] + [R]" @click="refresh()"></q-btn>

      <q-btn v-bind="btnAttrs" icon="code" title="code" @click="goToCode()"></q-btn>

      <HowToMenu />

      <span id="timeMenuCont"></span>

    </div>

    <div id="videoPlayerButtons"> </div>

    <WindowButtons />

  </div>
</template>

<script lang="ts" setup>
import { AnimM } from 'src/modules/anim_m';
import { KfsM } from 'src/modules/kfs_m';
import { eapi } from 'src/modules/eapi_m';
import { useRouter } from 'vue-router';
import { ConfigM } from 'src/modules/config_m';
import { provide } from 'vue';
import { SvElM } from 'src/modules/svel_m';
import FileMenu from './FileMenu.vue';
import ProjectMenu from './ProjectMenu.vue';
import TimerMenu from './TimerMenu.vue';
import { btnAttrs } from 'src/modules/constants';
import WindowButtons from './WindowButtons.vue';
import HowToMenu from './HowToMenu.vue';

const router = useRouter()

const refresh = () => location.reload()

function goToCode() { router.push('/code') }
function goToAnimEditor() { router.push('/') }
function goToMenu() { router.push('/home') }

// function deleteAll() {
//   if (!confirm("Are you sure you want to delete all your projects?")) return
//   StorageM.clear()
//   location.reload()
// }

// function deleteAnim() {
//   StorageM.clear()
//   StorageM.setFilePath(ConfigM.filePath)
//   // StorageM.setCurrentProjectId(ConfigM.projectId)
//   location.reload()
// }

// async function importFile() {
//   // const success = await ConfigM.importFile()
//   // if (success) 
//   router.push('/')

//   // ConfigM.newProjectId()
//   // ConfigM.filePath = await eapi.updateFilePath()
//   // svgIO.input()
// }

window.addEventListener('keydown', (e) => {
  if (e.key !== 'F1') return
  AnimM.pauseOrPlayAnim()
})


</script>

<style scoped>
#act-btn-cont {
  display: grid;
  grid-template-columns: 70% auto;
  width: 99%;
  gap: 1%;
  position: absolute;
  top: 0;
}


/* #windowButtons {
  display: flex;
  gap: .5em;
} */
</style>

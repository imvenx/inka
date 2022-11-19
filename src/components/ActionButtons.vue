<template>
  <div id="act-btn-cont">
    <div> &nbsp;
      <q-btn v-bind="btnAttrs" icon="home" title="menu" @click="goToMenu()"></q-btn>
      <q-btn v-bind="btnAttrs">
        File
        <q-menu dark>
          <q-list dense>
            <!-- <q-item clickable v-close-popup disabled>Save</q-item> -->
            <q-item clickable v-close-popup @click="importFile()">Import SVG</q-item>
            <q-item clickable v-close-popup @click="exportToSvg()">Export</q-item>
            <q-item clickable v-close-popup @click="eapi.openProjectInInkscape()">Open frame editor</q-item>
            <q-item clickable v-close-popup @click="deleteAll()">Delete All</q-item>
            <!-- <q-item clickable v-close-popup @click="deleteAnim()">Delete Anim</q-item> -->
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn v-bind="btnAttrs" icon="slideshow" title="animator" @click="goToAnimEditor()"></q-btn>
      <q-btn v-bind="btnAttrs" icon="code" title="code" @click="goToCode()"></q-btn>
      <q-btn v-bind="btnAttrs" icon="bug_report" title="debug" disabled></q-btn>
      <q-btn v-bind="btnAttrs" icon="refresh" title="refresh [ctrl] + [shift] + [R]" @click="refresh()"></q-btn>
      <div class="float-right">
        <div class="float-left">
          <!-- <input type="text" placeholder="projectName" value="ProjName" class="timeInput">
          <input type="text" placeholder="animName" value="AnimName" class="timeInput"> -->
          <input min="0.01" step="0.01" title="animation current time" type="number" class="timeInput"
            @change="selectTime()" v-model="AnimM.currentTime">
        </div>
        <div class="float-right">
          <q-btn v-bind="btnAttrs" icon="task_alt" title="apply duration change" v-if="isDurationModified"
            @click="applyModifyDuration" />
          <q-btn v-bind="btnAttrs" icon="cancel" title="cancel duration change" v-if="isDurationModified"
            @click="isDurationModified = false" />
          <input ref="durationInput" min="0.1" step="0.1" title="animation duration" type="number" class="timeInput"
            :value="AnimM.duration" @input="modifyDuration">
          <q-btn v-bind="btnAttrs" icon="settings" title="time settings">
            <q-menu dark>
              <q-list dense tag="label">
                <q-item tag="label" clickable v-ripple
                  title="enable this to prevent slow down or speed up your animation when changing the duration">
                  <q-item-section side>
                    <input id="recalculate" type="checkbox" v-model="AnimM.recalculateKfsOnChangeDuration" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Recalculate kfs time on change duration</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
    <div style="text-align:center;">
      <q-btn v-bind="btnAttrs" title="record" disabled>⬤</q-btn>
      <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="play [F1]" v-if="!AnimM.isPlayingAnim">
        ▶
      </q-btn>
      <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="pause [F1]" v-else style="color:red; ">| |
      </q-btn>
      <q-btn v-bind="btnAttrs" @click="createKeyFrame(svEl)" title="keyframe"><b>◆</b></q-btn>
    </div>
    <div style="position:absolute; display: flex; right:-.5em; ">
      <div id="windowButtons" v-bind="btnAttrs">
        <div icon="resize" style="margin-right:-5px" id="dragWindow" title="keyframe">
          <q-btn v-bind="btnAttrs">⚓</q-btn>
        </div>
      </div>
      <q-btn style="color:red" v-bind="btnAttrs" title="close" @click="closeApp()">✖</q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { exportToSvg } from 'src/modules/export_m';
import { AnimM } from 'src/modules/anim_m';
import { svEl } from 'src/modules/svel_m';
import { createKeyFrame } from 'src/modules/keyframe_m';
import { eapi } from 'src/modules/eapi_m';
import { useRouter } from 'vue-router';
import { StorageM } from 'src/modules/storage_m';
import { ConfigM } from 'src/modules/config_m';
import { ref } from 'vue';

const router = useRouter()

function selectTime() { AnimM.selectTime(AnimM.currentTime, svEl.value) }

const refresh = () => location.reload()

const isDurationModified = ref(false)
function modifyDuration(e: any) {
  isDurationModified.value = e.target.value != AnimM.duration
}
const durationInput = ref<HTMLInputElement>()
function applyModifyDuration(e: InputEvent) {
  if (confirm('are you sure you want to change the duration? this could affect keyframes time')) {
    AnimM.duration = durationInput.value!.value as any ?? AnimM.duration
  }
  isDurationModified.value = false
}

function goToCode() { router.push('/code') }
function goToAnimEditor() { router.push('/') }
function goToMenu() { router.push('/home') }

function deleteAll() {
  if (!confirm("Are you sure you want to delete all your projects?")) return
  StorageM.clear()
  location.reload()
}

// function deleteAnim() {
//   StorageM.clear()
//   StorageM.setFilePath(ConfigM.filePath)
//   // StorageM.setCurrentProjectId(ConfigM.projectId)
//   location.reload()
// }

async function importFile() {
  await ConfigM.importFile()
  router.push('/')

  // ConfigM.newProjectId()
  // ConfigM.filePath = await eapi.updateFilePath()
  // svgIO.input()
}

const btnAttrs = {
  size: "12px",
  padding: "0 sm",
  'no-caps': ''
}

window.addEventListener('keydown', (e) => { if (e.key === 'F1') AnimM.pauseOrPlayAnim() })

const closeApp = async () => await eapi.closeApp()

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

#dragWindow {
  -webkit-user-select: none;
  user-select: none;
  -webkit-app-region: drag;
}

/* #windowButtons {
  display: flex;
  gap: .5em;
} */

.timeInput {
  width: 4rem;
  height: 1.2rem;
  background-color: black;
  color: white;
}
</style>

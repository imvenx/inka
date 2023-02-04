<template>
  <div id="act-btn-cont">
    <div> &nbsp;
      <q-btn v-bind="btnAttrs" icon="home" title="menu" @click="goToMenu()"></q-btn>
      <q-btn v-bind="btnAttrs">
        File
        <q-menu dark>
          <q-list dense>
            <q-item clickable v-close-popup @click="loadProject()">Load</q-item>
            <q-item clickable v-close-popup @click="ProjectM.saveProject()">Save</q-item>
            <!-- <q-item clickable v-close-popup @click="importFile()">Import SVG</q-item> -->
            <q-item clickable v-close-popup @click="ExportM.exportToSvg()">Export</q-item>
            <q-item clickable v-close-popup @click="ProjectM.askInkscapePath()">Select inkscape application</q-item>
            <q-item clickable v-close-popup @click="ProjectM.openSvgWithDefaultProgram()">Open SVG with default
              program</q-item>
            <q-item clickable v-close-popup @click="ProjectM.openSvgWithDefaultProgram()">Open SVG with default
              program</q-item>
            <!-- <q-item clickable v-close-popup @click="deleteAll()">Delete All</q-item> -->
            <!-- <q-item clickable v-close-popup @click="deleteAnim()">Delete Anim</q-item> -->
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn v-bind="btnAttrs" icon="slideshow" title="animator" @click="goToAnimEditor()"></q-btn>
      <q-btn v-bind="btnAttrs" icon="code" title="code" @click="goToCode()"></q-btn>
      <q-btn v-bind="btnAttrs" icon="bug_report" title="debug" disabled></q-btn>
      <q-btn v-bind="btnAttrs" icon="refresh" title="refresh [ctrl] + [shift] + [R]" @click="refresh()"></q-btn>
      <q-btn v-bind="btnAttrs" icon="article" title="project">
        <q-menu dark>
          <q-list dense tag="label">
            <q-item tag="label" clickable v-ripple>
              <q-item-section>
                <q-item-label>project name</q-item-label>
              </q-item-section>
              <q-item-section side>
                <input id="recalculate" type="text" v-model="ConfigM.projectName" />
              </q-item-section>
            </q-item>
            <q-item tag="label" clickable v-ripple>
              <q-item-section>
                <q-item-label>file path</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ StorageM.getCurrentFilePath() }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      {{ ConfigM.projectName }}
      <div class="float-right">
        <div class="float-left">
          <!-- <input type="text" placeholder="projectName" value="ProjName" class="timeInput">
          <input type="text" placeholder="animName" value="AnimName" class="timeInput"> -->
          <input min="0.01" step="0.01" title="animation current time" type="number" class="timeInput"
            @change="selectTime()" v-model="AnimM.currentTimeSeconds">
        </div>
        <div class="float-right">
          <template v-if="isDurationModified">
            <q-btn v-bind="btnAttrs" icon="task_alt" title="apply duration change" @click="applyModifyDuration()" />
            <q-btn v-bind="btnAttrs" icon="cancel" title="cancel duration change" @click="isDurationModified = false" />
          </template>
          <input ref="durationInput" min="0.1" step="0.1" title="animation duration" type="number" class="timeInput"
            :value="AnimM.durationSeconds" @input="modifyDuration">
          <q-btn v-bind="btnAttrs" icon="settings" title="time settings">
            <q-menu dark>
              <q-list dense tag="label">
                <q-item tag="label" clickable v-ripple
                  title="enable this to prevent slow down or speed up your animation when changing the duration">
                  <q-item-section>
                    <q-item-label>Recalculate kfs time on change duration</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <input id="recalculate" type="checkbox" v-model="AnimM.recalculateKfsOnChangeDuration" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
    <div style="text-align:center;" id="videoPlayerButtons">
      <q-btn v-bind="btnAttrs" title="record" disabled>⬤</q-btn>
      <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="play [F1]" v-if="!AnimM.isPlayingAnim">
        ▶
      </q-btn>
      <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="pause [F1]" v-else style="color:red; ">| |
      </q-btn>
      <q-btn v-bind="btnAttrs" @click="KfsM.createKeyFrame(SvElM.rootSvEl)" title="keyframe"><b>◆</b></q-btn>
    </div>
    <div style="position:absolute; display: flex; right:-.5em; ">
      <div id="windowButtons" v-bind="btnAttrs">
        <div class="btnAttrs" icon="resize" id="dragWindow" title="keyframe">
          <q-btn v-bind="btnAttrs">
          <svg width="100%" height="auto" viewBox="0 0 100 100" version="1.1" id="svg5" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
            <defs
              id="defs143">
              <marker
                style="overflow:visible"
                id="marker1148"
                refX="0"
                refY="0"
                orient="auto-start-reverse"
                inkscape:stockid="Arrow1"
                markerWidth="4.0606604"
                markerHeight="6.7071066"
                viewBox="0 0 4.0606602 6.7071068"
                inkscape:isstock="true"
                inkscape:collect="always"
                preserveAspectRatio="xMidYMid">
                <path
                  style="fill:none;stroke:context-stroke;stroke-width:1;stroke-linecap:butt"
                  d="M 3,-3 0,0 3,3"
                  id="path1146"
                  transform="rotate(180,0.125,0)"
                  sodipodi:nodetypes="ccc" />
              </marker>
              <marker
                style="overflow:visible"
                id="Arrow1"
                refX="0"
                refY="0"
                orient="auto-start-reverse"
                inkscape:stockid="Arrow1"
                markerWidth="4.0606604"
                markerHeight="6.7071066"
                viewBox="0 0 4.0606602 6.7071068"
                inkscape:isstock="true"
                inkscape:collect="always"
                preserveAspectRatio="xMidYMid">
                <path
                  style="fill:none;stroke:context-stroke;stroke-width:1;stroke-linecap:butt"
                  d="M 3,-3 0,0 3,3"
                  id="path5057"
                  transform="rotate(180,0.125,0)"
                  sodipodi:nodetypes="ccc" />
              </marker>
            </defs>
            <path
              style="marker-start:url(#Arrow1);marker-end:url(#marker1148)"
              d="M 13.549034,51.004801 H 85.994552"
              id="path357" />
            <path
              style="marker-start:url(#Arrow1);marker-end:url(#marker1148)"
              d="M 49.771793,14.782043 V 87.22756"
              id="path373" />
          </svg>
          </q-btn>
        </div>
      </div>
      <q-btn class="close btnAttrs" v-bind="btnAttrs" title="close" @click="closeApp()">
        <svg width="100%" height="auto" viewBox="0 0 100 100" version="1.1" id="svg5" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
          <path d="M 24.386641,24.386641 75.613359,75.613359" id="path357" />
          <path d="M 75.613358,24.386641 24.386642,75.613359" id="path373" />
        </svg>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ExportM } from 'src/modules/export_m';
import { AnimM } from 'src/modules/anim_m';
import { KfsM } from 'src/modules/kfs_m';
import { eapi } from 'src/modules/eapi_m';
import { useRouter } from 'vue-router';
import { ConfigM } from 'src/modules/config_m';
import { ref } from 'vue';
import { ProjectM } from 'src/modules/project_m';
import { StorageM } from 'src/modules/storage_m';
import { SvElM } from 'src/modules/svel_m';

const router = useRouter()
async function loadProject() {
  const success = await ProjectM.loadProject()
  if (success) {
    router.push({ path: '/', query: { refreshApp: true } } as any)
    location.reload()
  }
}

function selectTime() { AnimM.selectTime(AnimM.currentTimeMiliseconds, SvElM.rootSvEl) }

const refresh = () => location.reload()

const isDurationModified = ref(false)
function modifyDuration(e: any) {
  isDurationModified.value = e.target.value != AnimM.durationSeconds
}
const durationInput = ref<HTMLInputElement>()
function applyModifyDuration() {
  if (confirm('are you sure you want to change the duration? this could affect keyframes time')) {
    AnimM.durationSeconds = durationInput.value!.value as any ?? AnimM.durationSeconds
  }
  isDurationModified.value = false
}

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

const btnAttrs = {
  size: "12px",
  padding: "0 sm",
  'no-caps': '',
}

window.addEventListener('keydown', (e) => {
  if (e.key !== 'F1') return
  AnimM.pauseOrPlayAnim()
})

const closeApp = async () => await eapi.closeApp()

</script>

<style scoped>
#act-btn-cont {
  display: grid;
  grid-template-columns: 70% auto;
  width: 99%;
  position: absolute;
  top: 0;
}

#dragWindow {
  -webkit-user-select: none;
  user-select: none;
  -webkit-app-region: drag;
}
.btnAttrs * {
  height: 18px !important;
  stroke: var(--lightWhite);
  stroke-width: 5px;
}

/* #windowButtons {
  display: flex;
  gap: .5em;
} */

.timeInput {
  width: 4rem;
  height: 1.2rem;
  background-color: var(--bgColor1);
  color: var(--fontColor1);
  border-style:solid;
  border-width:1px;
  margin-left:-1px;
  border-color:var(--bgColor2);
  margin:2px -1px 2px 0;
  font-size:0.8rem;
}
</style>

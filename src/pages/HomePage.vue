<template>
  <q-page class="q-pa-xs" style="height: 100%;">
    <div style="overflow:auto; height:100%">
      <div style="display:grid; grid-template-columns: 24.5% 24.5% auto; gap:.5%">
        <div style="display:flex; flex-direction: column;">
          <q-btn class="headerItem" dense icon="add" @click="createProject()">New</q-btn>
          <q-btn class="headerItem" dense icon="download" @click="createProject(true)">New from SVG</q-btn>
        </div>
        <q-btn class="headerItem" dense icon="folder_open" @click="loadProject">Load</q-btn>
        <div class="headerItem">
          <q-input v-model="filterString" dark dense label="search by path">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- <div style=" position: relative;border:1px dashed black; background-color: grey;">
          <img src="src/assets/inka1_1.svg"
            style="position:absolute; left:50%; transform: translate(-50%); height:5em; " />
        </div> -->

      </div>
      <div style=" margin-top: auto; font-size: 1.5rem; font-weight: 800; text-decoration: underline; color:black; text-align: center;
        border-bottom: 1px;
        ">
        Open recent:
      </div>
      <q-list id="qList">

        <div class="projectItem"
          v-for=" filePath in recentFilePaths.filter(x => x.toLowerCase().includes(filterString.toLowerCase()))">
          <div>
            {{ filePath }}
          </div>
          <div style="display:flex; gap:1em; margin-left: auto;">
            <q-btn @click="loadRecent({ filePath: filePath, openInkscape: true })" color="green" dense no-caps flat
              icon="file_open" title="open project in inka and open inkscape" />

            <q-btn @click="loadRecent({ filePath: filePath, openInkscape: false })" dense no-caps flat icon="visibility"
              title="open project without opening inkscape (in windows require manually file revert on inkscape if window was already open)" />

            <q-btn @click="deleteRecentFilePathFromList(filePath)" color="red" dense no-caps flat icon="playlist_remove"
              title="remove from list" />
          </div>
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { loadProjectParams } from 'app/public/sharedModels';
import { ProjectM } from 'src/modules/project_m';
import { StorageM } from 'src/modules/storage_m';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
// const projs = StorageM.getAllProjects()
const recentFilePaths = ref(StorageM.getRecentFilePaths())

const filterString = ref('')

async function createProject(doImportSvg = false) {
  const success = await ProjectM.createProject({ doImportSvg: doImportSvg })
  if (success) await router.push({ path: '/', query: { refreshApp: true } as any })
}

async function loadProject() {
  const success = await ProjectM.loadProject()
  if (success) {
    router.push({ path: '/', query: { refreshApp: true } } as any)
    location.reload()
  }
}

async function loadRecent(params: loadProjectParams) {
  try {
    const success = await ProjectM.loadProject(params)
    if (success) await router.push({ path: '/', query: { refreshApp: true } as any })
  }
  catch (e) {
    console.log(e)
    if (("" + e).includes('no such file or directory')) {
      if (!params.filePath) return
      recentFilePaths.value.splice(recentFilePaths.value.indexOf(params.filePath))
      StorageM.updateRecentFilePaths(recentFilePaths.value)
    }
  }
}

function deleteRecentFilePathFromList(path: string) {
  recentFilePaths.value.splice(recentFilePaths.value.indexOf(path))
  StorageM.updateRecentFilePaths(recentFilePaths.value)
}

</script>

<style scoped>
.headerItem {
  background-color: rgb(19, 19, 19);
  /* margin: 2px; */
  box-shadow: 0 0 5px black;
  border: 1px solid grey;
  /* display: inline-block; */
  padding: 0 1em;
}

.projectItem {
  background-color: rgb(19, 19, 19);
  margin: 2px;
  box-shadow: 0 0 5px black;
  border: 1px solid grey;
  word-break: break-all;
  padding: .3em;
  display: flex;
}

#qList {
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>

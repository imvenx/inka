<template>
  <q-page class="q-pa-xs" style="height: 100%;">
    <div style="overflow:auto; height:100%">
      <q-list id="qList">
        <div style="display:flex">
          <q-btn class="homeItem" icon="add" @click="createProject()">New</q-btn>
          <q-btn class="homeItem" icon="download" @click="createProject(true)">New from SVG</q-btn>
          <q-input disable style="padding: 0 1em .5em 1em" dark dense class="homeItem" v-model="searchStr">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <div style="margin-left: auto; margin-top: auto; font-size: 1.5rem;">
            Open recent:
          </div>
        </div>
        <div></div>

        <q-item dense class="homeItem" v-for=" filePath in recentFilePaths" clickable @click="loadProject(filePath)">
          {{ filePath }}
        </q-item>
      </q-list>
      <q-btn class="homeItem" icon="download" @click="askInkscapePath()">Change inkscape path</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ProjectM } from 'src/modules/project_m';
import { StorageM } from 'src/modules/storage_m';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
// const projs = StorageM.getAllProjects()
const recentFilePaths = StorageM.getRecentFilePaths()

async function createProject(doImportSvg = false) {
  const success = await ProjectM.createProject({ doImportSvg: doImportSvg })
  if (success) await router.push({ path: '/', query: { refreshApp: true } as any })
}

async function askInkscapePath() {
  const newInkscapePath = await ProjectM.askInkscapePath()
  if (newInkscapePath) exec(`"${newInkscapePath}" ${tempFilePath()}`)
}
const searchStr = ref('')

const loadProject = async (path: string) => {
  const success = await ProjectM.loadProject({ filePath: path })
  if (success) await router.push({ path: '/', query: { refreshApp: true } as any })
}
</script>

<style scoped>
.homeItem {
  background-color: rgb(19, 19, 19);
  margin: 2px;
  box-shadow: 0 0 5px black;
  border: 1px solid grey;
}

#qList {
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>

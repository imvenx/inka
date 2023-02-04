<template>
  <q-page class="q-pa-xs" style="height: 100%;">
    <div style="overflow:auto; height:100%">
      <q-list id="qList">
        <div style="display:flex">
          <q-btn class="homeItem" icon="add" @click="createProject()">New</q-btn>
          <q-btn class="homeItem" icon="download" @click="createProject(true)">New from SVG</q-btn>
          <q-input v-model="filterString" style="padding: 0 1em .5em 1em" dark dense class="homeItem">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <div style="margin-left: auto; margin-top: auto; font-size: 1.5rem;">
            Open recent:
          </div>
        </div>
        <div></div>

        <q-item dense class="homeItem"
          v-for=" filePath in recentFilePaths.filter(x => x.toLowerCase().includes(filterString.toLowerCase()))">
          {{ filePath }}
          <div style="margin-left:auto; display:flex; gap:1em">
            <q-btn @click="loadProject(filePath)" color="primary" dense no-caps flat icon="file_open" title="open" />
            <q-btn @click="deleteRecentFilePathFromList(filePath)" color="red" dense no-caps flat icon="playlist_remove"
              title="remove from list" />
          </div>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ProjectM } from 'src/modules/project_m';
import { StorageM } from 'src/modules/storage_m';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
// const projs = StorageM.getAllProjects()
const recentFilePaths = ref(StorageM.getRecentFilePaths())

const filterString = ref('')

async function createProject(doImportSvg = false) {
  const success = await ProjectM.createProject({ doImportSvg: doImportSvg })
  if (success) await router.push({ path: '/', query: { refreshApp: true } as any })
}

const loadProject = async (path: string) => {
  try {
    const success = await ProjectM.loadProject({ filePath: path })
    if (success) await router.push({ path: '/', query: { refreshApp: true } as any })
  }
  catch (e) {
    console.log(e)
    if (("" + e).includes('no such file or directory')) {
      recentFilePaths.value.splice(recentFilePaths.value.indexOf(path))
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

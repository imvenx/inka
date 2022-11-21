<template>
  <q-page class="row items-center justify-evenly">
    <div id="page">
      <div style="overflow:scroll; height:88vh; ">
        <q-list style="display:grid; grid-template-columns: 50% 50%; ">
          <!-- <q-item>
          <q-btn>New Project</q-btn>
        </q-item> -->


          <div style="display:flex">
            <q-btn class="home-item" icon="add" @click="createProject()">New</q-btn>
            <q-btn class="home-item" icon="download" @click="createProject(true)">New from SVG</q-btn>
            <q-input disable style="padding: 0 1em .5em 1em" dark dense class="home-item" color="teal"
              v-model="searchStr">
              <template v-slot:prepend>
                <q-icon color="teal" name="search" />
              </template>
            </q-input>
          </div>
          <q-item class="home-item" v-for=" filePath in recentFilePaths" clickable @click="loadProject(filePath)">
            {{ filePath }}
            <!-- <b>{{ proj[1].projectName ?? 'no_name' }}</b> &nbsp;&nbsp;➡
            {{ proj[1].filePath }} -->
          </q-item>
          <!-- <q-item class="home-item" v-for=" proj in projs" clickable @click="loadProject(proj[0], proj[1].filePath)">
            <b>{{ proj[1].projectName ?? 'no_name' }}</b> &nbsp;&nbsp;➡
            {{ proj[1].filePath }}
          </q-item> -->
        </q-list>
      </div>
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
  if (success) router.push({ path: '/', query: { refreshApp: true } } as any)
}

const searchStr = ref('')

const loadProject = async (path: string) => {
  const success = await ProjectM.loadProject({ filePath: path })
  if (success) router.push({ path: '/', query: { refreshApp: true } as any })
}
</script>

<style scoped>
#page {
  width: 100%;
}

.home-item {
  color: darkcyan;
  background-color: black;
  margin: 2px;
  box-shadow: 0 0 5px black;
  border: 1px solid darkcyan;
}
</style>

<template>
  <q-page class="row items-center justify-evenly">
    <div id="page">
      <div style="overflow:scroll; height:88vh; ">
        <q-list style="display:grid; grid-template-columns: 50% 50%; ">
          <!-- <q-item>
          <q-btn>New Project</q-btn>
        </q-item> -->


          <div style="display:grid; grid-template-columns: 25% 25% 50%;">
            <q-btn disable class="home-item" icon="add">New</q-btn>
            <q-btn class="home-item" icon="download" @click="importFile()">Import</q-btn>
            <q-input disable style="padding: 0 1em" dark dense class="home-item" color="teal" v-model="searchStr">
              <template v-slot:prepend>
                <q-icon color="teal" name="search" />
              </template>
            </q-input>
          </div>
          <q-item class="home-item" v-for=" proj in projs" clickable @click="loadProject(proj[0], proj[1].filePath)">
            {{ proj[1].filePath }}
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ConfigM } from 'src/modules/config_m';
import { StorageM } from 'src/modules/storage_m';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const projs = StorageM.getAllProjects()

const importFile = async () => {
  await ConfigM.importFile()
  router.push('/')
}

const searchStr = ref('')

const loadProject = async (id: string, path: string) => {
  await ConfigM.loadProject(id, path)
  router.push('/')
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

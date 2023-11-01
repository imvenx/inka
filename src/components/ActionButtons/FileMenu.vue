<template>
    <q-btn v-bind="btnAttrs">
        File
        <q-menu dark>
            <q-list dense>
                <q-item clickable v-close-popup @click="loadProject()">Load</q-item>
                <q-item clickable v-close-popup @click="ProjectM.saveProject()">Save</q-item>
                <!-- <q-item clickable v-close-popup @click="importFile()">Import SVG</q-item> -->
                <q-item clickable v-close-popup @click="ExportM.exportToSvg()">Export</q-item>
                <q-item clickable v-close-popup @click="ProjectM.openSvgWithInkscape()">Open SVG with
                    Inkscape</q-item>

                <q-item clickable v-close-popup @click="eapi.resetInkscapePath()">Reset Inkscape path</q-item>
                <q-item clickable v-close-popup @click="ProjectM.openSvgWithDefaultProgram()">Open SVG with default
                  program</q-item>
                <q-item clickable v-close-popup @click="eapi.dock()">Dock to bottom (restart app)</q-item>
                  <!-- <q-item clickable v-close-popup @click="deleteAll()">Delete All</q-item> -->
                <!-- <q-item clickable v-close-popup @click="deleteAnim()">Delete Anim</q-item> -->
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script lang="ts" setup>
import { btnAttrs } from 'src/modules/constants';
import { eapi } from 'src/modules/eapi_m';
import { ExportM } from 'src/modules/export_m';
import { ProjectM } from 'src/modules/project_m';
import { useRouter } from 'vue-router';

const router = useRouter()

async function loadProject() {
    const success = await ProjectM.loadProject()
    if (success) {
        router.push({ path: '/', query: { refreshApp: true } } as any)
        location.reload()
    }
}

</script>

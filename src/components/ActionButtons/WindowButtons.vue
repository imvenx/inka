<template>
    <div style="position:absolute; display: flex; right:-.5em; ">
        <div id="windowButtons" v-bind="btnAttrs">

            <div icon="resize" style="margin-right:-5px" id="dragWindow" title="keyframe">
                <q-btn v-bind="btnAttrs" icon="control_camera" />
            </div>
        </div>
        <q-btn icon="close" v-bind="btnAttrs" title="close" @click="closeApp()"></q-btn>
    </div>


</template>

<script lang="ts" setup>
import { btnAttrs } from 'src/modules/constants';
import { eapi } from 'src/modules/eapi_m';

const closeApp = async () => await eapi.closeApp()

</script>

<style scoped>
#dragWindow {
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
}
</style>
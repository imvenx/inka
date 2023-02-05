<template>
    <q-btn disabled v-bind="btnAttrs" title="record" @click="AnimM.isRecording = !AnimM.isRecording"
        :style="`color:${AnimM.isRecording ? 'red' : ''}`">⬤</q-btn>

    <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="play [F1]" v-if="!AnimM.isPlayingAnim"> ▶ </q-btn>

    <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="pause [F1]" v-else style="color:red; ">| | </q-btn>

    <q-btn v-bind="btnAttrs" @click="KfsM.createKeyFrames(SvElM.rootSvEl)" title="keyframe"><b>◆</b></q-btn>

</template>

<script lang="ts" setup>
import { AnimM } from 'src/modules/anim_m';
import { KfsM } from 'src/modules/kfs_m';
import { SvElM } from 'src/modules/svel_m';
import { btnAttrs } from 'src/modules/constants'
// const btnAttrs = {
//   size: "12px",
//   padding: "0 sm",
//   'no-caps': '',
// }

</script>

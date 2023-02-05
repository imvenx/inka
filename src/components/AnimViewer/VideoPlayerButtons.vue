<template>

    <q-btn title="auto-refresh inkscape UI on update animation" v-bind="btnAttrs" icon="restore_page"
        :color="`${svgIO.refreshInkscape ? 'green' : 'grey'}`"
        @click="svgIO.refreshInkscape = !svgIO.refreshInkscape"></q-btn>

    <q-btn v-bind="btnAttrs" title="start recording" @click="AnimM.isRecording = !AnimM.isRecording"
        :style="`color:${AnimM.isRecording ? 'red' : ''}`" icon="emergency_recording" v-if="!AnimM.isRecording" />

    <q-btn v-bind="btnAttrs" title="stop recording" @click="AnimM.isRecording = !AnimM.isRecording"
        :style="`color:${AnimM.isRecording ? 'red' : ''}`" icon="fiber_manual_record" v-else color=red />

    <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="play [F1]" v-if="!AnimM.isPlayingAnim"
        icon="play_arrow" />

    <q-btn v-bind="btnAttrs" @click="AnimM.pauseOrPlayAnim()" title="pause [F1]" v-else color="orange" icon="pause" />

    <q-btn v-bind="btnAttrs" @click="KfsM.createKeyFrames(SvElM.rootSvEl)" title="create keyframe"
        icon="gps_fixed"></q-btn>
</template>

<script lang="ts" setup>
import { AnimM } from 'src/modules/anim_m';
import { KfsM } from 'src/modules/kfs_m';
import { SvElM } from 'src/modules/svel_m';
import { btnAttrs } from 'src/modules/constants'
import { svgIO } from 'src/modules/svgIO_m';

// const btnAttrs = {
//   size: "12px",
//   padding: "0 sm",
//   'no-caps': '',
// }

</script>

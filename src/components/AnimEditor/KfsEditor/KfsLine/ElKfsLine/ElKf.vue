<template>
    <g :transform="`translate(${kfPos(kf.offset!)}, 2)`" @mousedown="onMouseDown">
        <g transform="rotate(45)">
            <rect class="elKf" width="10" height="10" />
            <foreignObject width="10" height="10">
                <div class="elKfDiv" :title="JSON.stringify(kf)"></div>
            </foreignObject>
        </g>
    </g>
</template>
<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import { AnimM } from 'src/modules/anim_m';
import { ConfigM } from 'src/modules/config_m';
import { KfsM } from 'src/modules/kfs_m';
import { kfPos } from '../kf_shared';

const props = defineProps<{ svEl: SvEl, kf: Keyframe }>()

// function selectKf() { }
// async function showKfMenu() {
//     // KfsM.showKfMenu = true
// }

async function onMouseDown(e: MouseEvent) {
    if (e.buttons === 1) window.addEventListener('mousemove', await updateKfTimeLoop, { once: true })
    if (e.buttons === 2) await KfsM.deleteKfs(props.svEl, props.kf.offset)
    refreshKfsOnMouseUp()
}

async function refreshKfsOnMouseUp() {
    window.addEventListener('mouseup', async () => await KfsM.refreshAndSaveKfs(props.svEl))
}

// async function updateKfTime(e: MouseEvent) {
//     window.addEventListener('mousemove', await updateKfTimeLoop, { once: true })
// }


async function updateKfTimeLoop(e: MouseEvent) {
    if (e.buttons !== 1) return
    window.addEventListener('mousemove', await updateKfTimeLoop, { once: true })
    await KfsM.updateKf(props.svEl, props.kf.offset!, getPickedTime(e) / AnimM.durationSeconds)
}

const cont = document.getElementById('foreignObjCont') as Element
function getPickedTime(e: MouseEvent): number {
    return (e.clientX - cont.getBoundingClientRect().left + cont.scrollLeft
        - ConfigM.timeSideOffsetPx) / ConfigM.zoomPx / ConfigM.numDecimals
}

</script>

<style scoped>
.elKfDiv {
    height: 10px;
}

.elKfDiv:hover {
    background-color: cyan;
    height: 10px;
    cursor: pointer;
}

.elKf {
    stroke: black;
}

.elKf:hover {
    fill: cyan
}

div:hover {
    color: white
}
</style>
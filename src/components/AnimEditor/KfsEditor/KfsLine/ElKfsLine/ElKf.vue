<template>
    <g :transform="`translate(${kfPos(kf.offset!)}, 2)`" @mousedown="onMouseDownOnKeyframe"
        @dblclick="setKfTimeAsCurrentTime">
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
import { SvElM } from 'src/modules/svel_m';
import { kfPos } from '../kf_shared';

const props = defineProps<{ svEl: SvEl, kf: Keyframe }>()

async function onMouseDownOnKeyframe(e: MouseEvent) {
    if (e.buttons === 1) {
        window.addEventListener('mousemove', await updateKfTimeLoop, { once: true })
        refreshKfsOnMouseUp()
    }
    else if (e.buttons === 2) await KfsM.deleteKfs(props.svEl, props.kf.offset)
}

async function refreshKfsOnMouseUp() {
    window.addEventListener('mouseup', async () => await KfsM.refreshAndSaveKfs(props.svEl),
        { once: true })
}

async function updateKfTimeLoop(e: MouseEvent) {
    if (e.buttons !== 1) return
    window.addEventListener('mousemove', await updateKfTimeLoop, { once: true })
    await KfsM.updateKfOffset(props.svEl, props.kf.offset!, getPickedTime(e) / AnimM.durationSeconds)
}

const cont = document.getElementById('foreignObjCont') as Element
function getPickedTime(e: MouseEvent): number {
    return (e.clientX - cont?.getBoundingClientRect().left + cont.scrollLeft
        - ConfigM.timeSideOffsetPx) / ConfigM.zoomPx / ConfigM.numDecimals
}

function setKfTimeAsCurrentTime() {
    if (props.kf.offset) AnimM.selectTime((props.kf.offset * AnimM.durationSeconds * 1000), SvElM.rootSvEl, true)
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
    stroke: var(--kfStrokeColor);
}

.elKf:hover {
    fill: cyan
}

div:hover {
    color: white
}
</style>
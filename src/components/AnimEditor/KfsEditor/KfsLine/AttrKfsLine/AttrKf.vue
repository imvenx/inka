<template>
    <g :transform="`translate(${kfPos(kf.offset!)}, 2)`" @click.right="deleteKf()">
        <!-- <text style="transform:translate(0, 60%); user-select: none; 
        transform-origin: center;" text-anchor="middle" opacity=".8" font-size=".8em">
            {{ title[1] }}</text> -->
        <g transform="rotate(45)">
            <rect class="attrKf" width="10" height="10" :style="`fill:${props.kf.fill}`" />
            <foreignObject width="10" height="10">
                <!-- <div style="z-index:999; transform:rotate(-45deg); 
                 vertical-align: middle; transform-origin: center;
                font-size: .6em;">
                    {{ title[1] }}
                </div> -->
                <div class="attrKfDiv" :title="JSON.stringify(title)">
                </div>
            </foreignObject>
        </g>
    </g>
</template>
<script lang="ts" setup>
import { KfsM } from 'src/modules/kfs_m';
import { SvElM } from 'src/modules/svel_m';
import { kfPos } from '../kf_shared';

const props = defineProps<{ kf: Keyframe, elId: string }>()

const title = Object.entries(props.kf)[1]

// const kfPos = computed(() =>
//     props.kf.offset! * ConfigM.zoomPx * ConfigM.numDecimals + timeSideOffsetPx)

async function deleteKf() {
    const el = await SvElM.getSvElById(SvElM.rootSvEl, props.elId)
    // console.log(Object.entries(props.kf)[1][0])
    KfsM.deleteKf(el!, props.kf.offset!, Object.entries(props.kf)[1][0])

}

</script>

<style scoped>
.attrKfDiv {
    background-color: transparent;
    height: 10px;
}

.attrKfDiv:hover {
    background-color: cyan;
    height: 10px;
    cursor: pointer;
}

.attrKf {
    stroke: black;
    fill: transparent;
}

.attrKf:hover {
    fill: cyan
}

div:hover {
    color: white;
}
</style>
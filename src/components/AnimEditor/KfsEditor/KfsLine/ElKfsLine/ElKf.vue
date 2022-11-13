<template>
    <g :transform="`translate(${kfPos}, 2)`" @click="deleteKf(el, kf.offset)">
        <g transform="rotate(45)">
            <rect class="elKf" width="10" height="10" />
            <foreignObject width="10" height="10">
                <div class="elKfDiv" :title="kf.offset?.toString()"></div>
            </foreignObject>
        </g>
    </g>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { SvEl } from 'src/models/models';
import { ConfigM, timeSideOffsetPx } from 'src/modules/config_m';
import { deleteKf } from 'src/modules/keyframe_m';

const props = defineProps<{ el: SvEl, kf: Keyframe }>()

const kfPos = computed(() =>
    props.kf.offset! * ConfigM.zoomPx * ConfigM.numDecimals + timeSideOffsetPx)

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
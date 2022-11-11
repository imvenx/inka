<template>
    <g :transform="`translate(${kfPos}, 2)`">
        <g transform="rotate(45)">
            <rect class="attrsKf" width="10" height="10" />
            <foreignObject width="10" height="10">
                <div class="attrsKfDiv" :title="kf.offset?.toString()"></div>
            </foreignObject>
        </g>
    </g>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ConfigM, timeSideOffsetPx } from 'src/modules/config_m';

const props = defineProps<{ kf: Keyframe }>()

const kfPos = computed(() =>
    props.kf.offset! * ConfigM.zoomPx * ConfigM.numDecimals + timeSideOffsetPx)
</script>

<style scoped>
.attrsKfDiv {
    background-color: darkcyan;
    height: 10px;
}

.attrsKfDiv:hover {
    background-color: cyan;
    height: 10px;
    cursor: pointer;
}

.attrsKf {
    stroke: black;
}

.attrsKf:hover {
    fill: cyan
}

div:hover {
    color: white
}
</style>
<template>
    <g :transform="`translate(${kfPos(kf.offset!)}, 2)`">
        <g transform="rotate(45)">
            <rect class="attrsKf" width="10" height="10" />
            <foreignObject width="10" height="10">
                <div class="attrsKfDiv" :title="JSON.stringify(kf)"></div>
            </foreignObject>
        </g>
    </g>
</template>
<script lang="ts" setup>
import { kfPos } from '../kf_shared';

defineProps<{ kf: Keyframe }>()

</script>

<style scoped>
.attrsKfDiv {
    background-color: grey;
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
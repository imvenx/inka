<template>
    <div id="timeLine" :style="`left:${ConfigM.timePickerLinePos}px; top:${ConfigM.editorScroll.y}px`">
    </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
</script>

<style scoped>
#timeLine {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.37);
    position: absolute;
    height: 100%;
    user-select: none;
    pointer-events: none;
}
</style>
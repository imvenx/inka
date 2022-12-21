<template>
    <div id="timeLine" :style="`left:${ConfigM.timePickerLinePos}px; top:${top}px`">
    </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import { onMounted, ref } from 'vue';

const top = ref(0)

onMounted(() => {
    const cont = document.getElementById('foreignObjCont')
    if (!cont) {
        alert('no cont!')
        return
    }
    top.value = cont.scrollTop ?? 0
    cont.addEventListener('scroll', () => {
        top.value = cont.scrollTop
    })
})

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
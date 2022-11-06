<template>
  <div ref="cont" id="kfCont">
    <KfsLine :el="svEl" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import KfsLine from './KfsLine/KfsLine.vue';
import { svEl } from 'src/modules/svel_m';
import { ConfigM } from 'src/modules/config_m';

const cont = ref<HTMLDivElement>()

onMounted(() => { if (cont.value) ConfigM.initEditorScroll(cont.value) })

</script>

<style scoped>
#kfCont {
  overflow: scroll;
  box-shadow: inset 0 0 10px black;
}



/* .kf {
  height: 1rem;
} */
</style>

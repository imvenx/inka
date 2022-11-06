<template>
  <template v-if="svgString">
    <div ref=cont id="cont" v-html="svgString">
    </div>
  </template>
</template>
<script lang="ts" setup>
import { svgString } from 'src/modules/svel_m';
import { onMounted, onUpdated, ref } from 'vue';

const cont = ref<HTMLDivElement>({} as HTMLDivElement)

onUpdated(() => svgMaxSize())
onMounted(() => svgMaxSize())

function svgMaxSize() {
  if (svgString?.value) {
    let svgEl = cont?.value?.children[0] as HTMLElement
    if (!svgEl) return
    svgEl.style.width = '100%'
    svgEl.style.height = '100%'
  }
}

</script>
<style scoped>
#cont {
  border: 1px solid black;
  box-shadow: 0 0 5px black;

  height: 90vh;
}
</style>

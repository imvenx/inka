<template>
  <template v-if="SvElM.svgString">
    <div ref=cont id="cont" v-html="SvElM.svgString">
    </div>
  </template>
</template>
<script lang="ts" setup>
import { SvElM } from 'src/modules/svel_m';
import { onMounted, onUpdated, ref } from 'vue';
const cont = ref<HTMLDivElement>({} as HTMLDivElement)

onUpdated(() => svgMaxSize())
onMounted(() => svgMaxSize())
window.addEventListener('resize', () => svgMaxSize())

const width = ref('auto')
const height = ref('100%')

function svgMaxSize() {
  if (SvElM.svgString) {

    let svgEl = cont?.value?.children[0] as HTMLElement
    if (!svgEl) return

    const contR = cont.value.getBoundingClientRect()
    const svgR = svgEl.getBoundingClientRect()

    const contP = contR.width / contR.height
    const svgP = svgR.width / svgR.height

    if (contP < svgP) {
      svgEl.style.width = '100%'
      svgEl.style.height = 'auto'
    }
    else {
      svgEl.style.width = 'auto'
      svgEl.style.height = '100%'
    }
  }
}

</script>
<style scoped>
#cont {
  overflow: hidden;
  height: 88vh;
  text-align: center;
  padding-top: 1px;
}

#cont :nth-child(1) {
  border: 1px solid black;
}
</style>
<template>
  <template v-if="SvElM.svgString">
    <div ref=cont id="animViewerCont" v-html="SvElM.svgString">
    </div>
  </template>
</template>
<script lang="ts" setup>
import { AnimM, svgEl } from 'src/modules/anim_m';
import { SvElM } from 'src/modules/svel_m';
import { onMounted, onUpdated, ref, watch } from 'vue';
const cont = ref<HTMLDivElement>({} as HTMLDivElement)

const transformBox = AnimM.transformBox
const transformOrigin = AnimM.transformOrigin

onMounted(async () => {
  await svgMaxSize()
  setTimeout(() => AnimM.transformOriginCenterAnimViewer(), 100);
})

onUpdated(async () => {
  await svgMaxSize()
  AnimM.transformOriginRevertAnimViewer()
})

window.addEventListener('resize', async () => await svgMaxSize())

const width = ref('auto')
const height = ref('100%')


async function svgMaxSize() {
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
  const svg = svgEl()
  if (!svg) return
  const _svEl = await SvElM.getSvEls(svg)
  SvElM.rootSvEl = _svEl

}

</script>
<style scoped>
#animViewerCont {
  overflow: hidden;
  height: 88vh;
  text-align: center;
  padding-top: 1px;
}

#animViewerCont :nth-child(1) {
  border: 1px solid black;
}
</style>

<style>
#animViewerCont * {
  transform-box: v-bind(transformBox);
  transform-origin: v-bind(transformOrigin);
  /* transform-box: content-box;
  transform-origin: 0 0; */
}
</style>
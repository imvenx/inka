<template>
  <template v-if="SvElM.svgString">
    <div ref="cont" id="animViewerCont" v-html="SvElM.svgString">
    </div>

    <!-- <Teleport to="#animViewerCont">
    </Teleport> -->

    <Teleport to="#videoPlayerButtons">
      <VideoPlayerButtons />
      <input type="color" style="height:1rem; width:1rem; border:none; padding: 0;" v-model="animViewerBgColor">
    </Teleport>
  </template>
</template>
<script lang="ts" setup>
import { svgEl } from 'src/modules/anim_m';
import { SvElM } from 'src/modules/svel_m';
import { onMounted, onUpdated, ref } from 'vue';
import VideoPlayerButtons from './VideoPlayerButtons.vue';

const cont = ref<HTMLDivElement>({} as HTMLDivElement)
const animViewerBgColor = ref('#8c8c8c')
// const parentHeight = ref('200px')

// const transformBox = AnimM.transformBox
// const transformOrigin = AnimM.transformOrigin

onMounted(async () => {
  await svgMaxSize()
  // setTimeout(() => AnimM.transformOriginCenterAnimViewer(), 100);
})

onUpdated(async () => {
  await svgMaxSize(true)

  // AnimM.transformOriginRevertAnimViewer()
})

window.addEventListener('resize', () => setTimeout(async () => await svgMaxSize(true), 100))

// const width = ref('auto')
// const height = ref('100%')

async function svgMaxSize(isMounted: boolean = false) {
  if (SvElM.svgString) {


    // const cont1 = document.createElement('div')
    // cont1.innerHTML = SvElM.svgString
    // const svgEl = cont1.children[0] as HTMLElement
    // svgEl.style.width = ''
    // svgEl.style.height = ''
    // svgEl.removeAttribute('width')
    // svgEl.removeAttribute('height')
    // console.log(svgEl)

    // cont.value.innerHTML = svgEl.outerHTML

    let svgEl = cont?.value?.children[0] as HTMLElement
    if (!svgEl) return

    // svgEl.setAttribute('width', '')
    // svgEl.setAttribute('height', '')
    // svgEl.style.width = ''
    // svgEl.style.height = ''

    // cont.value.style.height = cont.value.parentElement?.getBoundingClientRect().height + 'px'
    // console.log(cont.value.style.height)

    svgEl.style.width = 'auto'
    svgEl.style.height = 'auto'

    const contRect = cont.value.getBoundingClientRect()
    const svgRect = svgEl.getBoundingClientRect()

    const contRatio = contRect.width / contRect.height
    const svgRatio = svgRect.width / svgRect.height

    if (contRatio < svgRatio) {
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
  text-align: center;
  /* width: fit-content;
  height: auto; */
  /* padding-top: 1px; */
}

#animViewerCont :nth-child(1) {
  background-color: v-bind(animViewerBgColor);
  border: 1px solid black;
  /* box-shadow: 0 0 5px black; */

}
</style>

<style>
#animViewerCont * {
  /* transform-box: v-bind(transformBox);
  transform-origin: v-bind(transformOrigin); */
  transform-box: fill-box;
  transform-origin: center;
}
</style>
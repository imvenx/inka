<template>
  <template v-if="SvElM.svgString">
    <div ref="cont" id="animViewerCont" v-html="SvElM.svgString">
    </div>

    <!-- <Teleport to="#animViewerCont">
    </Teleport> -->

    <Teleport to="#projectMenuCont">
      <ProjectMenu />
    </Teleport>

    <Teleport to="#timeMenuCont">
      <TimerMenu />
    </Teleport>

    <Teleport to="#videoPlayerButtons">
      <div style="text-align:center;">

        <VideoPlayerButtons />

        <q-btn v-bind="btnAttrs">
          <input title="canvas background color" type="color" id="colorPicker" v-model="animViewerBgColor"
            class="field-radio">
        </q-btn>

      </div>
      <!-- <q-btn :style="`background-color:${animViewerBgColor}`" v-bind="btnAttrs">bg</q-btn> -->
      <!-- <q-color name="accent_color" v-model="animViewerBgColor" style="width: 100px; max-width: 100%;" /> -->
    </Teleport>
  </template>
</template>
<script lang="ts" setup>
import { svgEl } from 'src/modules/anim_m';
import { btnAttrs } from 'src/modules/constants';
import { SvElM } from 'src/modules/svel_m';
import { onMounted, onUpdated, ref } from 'vue';
import ProjectMenu from '../ActionButtons/ProjectMenu.vue';
import TimerMenu from '../ActionButtons/TimerMenu.vue';
import VideoPlayerButtons from './VideoPlayerButtons.vue';
import { SvgToVideoOptions } from './SvgToMp4';
import { ExportM } from 'src/modules/export_m'
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


function enterFullscreen(el: HTMLElement) {
  if (!document.fullscreenElement) el.requestFullscreen()
  else if (document.exitFullscreen) document.exitFullscreen();

}

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


    const contRect = cont.value?.getBoundingClientRect()
    const svgRect = svgEl?.getBoundingClientRect()

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

    svgEl.addEventListener('click', () => enterFullscreen(svgEl.parentElement!))

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

#colorPicker {
  height: 1rem;
  width: 1rem;
  vertical-align: middle;
  padding: 0;
  height: 15px;
  width: 15px;
  border: none;
  outline: none;
  /* -webkit-appearance: none; */
}

#colorPicker::-webkit-color-swatch-wrapper {
  padding: 0;
  border: 1px solid grey;
}

#colorPicker::-webkit-color-swatch {
  border: none;
}
</style>
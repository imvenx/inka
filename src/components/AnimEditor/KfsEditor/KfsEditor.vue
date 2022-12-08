<template>
  <div id="wrapper">
    <div id="box_content">
      <svg id="svgCont">
        <foreignObject ref="foreignObjCont" width="100%" height="100%" id="foreignObjCont">
          <div :style="`width:${timePickerWidth}px; padding-bottom: ${timeSideOffsetPx}px`">
            <KfsLine :el="SvElM.rootSvEl" />
          </div>
          <Timeline />
        </foreignObject>
      </svg>
    </div>
    <div id="mask"></div>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import KfsLine from './KfsLine/ElKfsLine/ElKfsLine.vue';
import { ConfigM } from 'src/modules/config_m';
import { KfsM } from 'src/modules/keyframe_m';
import { QMenu } from 'quasar';
import { SvElM } from 'src/modules/svel_m';
import Timeline from './Timeline.vue';

const foreignObjCont = ref<HTMLDivElement>()

// const showing = ref(false)
// const kfsMenu = ref<QMenu>()

const timeSideOffsetPx = ConfigM.timeSideOffsetPx
const timePickerWidth = ConfigM.timePickerWidth

onMounted(() => {
  if (foreignObjCont.value) ConfigM.initEditorScroll(foreignObjCont.value)
  // const elsListCont = document.getElementById('els-list-cont') as HTMLDivElement

  // elsListCont?.addEventListener('click', (e: Event) => updateHeight())
  // updateHeight()
})

// function maybeShowKfMenu(e: MouseEvent) {
//   if (e.buttons === 2) {
//     // kfsMenu.value!.touchPosition = true
//     // kfsMenu.value?.updatePosition()
//     showing.value = true
//     if (!kfsMenu.value) return
//     kfsMenu.value.updatePosition()
//     console.log(kfsMenu.value.touchPosition)
//     // kfsMenu.value?.show()
//   }
//   // console.log('asd')
//   // if (e.buttons === 2) 
//   // KfsM.showKfMenu = true
// }

// const timePickerLinePos = ConfigM.timePickerLinePos

// function updateHeight() {
//   const elsListCont = document.getElementById('els-list-cont')
//   const height = elsListCont?.scrollHeight
//   if (svgCont.value) svgCont.value.style.height = height + 'px'
// }


// const rect = ref<SVGRect>()
// onMounted(() => {
//   rect.value = svgCont.value?.createSVGRect()
//   if (!rect.value) return
//   rect.value.x = 0
//   rect.value.y = 0
//   rect.value.height = 50
//   rect.value.width = 500
//   console.log(svgCont.value?.getEnclosureList(rect.value, null))
// })

// <span v-for="deciSecond in (AnimM.duration * ConfigM.numDecimals)" class="timeStep"
//       :style="`left: ${deciSecond * ConfigM.zoomPx}px`">

// function selectionBox(e: MouseEvent) {
//   if (e.buttons === 1) {

//   }
// }

// type SelectionBox = {
//   isActive: boolean
// }

</script>

<style scoped>
#svgCont {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgb(81, 160, 81);
}

#foreignObjCont {
  overflow: overlay;
}

#wrapper {
  position: relative;
  display: inline-block;
}

#mask {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  box-shadow: 0 0 10px #000000 inset;
}

#box_content {
  height: 100%;
}
</style>

<template>
  <div id="wrapper">
    <div id="box_content">
      <svg id="svgCont">
        <foreignObject ref="foreignObjCont" width="100%" height="100%" id="foreignObjCont">
          <!-- <q-menu ref="kfsMenu" hidden transition-duration="0" style="background-color: rgba(200,200,200,.6);">
            <q-list style="min-width: 100px" dense>
              <q-item clickable v-close-popup>
                <q-item-section>Branches</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Leaves</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Roots</q-item-section>
              </q-item>
            </q-list>
          </q-menu> -->
          <!-- <div class="q-gutter-sm">
            <q-btn color="primary" @click="maybeShowKfMenu" label="Show" />
            <q-btn color="primary" @click="showing = false" label="Hide" />
          </div> -->

          <!-- <q-menu ref="kfsMenu">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>New tab</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New incognito tab</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Recent tabs</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>History</q-item-section>
              </q-item>
            </q-list>
          </q-menu> -->
          <div :style="`width:${timePickerWidth}px; padding-bottom: ${timeSideOffsetPx}px`">
            <KfsLine :el="svEl" />
          </div>
          <div id="timeLine" :style="`left:${timePickerLinePos}px; top:${ConfigM.editorScroll.y}px`">
          </div>

        </foreignObject>
        <!-- <g :transform="`translate(${timePickerLinePos})`"> -->
        <!-- <line :x1="timePickerLinePos" y1="0" :x2="timePickerLinePos" y2="100%" id="timeLine" /> -->
        <!-- </g> -->
        <!-- <rect :x="rect?.x" :y="rect?.y" :height="rect?.height" :width="rect?.width" fill="darkcyan" /> -->

      </svg>
    </div>
    <div id="mask"></div>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import KfsLine from './KfsLine/ElKfsLine/ElKfsLine.vue';
import { svEl } from 'src/modules/svel_m';
import { ConfigM, timeSideOffsetPx, timePickerWidth } from 'src/modules/config_m';
import { KfsM } from 'src/modules/keyframe_m';
import { QMenu } from 'quasar';

const foreignObjCont = ref<HTMLDivElement>()

// const showing = ref(false)
// const kfsMenu = ref<QMenu>()

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

const timePickerLinePos = ConfigM.timePickerLinePos

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

#timeLine {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.37);
  position: absolute;
  height: 100%;
  user-select: none;
  pointer-events: none;
}
</style>

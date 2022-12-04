<template>
  <div ref="cont" id="els-list-cont">
    <ListEl :el="SvElM.rootSvEl" />
  </div>
</template>

<script lang="ts" setup>
import { ConfigM, timeSideOffsetPx } from 'src/modules/config_m';
import { SvElM } from 'src/modules/svel_m';
import { onMounted, ref, watch } from 'vue'
import ListEl from './ListEl.vue';

const cont = ref<HTMLDivElement>()

onMounted(() => {
  setTimeout(() => { cont.value?.scrollTo({ top: ConfigM.editorScroll.y }) }, 100);
  cont.value?.addEventListener("scroll", (e: Event) => {
    ConfigM.editorScroll.y = cont.value?.scrollTop ?? 0
  })
})

watch(() => ConfigM.editorScroll.y, (val) => {
  cont.value?.scrollTo({ top: val })
})

</script>

<style scoped>
#els-list-cont {
  /* border-right: 1px solid black; */
  white-space: nowrap;
  /* overflow: hidden; */
  overflow-x: hidden;
  overflow-y: auto;
  text-overflow: ellipsis;
  font-size: .8rem;
  background-color: rgb(81, 160, 81);
  padding-bottom: v-bind(timeSideOffsetPx + 'px');
}

::-webkit-scrollbar {
  width: 0px;
  /* height: 0px; */
}
</style>

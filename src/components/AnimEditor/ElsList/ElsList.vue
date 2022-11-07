<template>
  <div ref="cont" id="els-list-cont">
    <ListEl :el="svEl" />
  </div>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import { svEl } from 'src/modules/svel_m';
import { onMounted, ref, watch } from 'vue'
import ListEl from './ListEl.vue';

const cont = ref<HTMLDivElement>()

onMounted(() => {
  cont.value?.scrollTo({ top: ConfigM.editorScroll.y })
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
  resize: horizontal;
  /* overflow: hidden; */
  overflow-x: auto;
  overflow-y: auto;
  text-overflow: ellipsis;
  font-size: .8rem;
  background-color: rgb(81, 160, 81);
  padding-bottom: 1rem;
}

::-webkit-scrollbar {
  width: 0px;
}
</style>

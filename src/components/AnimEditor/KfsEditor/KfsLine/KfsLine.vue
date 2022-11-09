<template>
  <text x="64" y="15">◆</text>
  <template v-if="!isAttrContainer">
  </template>


  <!-- <template v-if="!isAttrContainer">
    <div style="display:flex">
      <div v-for="(step, i) in steps" class="kf stepStyle">{{ kf(i) ? '◆' : '-' }}</div>
    </div>
    <template v-if="el?.isUncollapsed">
      <KfsLine :el="el" isAttrContainer />
      <template v-for="child in el?.children">
        <KfsLine :el="child" />
      </template>
    </template>
  </template>
  <template v-else>
    <div style="display:flex">
      <div v-for="(step, i) in steps" class="kf stepStyle">{{ kf(i) ? '❖' : '-' }}</div>
    </div>
    <template v-if="el.showAttrs">
      <template v-for="attr in el.attrs">
        <div style="display:flex">
          <div v-for="(step, i) in steps" class="kf stepStyle" @click="selectAttrKf(i, attr.key)">
            <AttrKf :i="i" :attrKey="attr.key" :el="el" :stepToMs="stepToMs" />
          </div>
        </div>
      </template>
    </template>
  </template> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SvEl } from 'src/models/models';

const props = defineProps<{ el: SvEl, isAttrContainer?: boolean }>()

// const keyframes = (id: any) => (anims??.find(x => x?.id === id)?.effect as KeyframeEffect)?.getKeyframes()
// const kf = (id: string, i: number) =>
//   keyframes(id)?.find(x => svRound(x.offset!) === svRound(i / fps / duration * 1000))

// const kf = (i: number) =>
//   props.el?.kfs?.find(x => x?.offset === stepToMs(i))



// const stepToMs = (i: number) => svRound(i / fps.value / duration.value * 1000)

// const attrKf = (kf: any, key: string) => {
//   try { return kf[key] } catch { console.log('Error trying to convert attr to kf') }
// }

const selectedAttrKf = ref<number[]>([])
function selectAttrKf(i: number, key: string) {
  // console.log(kfVal(i, key))
  selectedAttrKf.value.push(i)
}


</script>

<style scoped>
.kf:hover {
  background-color: aquamarine;
}
</style>

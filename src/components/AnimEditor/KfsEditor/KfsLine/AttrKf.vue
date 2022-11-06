<template>
    <div :title="val">{{ kfStr }}</div>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import { computed } from 'vue';

const props = defineProps<{ i: number, attrKey: string, el: SvEl, stepToMs: Function }>()

const kfVal = (i: number, key: string) => {
    const kfs: any = props.el?.kfs?.find(x => x?.offset === props.stepToMs(i))
    if (kfs) return kfs[key]
}

const val = computed(() => kfVal(props.i, props.attrKey))
const kfStr = computed(() => val.value ? '◇' : '-')

// const deleteKf = () => { console.log(val.value) }

</script>
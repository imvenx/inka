<template>
  <div class="list-el attr-cont" @click="toggleShowAttrs()">
    &nbsp;<span v-for="d in el.depth">&nbsp;</span>
    <span>{{ el.showAttrs ? '▲' : '▼' }}</span>
    <q-icon name="folder" title="attributes" /> attrs
    <q-icon name="add_circle_outline" title="add attribute" />
  </div>

  <template v-if="el.showAttrs">
    <template v-for="attr in  el.attrs">
      <!-- <template v-if="attr.key != ''"> -->
      <div class="list-el attr-child" :title='`[ ${attr.key} ] = [ ${attr.val} ]`'>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-for="d in el.depth">&nbsp;</span>
        <q-icon name="list" />
        {{ attr.key }}
      </div>
      <!-- </template> -->
    </template>
  </template>
</template>

<script lang="ts" setup>
import { SvEl } from 'src/models/models';
import { StorageM } from 'src/modules/storage_m';

const props = defineProps<{ el: SvEl }>()

function toggleShowAttrs() {
  props.el.showAttrs = !props.el.showAttrs
  let showAttrs = StorageM.getShowAttrs()
  if (props.el.showAttrs) showAttrs[props.el.id] = true
  else delete showAttrs[props.el.id]
  StorageM.setShowAttrs(showAttrs)
}
</script>

<style scoped>
.list-el {
  user-select: none;
}

.attr-cont {
  background-color: rgb(150, 150, 50);
}

.attr-child {
  background-color: rgb(180, 180, 130);

}

.list-el:hover {
  box-shadow: inset 0 0 1px 1px black;
}
</style>

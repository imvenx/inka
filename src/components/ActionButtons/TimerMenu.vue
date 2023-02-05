<template>
    <div class="float-right">
        <div class="float-left">
            <!-- <input type="text" placeholder="projectName" value="ProjName" class="timeInput">
          <input type="text" placeholder="animName" value="AnimName" class="timeInput"> -->
            <input min="0.01" step="0.01" title="animation current time" type="number" class="timeInput"
                @change="selectTime()" v-model="AnimM.currentTimeSeconds">
        </div>
        <div class="float-right">
            <template v-if="isDurationModified">
                <q-btn v-bind="btnAttrs" icon="task_alt" title="apply duration change" @click="applyModifyDuration()" />
                <q-btn v-bind="btnAttrs" icon="cancel" title="cancel duration change"
                    @click="isDurationModified = false" />
            </template>
            <input ref="durationInput" min="0.1" step="0.1" title="animation duration" type="number" class="timeInput"
                :value="AnimM.durationSeconds" @input="modifyDuration">
            <q-btn v-bind="btnAttrs" icon="settings" title="time settings">
                <q-menu dark>
                    <q-list dense tag="label">
                        <q-item tag="label" clickable v-ripple
                            title="enable this to prevent slow down or speed up your animation when changing the duration">
                            <q-item-section>
                                <q-item-label>Recalculate kfs time on change duration</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <input id="recalculate" type="checkbox"
                                    v-model="AnimM.recalculateKfsOnChangeDuration" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </div>
    </div>
</template>

<script lang="ts" setup>import { AnimM } from 'src/modules/anim_m';
import { SvElM } from 'src/modules/svel_m';
import { btnAttrs } from 'src/modules/constants';
import { ref } from 'vue';

function selectTime() { AnimM.selectTime(AnimM.currentTimeMiliseconds, SvElM.rootSvEl) }

const isDurationModified = ref(false)
function modifyDuration(e: any) {
    isDurationModified.value = e.target.value != AnimM.durationSeconds
}
const durationInput = ref<HTMLInputElement>()
function applyModifyDuration() {
    if (confirm('are you sure you want to change the duration? this could affect keyframes time')) {
        AnimM.durationSeconds = durationInput.value!.value as any ?? AnimM.durationSeconds
    }
    isDurationModified.value = false
}

</script>

<style scoped>
.timeInput {
    width: 4rem;
    height: 1.2rem;
    background-color: var(--bgColor1);
    color: var(--fontColor1);
}
</style>
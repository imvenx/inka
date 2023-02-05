<template>
    <q-btn v-bind="btnAttrs" icon="article" title="project">
        <q-menu dark>
            <q-list dense tag="label">
                <q-item tag="label" clickable v-ripple>
                    <q-item-section>
                        <q-item-label>project name</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <input id="recalculate" type="text" v-model="ConfigM.projectName" />
                    </q-item-section>
                </q-item>
                <q-item tag="label" clickable v-ripple>
                    <q-item-section>
                        <q-item-label>file path</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        {{ StorageM.getCurrentFilePath() }}
                    </q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script lang="ts" setup>
import { ConfigM } from 'src/modules/config_m';
import { StorageM } from 'src/modules/storage_m';
import { btnAttrs } from 'src/modules/constants';

</script>
<template>
    <q-btn v-bind="btnAttrs">
        How to...
        <q-menu dark>
            <q-list dense>
                <q-item style="color:orange">This will link you to web resources (unfinished)</q-item>
                <q-item clickable v-close-popup disabled>rotation animation</q-item>
                <q-item clickable v-close-popup disabled>translation animation</q-item>
                <q-item clickable v-close-popup disabled>path animation</q-item>
                <q-item clickable v-close-popup disabled>configure inkscape</q-item>
                <q-item clickable v-close-popup disabled>Contact us on discord</q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script lang="ts" setup>
import { btnAttrs } from 'src/modules/constants';
</script>
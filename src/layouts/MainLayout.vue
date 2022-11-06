<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated style="height: 1.4rem; background-color: black; ">
      <div>
        &nbsp;
        <ActionButtons />
      </div>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ActionButtons from 'src/components/ActionButtons.vue';
</script>

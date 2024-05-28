<script setup>
import {defineProps} from "vue";

let props = defineProps(['isLoading']);
</script>

<template>
  <div :class="{ loader: true, fadeout: props['isLoading'] }">
    Загрузка...
  </div>
</template>

<style scoped>
.loader {
  background-color: #4564d5;
  bottom: 0;
  color: white;
  display: block;
  font-size: 32px;
  left: 0;
  overflow: hidden;
  padding-top: 10vh;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
}

.fadeout {
  animation: fadeout 2s forwards;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
<script setup>
import {onMounted} from "vue";

onMounted(()=>{
  const getFunctionalBlocks = () => {
    // eslint-disable-next-line no-unused-vars
    let responseComponents = fetch("https://localhost:44389/api/Schema/GetComponentsForFunctionalBlocks", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(props['projectId']),
    }).then(async response => {
      const data = await response.json();

    }).catch(error => {
      console.log( error);
    });
  }
})

</script>

<template>
<h1>привет</h1>
</template>

<style scoped>

</style>
<script setup>
import {defineEmits, defineProps, onMounted, ref, watch} from "vue";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {CFormInput} from "@coreui/vue/dist/esm/components/form";

onMounted(()=>{
  getComponents();
})
const props = defineProps(['projectId', 'refreshComponents']);

const emit = defineEmits(['afterLoad', 'loadSolution']);

let components = ref();
watch(props, () =>{
  getComponents();
})
const getComponents = () => {
  // eslint-disable-next-line no-unused-vars
  let responseComponents = fetch("https://localhost:44389/api/Schema/GetComponents", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();
    components.value = data;
    emit("afterLoad");
    console.log(data);
  }).catch(error => {
    console.log( error);
  });
}

const updateSize = function(item){
  if (!confirm("Обновить размеры элемента?")){
    return;
  }
  // eslint-disable-next-line no-unused-vars
  let responseComponents = fetch("https://localhost:44389/api/Schema/UpdateComponent", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(item),
  }).then(async response => {
    const data = await response.json();
    console.log(data);
    emit("loadSolution")
    alert("Размеры изменены!");
  }).catch(error => {
    console.log( error);
  });
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-3 border">
      Обозначение
    </div>
    <div class="col-3 border">
      Длина
    </div>
    <div class="col-3 border">
      Ширина
    </div>
    <div class="col-2 border">
      Действие
    </div>
  </div>
  <div class="row justify-content-center" v-for="item in components" :key = "item.id">
    <div class="col-3 border">
      {{item.designator}}
    </div>
    <div class="col-3 border">
      <CFormInput class="me-2" placeholder="Длина" type="number" v-model.number="item.height"/>
    </div>
    <div class="col-3 border">
      <CFormInput class="me-2" placeholder="Ширина" type="number" v-model.number="item.width" onkeypress='return event.charCode >= 48 && event.charCode <= 57'/>
    </div>
    <div class="col-2 border">
      <CButton color="secondary" size="sm" @click="updateSize(item)">
        Изменить размер
      </CButton>
    </div>
  </div>
</template>

<style scoped>

</style>
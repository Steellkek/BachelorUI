<script setup>
import {CButton} from "@coreui/vue/dist/esm/components/button";
import { defineEmits, defineProps, onMounted, ref, watch} from "vue";
import axios from "axios";

const props = defineProps(['projectId', 'isRefreshEms']);
const emit = defineEmits(['afterLoad', 'afterChange']);


let functionalBlocks = ref([])
let ems = ref([])

// eslint-disable-next-line no-unused-vars
let f = function (id) {
  return ems.value.filter( x=> x.functionalBlock1Id === id || x.functionalBlock1Id === id).map(function(e){return e.id})
}
watch(props, () =>{
  if (props["isRefreshEms"] === false) {
    return
  }
  getData();
})

onMounted(() =>{
  getData();
})

function getData() {
  // eslint-disable-next-line no-unused-vars
  let responseFunctionalBlocks = fetch(process.env.VUE_APP_API+"/api/Schema/GetFunctionalBlocks", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();
    functionalBlocks.value = data;
    console.log(data);
  }).catch(error => {
    console.log( error);
    return
  });

  // eslint-disable-next-line no-unused-vars
  let responseEms = fetch(process.env.VUE_APP_API+"/api/Ems/GetEmsList", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();
    ems.value = data;
    console.log(data);
    console.log(5);
  }).catch(error => {
    console.log( error);
    return
  });
  emit("afterLoad");
}
let firstBlock = ref(null );
let secondBlock = ref(null);

const createEms = function (){
  let formData = new FormData();
  formData.append("functionalBlockId1", firstBlock.value);
  formData.append("functionalBlockId2", secondBlock.value);
  formData.append("valueEms", inputValue.value);
  formData.append("projectId", props['projectId']);
  axios.post(process.env.VUE_APP_API+"/api/Ems/CreateEms", formData,
      {
        headers: {
          "Content-Type": "Multipart / Form-Data"
        }
      }).then(response => {
        ems.value.push(response.data);
        firstBlock.value = null;
        secondBlock.value = null;
        inputValue.value = null;
        emit('afterChange');
      console.log(response)
  }).catch(error => {
    console.log(error);
  });
}

const deleteEms = function (id){
  let formData = new FormData();
  formData.append("emsId", id);
  
  // eslint-disable-next-line no-unused-vars
  let responseEms = fetch(process.env.VUE_APP_API+"/api/Ems/DeleteEmsById", {
    method: 'delete',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(id),
  }).then(async response => {
    const data = await response.json();
    functionalBlocks.value.push(ems.value.filter(x => x.id === id)[0].functionalBlock1);
    functionalBlocks.value.push(ems.value.filter(x => x.id === id)[0].functionalBlock2);
    ems.value = ems.value.filter(x=>x.id !== id);
    emit('afterChange');
    console.log(data);
  }).catch(error => {
    console.log( error);
  });
}

let inputValue = ref(null)
</script>

<template>
  <div class="container" v-if="functionalBlocks.length > 0 || ems.length > 0">
    <div class="row justify-content-center">
      <div class="col-3 border">
        Функциональный узел 1
      </div>
      <div class="col-3 border">
        Функциональный узел 2
      </div>
      <div class="col-3 border">
        Значение
      </div>
      <div class="col-1 border">
        Действие
      </div>
    </div>
    <div class="row justify-content-md-center"  v-if="functionalBlocks.length > 0">
      <div class="col-3 border">
        <v-select
            :options="functionalBlocks.filter(g => g.id !== secondBlock)"
            :reduce="functionalBlock => functionalBlock.id"
            label="name"
            v-model="firstBlock"></v-select >
      </div>
      <div class="col-3 border">
        <v-select
            :options="functionalBlocks.filter(g => g.id !== firstBlock)"
            :reduce="functionalBlock => functionalBlock.id"
            label="name"
            v-model="secondBlock"></v-select >
      </div>
      <div class="col-3 border">
        <v-select
            :options="[1,2,3,4,5]"
            label="name"
            v-model="inputValue"></v-select >
      </div>
      <div class="col-1 border">
        <CButton 
            color="secondary" 
            size="sm" 
            @click="createEms" 
            :disabled = "firstBlock == null || secondBlock == null || inputValue ==null"
        >
          Добавить
        </CButton>
      </div>
    </div>
    <div class="row justify-content-center" v-for="item in ems" :key = "item.id">
      <div class="col-3 border">
        {{item.functionalBlock1.name}}
      </div>
      <div class="col-3 border">
        {{item.functionalBlock2.name}}
      </div>
      <div class="col-3 border">
        {{item.value}}
      </div>
      <div class="col-1 border">
        <CButton color="secondary" size="sm" @click="deleteEms(item.id)">
          Удалить
        </CButton>
      </div>
    </div>
  </div>
  <h6 v-if="functionalBlocks.length === 0 && ems.length === 0 ">Создайте функциональные узлы во вкладке "Функциональные блоки"</h6>
</template>

<style scoped>

</style>
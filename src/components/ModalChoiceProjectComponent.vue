<script setup>

import {CModal, CModalBody, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";
import {defineProps, ref, watch, defineEmits} from "vue";
import Vue3EasyDataTable from 'vue3-easy-data-table';

let props = defineProps(['visibleStaticBackdropChoice']);
let emit = defineEmits(['closeModal', 'choiceProject']);

let visibleStaticBackdropChoice = ref(props["visibleStaticBackdropChoice"]);
const headers = [
  { text: "Название проекта", value: "nameProject" },
  { text: "Дата создания", value: "createdOn"},
];

const items = ref([]);
watch(()=>
{
  visibleStaticBackdropChoice.value = props["visibleStaticBackdropChoice"];
  if (visibleStaticBackdropChoice.value === true)
  {
    // eslint-disable-next-line no-unused-vars
    let response = fetch("https://localhost:44389/api/Project/GetListProject", {
      method: 'get',
    }).then(async response => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        console.log(error)
      }
      for (let i = 0; i < data.length; i++) { 
        data[i].createdOn = new Date(data[i].createdOn).toLocaleString('ru', { timeZoneName: 'short' });
        var n = data[i].createdOn.indexOf("GMT")
        data[i].createdOn = data[i].createdOn.replace(data[i].createdOn.substring(n,n+8)," ")
      }
      items.value = data;
    }).catch(error => {
      console.log( error);
    });
  }
})


const showRow = (item) => {
  if (!confirm("Прошлый проект будет закрыт, вы согласны?")){
    return;
  }
  emit("choiceProject", item);
  closeModal()
};

const closeModal = function (){
  emit("closeModal");
}

</script>

<template>
  <CModal
      backdrop="static"
      :visible="visibleStaticBackdropChoice"
      @close="closeModal"
      aria-labelledby="StaticBackdropExampleLabel1"
  >    
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel1">Выбрать проект</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h6 align="center">Выберите проект, нажав на нужную строку в таблице ниже</h6>
      <Vue3EasyDataTable
          show-index
          :headers="headers"
          :items="items"
          alternating
          @click-row="showRow"
      />
    </CModalBody>
  </CModal>
</template>

<style scoped>

</style>
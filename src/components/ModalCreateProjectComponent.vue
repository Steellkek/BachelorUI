<script setup>

import {CForm, CFormInput} from "@coreui/vue/dist/esm/components/form";
import {CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {defineProps, ref, watch, defineEmits} from "vue";

let props = defineProps(['visibleStaticBackdropCreate']);
let emit = defineEmits(['closeModal', 'choiceProject']);

let visibleStaticBackdropCreate = ref(props["visibleStaticBackdropCreate"]);
let input = ref(null)

const createProject = async function(){
  if ((input.value == null || input.value == "" || input.value == undefined )){
    alert("Введите название проекта!");
    return;
  }
  if (!confirm("Прошлый проект будет закрыт, вы согласны?")){
    return;
  }
  let response = await fetch("https://localhost:44389/api/Project/CreateProject", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input.value)
  });
  if (!response.ok){
    alert("Ошибка!");
  }
  // eslint-disable-next-line no-unused-vars
  const resp = await response.json();
  emit("choiceProject", resp);
  closeModal();
}
const closeModal = function (){  
  input.value = null;
  emit("closeModal");
}
watch(()=>
{
  visibleStaticBackdropCreate.value = props["visibleStaticBackdropCreate"];
})

</script>

<template>
  <CModal
      backdrop="static"
      :visible="visibleStaticBackdropCreate"
      @close="closeModal"
      aria-labelledby="StaticBackdropExampleLabel"
  >
    
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">Создать новый проект</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h2>Введите название проекта!</h2>
    </CModalBody>
    <CForm class="d-flex">
      <CFormInput v-model = "input" class="me-2" placeholder="Название проекта"/>
    </CForm>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Закрыть
      </CButton>
      <CButton color="primary" v-on:click="createProject">Сохранить</CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped>

</style>
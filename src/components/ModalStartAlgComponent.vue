<script setup>

import {CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";
import {defineEmits, defineProps, ref, watch} from "vue";
import {CForm, CFormInput} from "@coreui/vue/dist/esm/components/form";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import LoadingComponent from "@/components/LoadingComponent.vue";

let props = defineProps(['visibleStaticBackdropStart', 'projectId']);
let emit = defineEmits(['closeModal'],['loadSolution']);

let visibleStaticBackdropStart = ref(props["visibleStaticBackdropStart"]);

let countPopulation = ref(10);
let countIndivid = ref(10);
let rateMutation = ref(0.1);
let rateCrossingover = ref(0.9);
let rateIntermodule = ref(0.5);
let rateEms = ref(0.5);
let load = ref(true);
const closeModal = function (){
  emit("closeModal");
}

watch(()=>
{
  visibleStaticBackdropStart.value = props["visibleStaticBackdropStart"];
})

const startAlg = function (){
  if (countPopulation.value === null || countPopulation.value <= 0){
    alert("Введите количество популяций!");
    return;
  }
  if (countIndivid.value === null || countIndivid.value <= 0){
    alert("Введите количество особей!");
    return;
  }
  if (rateMutation.value === null || rateMutation.value <= 0 || rateMutation.value > 1){
    alert("Введите шанс мутации от 0 до 1");
    return;
  }
  if (rateCrossingover.value === null || rateCrossingover.value <= 0 || rateCrossingover.value > 1){
    alert("Введите шанс кроссинговера от 0 до 1");
    return;
  }
  if (rateEms.value === null || rateEms.value <= 0 || rateEms.value > 1){
    alert("Введите КФ для критерия ЭМС от 0 до 1");
    return;
  }
  if (rateIntermodule.value === null || rateIntermodule.value <= 0 || rateIntermodule.value > 1){
    alert("Введите КФ для критерия межмодульных связей от 0 до 1");
    return;
  }
  let y = (rateIntermodule.value + rateEms.value);
  if (y !== 1){
    alert("КФ для критерия ЭМС и КФ для критерия межмодульных связей должно == 1");
    return;
  }
  var x = {
    countPopulation: countPopulation.value, 
    countIndivid: countIndivid.value, 
    rateMutation: rateMutation.value,
    rateCrossingover: rateCrossingover.value,
    rateIntermodule: rateIntermodule.value,
    rateEms: rateEms.value,
    projectId: props["projectId"]
  }
  load.value = false;
  fetch("https://localhost:44389/api/Solution/StartAlg", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(x),
  }).then(async response => {
    const data = await response.json();
    load.value = true;
    console.log(data);
    emit("loadSolution");
    closeModal()
  }).catch(error => {
    alert(error);
  });
}
</script>

<template>
  <CModal
      backdrop="static"
      :visible="visibleStaticBackdropStart"
      @close="closeModal"
      aria-labelledby="StaticBackdropExampleLabel"
  >
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">Параметры генетического алгоритма</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h6>Введите параметры для алгоритма!</h6>
      <CForm>
        <h6>Количество популяций</h6>
        <CFormInput class="me-2" placeholder="Количество популяций" type="number" v-model.number="countPopulation" onkeypress='return event.charCode >= 48 && event.charCode <= 57'/>
        <h6>Количество особей в популяции</h6>
        <CFormInput class="me-2" placeholder="Количество особей в популяции" type="number" v-model.number="countIndivid" onkeypress='return event.charCode >= 48 && event.charCode <= 57'/>
        <h6>Шанс кроссинговера</h6>
        <CFormInput class="me-2" placeholder="Шанс кроссинговера" type="number" v-model.number="rateCrossingover"/>
        <h6>Шанс мутации</h6>
        <CFormInput class="me-2" placeholder="Шанс мутации" type="number" v-model.number="rateMutation"/>
        <h6>% для критерия минимизации количества соединений</h6>
        <CFormInput class="me-2" placeholder="% для критерия минимизации количества соединений" type="number" v-model.number="rateIntermodule"/>
        <h6>% для критерия ЭМ</h6>
        <CFormInput class="me-2" placeholder="% для критерия ЭМС" type="number" v-model.number="rateEms"/>
        <LoadingComponent :is-loading="load"></LoadingComponent>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Закрыть
      </CButton>
      <CButton color="primary" @click="startAlg">Запуск</CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped>

</style>
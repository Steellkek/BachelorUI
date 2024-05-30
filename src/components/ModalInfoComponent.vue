<script setup>

import {CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {defineProps, ref, watch, defineEmits} from "vue";

let props = defineProps(['visibleInfo']);
let emit = defineEmits(['closeModal']);

let visibleInfo = ref(props["visibleInfo"]);

const closeModal = function (){ 
  emit("closeModal");
}
watch(()=>
{
  visibleInfo.value = props["visibleInfo"];
})

</script>

<template>
  <CModal
      backdrop="static"
      :visible="visibleInfo"
      @close="closeModal"
      aria-labelledby="StaticBackdropExampleLabel"
  >    
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">Инфо</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h3 align="center">Дипломная работа</h3>
      <h5 align="justify">Выполнена студентом группы 4414</h5>
      <p>Миникаев А.А.</p>
      <h5 align="justify">Научный руководитель</h5>
      <p>Суздальцев И.В.</p>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Закрыть
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped>

</style>
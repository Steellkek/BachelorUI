<script setup>

import {CForm} from "@coreui/vue/dist/esm/components/form";
import {CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {defineProps, ref, watch, defineEmits} from "vue";
import axios from "axios";

let props = defineProps(['visibleStaticBackdropUpload','projectId']);
let emit = defineEmits(['closeModal', 'choiceProject','afterUpload']);

let visibleStaticBackdropUpload = ref(props["visibleStaticBackdropUpload"]);
let input = ref(null)
let isUploading = ref(false);
let files = ref(new FormData());
let fileInput = ref(null);

const fileChange = function(fileList) {
  if (fileList.length === 0) { 
    return;
  }
  let allowedExtensions =
      /(\.DDC)$/i;
  if (!allowedExtensions.exec(fileList[0].name)){
    fileInput.value = null
    files.value = new FormData();
    isUploading.value = false;
    alert("Выберите файл с раширением .DDC")
    return;
  }
  files.value.append("file", fileList[0], fileList[0].name);
  files.value.append("projectId", props['projectId'])
  isUploading.value = true;
}
const upload = async function() {
  // eslint-disable-next-line no-unused-vars
  await axios.post("https://localhost:44389/api/Project/UploadProject", files.value,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
    console.log(response);
  }).catch(error => {
    console.log(error);
  });
  files.value = new FormData();
  fileInput.value = null
  isUploading.value = false;
  emit("closeModal");
  emit('afterUpload');
};

const closeModal = function (){  
  input.value = null;
  emit("closeModal");
}
watch(()=>
{
  visibleStaticBackdropUpload.value = props["visibleStaticBackdropUpload"];
})

</script>

<template>
  <CModal
      backdrop="static"
      :visible="visibleStaticBackdropUpload"
      @close="closeModal"
      aria-labelledby="StaticBackdropExampleLabel"
  >
    
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">Создать новый проект</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h1>Введите название проекта!</h1>
    </CModalBody>
    <CForm class="d-flex" enctype="multipart/form-data">
        <input type="file" ref="fileInput" name="file" multiple="" v-on:change="fileChange($event.target.files)"/>
    </CForm>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Закрыть
      </CButton>
      <CButton type="button" v-if="isUploading" @click="upload()">Upload</CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped>

</style>
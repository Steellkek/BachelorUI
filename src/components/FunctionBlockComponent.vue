<script setup>
import {defineEmits, defineProps, onMounted, ref, watch} from "vue";
import {CListGroup, CListGroupItem} from "@coreui/vue/dist/esm/components/list-group";
import { CFormCheck, CFormInput} from "@coreui/vue/dist/esm/components/form";
import {CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem} from "@coreui/vue/dist/esm/components/accordion";
import axios from "axios";
import {CButton} from "@coreui/vue/dist/esm/components/button";

// eslint-disable-next-line no-unused-vars
const props = defineProps(['projectId', 'refreshFunctional']);
const emit = defineEmits(['afterLoad', 'refreshEms', 'allComponentsInFunctionalBlocks']);

let checkComponents = ref([])
let startComponents = ref([]);

let functionalBlocks = ref([]);

let nameFunctionalBlock = ref(null);

onMounted(()=>{
  getFunctionalBlocks();
})
watch(props, () =>{
  if (props["refreshFunctional"] === false) {
    return
  }
  getFunctionalBlocks();
})
const getFunctionalBlocks = () => {
  // eslint-disable-next-line no-unused-vars
  let responseComponents = fetch(process.env.VUE_APP_API+"/api/Schema/GetComponentsForFunctionalBlocks", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();
    startComponents.value = data;
    console.log(data);
    allComponentsInFunctionalBlocks()
  }).catch(error => {
    console.log( error);
  });
  // eslint-disable-next-line no-unused-vars
  let responseFunctionalBlocks = fetch(process.env.VUE_APP_API+"/api/Schema/GetFunctionalBlocks", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();
    functionalBlocks.value = data;
    console.log(data);
    emit("afterLoad");
    allComponentsInFunctionalBlocks()
  }).catch(error => {
    console.log( error);
  });
}
const createFunctionalBlock = function () {
  var components = startComponents.value.filter(item => checkComponents.value.includes(item.id) );
  let formData = new FormData();
  for (const a of components.map(function(item){return item.id})) {
    formData.append("componentIds[]", a);
  }
  formData.append("nameFunctionalBlock", nameFunctionalBlock.value);
  formData.append("projectId", props['projectId']);
  axios.post(process.env.VUE_APP_API+"/api/Schema/CreateFunctionalBlock", formData,
      {
        headers: {
          "Content-Type": "Multipart / Form-Data"
        }
      }).then(response => {    
    functionalBlocks.value.push(response.data)
    startComponents.value = startComponents.value.filter(item => !checkComponents.value.includes(item.id));
    checkComponents.value = [];
    nameFunctionalBlock.value = "";
    emit("refreshEms");
    allComponentsInFunctionalBlocks()
  }).catch(error => {
    console.log(error);
  });
  
  /*console.log(components);
  components.forEach(item => { functionalBlocks.value.push(item); startComponents.value.pop(item)});*/
}

const deleteFunctionalBlock = function (functionalBlockId) {
  // eslint-disable-next-line no-unused-vars
  let responseFunctionalBlocks = fetch(process.env.VUE_APP_API+"/api/Schema/DeleteFunctionalBlock", {
    method: 'delete',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(functionalBlockId),
    // eslint-disable-next-line no-unused-vars
  }).then(async response => {
    let functionalBlock = functionalBlocks.value.filter(item => item.id === functionalBlockId );
    console.log(functionalBlock[0]);
    functionalBlock[0].componentsPcb.forEach((x) => startComponents.value.push(x))
    functionalBlocks.value = functionalBlocks.value.filter(item => item.id !== functionalBlockId )
    emit("refreshEms");
    allComponentsInFunctionalBlocks()
  }).catch(error => {
    console.log( error);
  });
}

const allComponentsInFunctionalBlocks = function () {
  let x = startComponents.value.length === 0 && functionalBlocks.value.length > 1;
  emit('allComponentsInFunctionalBlocks',x)
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <CListGroup v-for="item in startComponents" :key = "item.id">
          <CListGroupItem><CFormCheck :value="item.id" v-model="checkComponents" :label="item.designator"/></CListGroupItem>
        </CListGroup>
        <CFormInput 
            type="text" 
            v-if="checkComponents.length !== 0" 
            placeholder="Название функционального узла"  
            v-model="nameFunctionalBlock"></CFormInput>
        <CButton @click="createFunctionalBlock" color="secondary" :disabled="checkComponents.length === 0">
          Создать функциональный узел
        </CButton>
      </div>
      <div class="col">
        <CAccordion  v-for="item in functionalBlocks" :key = "item.id" >
          <CAccordionItem :item-key="item.id">
            <CAccordionHeader>
              {{item.name}}
            </CAccordionHeader>
            <CAccordionBody>
              <CButton color="secondary" @click="deleteFunctionalBlock(item.id)">Удалить функциональный узел</CButton>
              <CListGroup v-for="itemComponent in item.componentsPcb" :key = "itemComponent.id">
                <CListGroupItem>{{itemComponent.designator}}</CListGroupItem>
              </CListGroup>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
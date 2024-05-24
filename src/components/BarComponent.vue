<template>
  <h6>Проект:{{NameProject}}</h6>
  <CDropdown>
    <CDropdownToggle color="primary">Меню</CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem href="#" @click="() => { visibleStaticBackdropCreate  = true }" variant="outline">Создать новый проект</CDropdownItem  >
      <CDropdownItem href="#" @click="() => { visibleStaticBackdropChoice  = true }" variant="outline">Открыть проект из БД</CDropdownItem >
      <CDropdownItem href="#" @click="() => { visibleStaticBackdropUpload  = true }" variant="outline" :disabled= "projectId=== 0">Загрузить файл</CDropdownItem >
    </CDropdownMenu>
  </CDropdown>
  <CButton @click="openStartAlg">
    Запуск
  </CButton>
  <CButton @click="downloadSolution">
    Скачать решение
  </CButton>
  <CNav variant="tabs" role="tablist">
    <CNavItem>
      <CNavLink
          href="javascript:void(0);"
          :active="tabPaneActiveKey === 1"
          @click="() => {tabPaneActiveKey = 1}"
      >
        Схема
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink
          href="javascript:void(0);"
          :active="tabPaneActiveKey === 2"
          @click="() => {tabPaneActiveKey = 2}"
      >
        Плата
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink
          href="javascript:void(0);"
          :active="tabPaneActiveKey === 3"
          @click="() => {tabPaneActiveKey = 3}"
      >
        Результат
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink
          href="javascript:void(0);"
          :active="tabPaneActiveKey === 4"
          @click="() => {tabPaneActiveKey = 4}"
      >
        Функциональные блоки
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink
          href="javascript:void(0);"
          :active="tabPaneActiveKey === 5"
          @click="() => {tabPaneActiveKey = 5}"
      >
        ЭМС
      </CNavLink>
    </CNavItem>
  </CNav>
  <CTabContent v-if="projectId!==0">
    <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
      Окно со схемой
      <ScemaWindowComponent :refreshSchema = "refreshSchema" :projectId = "projectId" @afterLoad = "afterLoad"></ScemaWindowComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
      Окно с платой
      <PcbWindowComponent   :refreshPcb = "refreshPcb" :project-id = "projectId" @afterLoad = "afterLoad"></PcbWindowComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
      Окно с результатом
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 4">
      Окно с функциональными блоками
      <FunctionBlockComponent 
          :projectId = "projectId" 
          :refreshFunctional = "refreshFunctional" 
          @afterLoad = "afterLoad" 
          @refreshEms = "refreshEms" 
          @allComponentsInFunctionalBlocks = "allComponentsInFunctionalBlocks"
      >        
      </FunctionBlockComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 5">
      Окно с ЭМС
      <EmsComponent :projectId = "projectId" :isRefreshEms = "isRefreshEms" @afterLoad = "afterLoad"></EmsComponent>
    </CTabPane>
  </CTabContent>
  <ModalCreateProjectComponent 
      :visibleStaticBackdropCreate = "visibleStaticBackdropCreate"
      @closeModal = "closeModal"
      @choiceProject = "choiceProject"
  ></ModalCreateProjectComponent>
  <ModalChoiceProjectComponent
      :visibleStaticBackdropChoice = "visibleStaticBackdropChoice"
      @closeModal = "closeModal"
      @choiceProject = "choiceProject"
  ></ModalChoiceProjectComponent>
  <ModalUploadProjectComponent
      :visibleStaticBackdropUpload = "visibleStaticBackdropUpload"
      :projectId = "projectId"
      @closeModal = "closeModal"
      @afterUpload = "afterUpload"
  ></ModalUploadProjectComponent>
  <ModalStartAlgComponent
      :visibleStaticBackdropStart = "visibleStaticBackdropStart"
      :projectId = "projectId"
      @closeModal = "closeModal"
  ></ModalStartAlgComponent>
</template>

<script setup>
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/vue/dist/esm/components/dropdown";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {ref} from "vue";
import {CTabContent, CTabPane} from "@coreui/vue/dist/esm/components/tabs";
import {CNav, CNavItem, CNavLink} from "@coreui/vue/dist/esm/components/nav";
import ScemaWindowComponent from "@/components/ScemaWindowComponent.vue";
import ModalCreateProjectComponent from "@/components/ModalCreateProjectComponent.vue";
import ModalChoiceProjectComponent from "@/components/ModalChoiceProjectComponent.vue";
import ModalUploadProjectComponent from "@/components/ModalUploadProjectComponent.vue";
import FunctionBlockComponent from "@/components/FunctionBlockComponent.vue";
import EmsComponent from "@/components/EmsComponent.vue";
import ModalStartAlgComponent from "@/components/ModalStartAlgComponent.vue";
import PcbWindowComponent from "@/components/PcbWindowComponent.vue";
let tabPaneActiveKey = ref(1)
let visibleStaticBackdropCreate = ref(false);
let visibleStaticBackdropChoice = ref(false);
let visibleStaticBackdropUpload = ref(false);
let visibleStaticBackdropStart = ref(false);
let refreshSchema = ref(false);
let refreshFunctional = ref(false);
let isRefreshEms = ref(false);
let refreshPcb = ref(false);
let isAllComponentsInFunctionalBlocks = ref(false);
let NameProject = ref("");

let projectId = ref(0);

const choiceProject = function (project){
  projectId.value = project.id;
  NameProject.value = project.nameProject;
  afterUpload();
}
const afterLoad = function (){
  refreshSchema.value = false;
  refreshFunctional.value = false;
  isRefreshEms.value = false;
  refreshPcb.value = true;
}
const afterUpload = function (){
  refreshSchema.value = true;
  refreshFunctional.value = true;
  refreshEms();
  refreshPcb.value = true;
}
const refreshEms = function (){
  isRefreshEms.value = true;
}
const closeModal = function () {
  visibleStaticBackdropCreate.value = false;
  visibleStaticBackdropChoice.value = false;
  visibleStaticBackdropUpload.value = false;
  visibleStaticBackdropStart.value = false;
}

const allComponentsInFunctionalBlocks = function (x){
  isAllComponentsInFunctionalBlocks.value = x;
}

const openStartAlg = function (){
  if (!isAllComponentsInFunctionalBlocks.value){
    alert("Разместите все элементы по функциональным узлам. Должно быть минимум 2 узла.")
    return
  }
  visibleStaticBackdropStart.value = true;
}

const downloadSolution = function (){
  window.open("https://localhost:44389/api/Solution/download/"+projectId.value);
  // eslint-disable-next-line no-unused-vars
/*  let responseComponents = fetch("https://localhost:44389/api/Solution/download", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(projectId.value),
  }).then(async response => {
    const data = await response.json();
    console.log(data);
  }).catch(error => {
    console.log( error);
  });*/
}
</script>
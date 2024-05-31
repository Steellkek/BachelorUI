<template>
  <h6>{{NameProject}}</h6>
  <CDropdown>
    <CDropdownToggle color="primary">Проект</CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem href="#" @click="() => { visibleStaticBackdropCreate  = true }" variant="outline">Создать новый проект</CDropdownItem  >
      <CDropdownItem href="#" @click="() => { visibleStaticBackdropChoice  = true }" variant="outline">Открыть проект из БД</CDropdownItem >
      <CDropdownItem href="#" @click="() => { visibleStaticBackdropUpload  = true }" variant="outline" :disabled= "projectId=== 0">Загрузить файл</CDropdownItem >
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="info">Инфо</CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem href="#"  variant="outline">Помощь</CDropdownItem  >
      <CDropdownItem href="#" @click="() => { visibleInfo  = true }" variant="outline">О программе</CDropdownItem >
    </CDropdownMenu>
  </CDropdown>
  <CButton @click="openStartAlg" :disabled= "projectId=== 0" color="secondary">
    Запуск
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
          :active="tabPaneActiveKey === 6"
          @click="() => {tabPaneActiveKey = 6}"
      >
        Элементы
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink
          href="javascript:void(0);"
          :active="tabPaneActiveKey === 4"
          @click="() => {tabPaneActiveKey = 4}"
      >
        Функциональные узлы
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
    <CTabPane role="tabpanel" aria-labelledby="home-tab" v-if="tabPaneActiveKey === 1"  :visible="tabPaneActiveKey === 1">
      <ScemaWindowComponent :refreshSchema = "refreshSchema" :projectId = "projectId" @afterLoad = "afterLoadSchema"></ScemaWindowComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" v-if="tabPaneActiveKey === 2"  :visible="tabPaneActiveKey === 2">
      <PcbWindowComponent   :refreshPcb = "refreshPcb" :project-id = "projectId" @afterLoad = "afterLoadPcb"></PcbWindowComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" v-if="tabPaneActiveKey === 3"   :visible="tabPaneActiveKey === 3">
      <SolutionWindowComponent :refreshSolution = "refreshSolution" :projectId = "projectId" @afterLoad = "afterLoadSolution"></SolutionWindowComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 4">
      <FunctionBlockComponent 
          :projectId = "projectId" 
          :refreshFunctional = "refreshFunctional" 
          @afterLoad = "afterLoadFunc" 
          @refreshEms = "refreshEms" 
          @allComponentsInFunctionalBlocks = "allComponentsInFunctionalBlocks"
      >        
      </FunctionBlockComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 5">
      <EmsComponent :projectId = "projectId" :isRefreshEms = "isRefreshEms" @afterLoad = "afterLoadEms" @afterChange = "afterChange"></EmsComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 6">
      <ComponentWindowComponent :projectId = "projectId" :refreshComponents = "refreshComponents" @afterLoad = "afterLoadComp" @loadSolution = "afterChange"></ComponentWindowComponent>
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
      @refComponent = "refComponent"
  ></ModalUploadProjectComponent>
  <ModalStartAlgComponent
      :visibleStaticBackdropStart = "visibleStaticBackdropStart"
      :projectId = "projectId"
      @closeModal = "closeModal"
      @loadSolution = "loadSolution"
  ></ModalStartAlgComponent>
  <ModalInfoComponent :visible-info = "visibleInfo" @close-modal ="closeModal"></ModalInfoComponent>
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
import SolutionWindowComponent from "@/components/SolutionWindowComponent.vue";
import ComponentWindowComponent from "@/components/ComponentWindowComponent.vue";
import ModalInfoComponent from "@/components/ModalInfoComponent.vue";
let tabPaneActiveKey = ref(1)
let visibleStaticBackdropCreate = ref(false);
let visibleStaticBackdropChoice = ref(false);
let visibleStaticBackdropUpload = ref(false);
let visibleStaticBackdropStart = ref(false);
let refreshSchema = ref(false);
let refreshFunctional = ref(false);
let isRefreshEms = ref(false);
let refreshPcb = ref(false);
let refreshSolution = ref(false);
let isAllComponentsInFunctionalBlocks = ref(false);
let visibleInfo = ref(false);
let refreshComponents = ref(true);
let NameProject = ref("Создайте или выберите проект!");

let projectId = ref(0);

const choiceProject = function (project){
  projectId.value = project.id;
  NameProject.value = "Проект:" + project.nameProject;
  afterUpload();
}
const  afterLoadComp = function (){
  refreshComponents.value = false;
}
const afterLoadSolution = function (){
  refreshSolution.value = false;
}
const afterLoadPcb = function () {
  refreshPcb.value = false;
}
const afterLoadSchema = function () {
  refreshSchema.value = false;
}
const afterLoadFunc = function () {
  refreshFunctional.value = false;
}
const afterLoadEms = function () {
  isRefreshEms.value = false;
}
const loadSolution = function (){
  refreshSolution.value = true;
}

const afterChange = function (){
  loadSolution();
  refreshSchema.value = true;
}
const refComponent = function (){
  refreshComponents.value = true;
}
const afterUpload = function (){
  refreshSchema.value = true;
  refreshFunctional.value = true;
  refreshEms();
  refreshPcb.value = true;
  loadSolution();
}
const refreshEms = function (){
  isRefreshEms.value = true;
}
const closeModal = function () {
  visibleStaticBackdropCreate.value = false;
  visibleStaticBackdropChoice.value = false;
  visibleStaticBackdropUpload.value = false;
  visibleStaticBackdropStart.value = false;
  visibleInfo.value = false;
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

</script>
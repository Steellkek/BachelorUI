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
  <CButton>
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
        Функциональные блоки
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
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
      Окно с результатом
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 4">
      Окно с функциональными блоками
      <FunctionBlockComponent :projectId = "projectId"></FunctionBlockComponent>
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 5">
      Окно с ЭМС
      <EmsComponent :projectId = "projectId"></EmsComponent>
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

let tabPaneActiveKey = ref(1)
let visibleStaticBackdropCreate = ref(false);
let visibleStaticBackdropChoice = ref(false);
let visibleStaticBackdropUpload = ref(false);
let refreshSchema = ref(false);
let NameProject = ref("");

let projectId = ref(0);

const choiceProject = function (project){
  projectId.value = project.id;
  NameProject.value = project.nameProject;
  refreshSchema.value = true;
}
const afterLoad = function (){
  refreshSchema.value = false;
}
const afterUpload = function (){
  refreshSchema.value = true;
}
const closeModal = function () {
  visibleStaticBackdropCreate.value = false;
  visibleStaticBackdropChoice.value = false;
  visibleStaticBackdropUpload.value = false;
}

</script>
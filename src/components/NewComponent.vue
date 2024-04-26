<template>
  <CNav variant="tabs" role="tablist">
    <CDropdown>
      <c-dropdown-toggle color="primary">Меню</c-dropdown-toggle>
      <CDropdownMenu>
        <CButton   @click="() => { visibleStaticBackdropDemo  = true }">Создать новый проект</CButton >
        <CDropdownItem href="#">Открыть проект из БД</CDropdownItem>
      </CDropdownMenu>
      <CModal
          backdrop="static"
          :visible="visibleStaticBackdropDemo"
          @close="() => { visibleStaticBackdropDemo = false }"
          aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Создать новый проект</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h1>Введите название проекта!</h1>
        </CModalBody>
        <CForm class="d-flex">
          <CFormInput type="search" class="me-2" placeholder="Search"/>
        </CForm>
        <CModalFooter>
          <CButton color="secondary" @click="() => { visibleStaticBackdropDemo = false }">
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </CDropdown>
    <CButton>
      Запуск
    </CButton>
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
  <CTabContent>
    <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
      Окно со схемой
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
      Окно с платой
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
      Окно с результатом
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
      Окно с функциональными блоками
    </CTabPane>
    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
      Окно с ЭМС
    </CTabPane>
  </CTabContent>
</template>

<script setup>
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/vue/dist/esm/components/dropdown";
import {CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {ref} from "vue";
import {CForm, CFormInput} from "@coreui/vue/dist/esm/components/form";
import {CTabContent, CTabPane} from "@coreui/vue/dist/esm/components/tabs";
import {CNav, CNavItem, CNavLink} from "@coreui/vue/dist/esm/components/nav";
let tabPaneActiveKey = ref(1)
let visibleStaticBackdropDemo = ref(false);

</script>
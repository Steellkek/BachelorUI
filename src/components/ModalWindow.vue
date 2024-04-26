<template>
  <CButton   @click="() => { visibleStaticBackdropDemo  = true }">Another action</CButton >
</template>
<script>
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from "@coreui/vue/dist/esm/components/modal";

export default {
  components: { CModalFooter, CModalBody, CModalTitle, CModalHeader, CModal, CButton},
  data() {
    return {
      visibleStaticBackdropDemo: false,
    }
  }  
}
</script>
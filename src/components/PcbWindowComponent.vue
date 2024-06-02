<script setup>
import {onMounted, defineProps, watch, defineEmits, ref} from "vue";
import cytoscape from "cytoscape";
import {CButton} from "@coreui/vue/dist/esm/components/button";
// eslint-disable-next-line no-unused-vars
let cy2 = null;
const props = defineProps(['projectId', 'refreshPcb']);
const emit = defineEmits(['afterLoad']);
watch(props, () =>{
  if (cy2 === null || props["refreshPcb"] === false) {
    return
  }
  loadGraph();
})

const visible = ref(true);

const loadGraph = function (){
  cy2.remove(cy2.elements());
  // eslint-disable-next-line no-unused-vars
  let response = fetch(process.env.VUE_APP_API+"/api/Pcb/GetPcb", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();

    visible.value = data.item1 !== null;
    // check for error response
    if (!response.ok) {
      // get error message from body or default to response statusText
      const error = (data && data.message) || response.statusText;
      console.log(error)
    }
    console.log(data);
    let g= 1;
    data.item2.forEach((x) =>
        cy2.add([{group: 'nodes',
          data: {
            id: x.id,
            width: x.width*5,
            height: x.height*5,
            label: g++ +'\n'+x.height+'×'+x.width,
        }}])
    );
    for (let i = 0; i < data.item3.length;i++){
      cy2.add([{group: 'edges',
        data: {
          id: 'e' + (i+1),
          source: data.item3[i].hardPartPcb1Id,
          target: data.item3[i].hardPartPcb2Id,
        }
      }])
    }
    console.log(cy2.nodes()[0])
    cy2.layout({name: 'grid'}).run();
    cy2.layout({name: 'grid'}).stop();
    emit("afterLoad");
  }).catch(error => {
    console.log( error);
  });
}
const zoom = function (){
  cy2.layout({name: 'grid'}).run();
  cy2.layout({name: 'grid'}).stop();
}
onMounted(()=>{
  cy2 = window.cy2 = cytoscape({
    container: document.getElementById('cy2'),

    elements: [],
    style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'shape':'rectangle',
          'height': 'data(height)',
          'width': 'data(width)',
          'background-opacity': 1,
          'background-color': 'green',
          'text-wrap':"wrap",
          'content': 'data(label)',
        })
        .selector('edge')
        .css({
          'width': 10,
          'line-color': 'orange',
          'content': 'data(label)',
          'font-size': '15px',
          'color': 'black'
        })
  });
  loadGraph();
})
</script>

<template>
  <div class="row justify-content-center" v-if="visible">
    <div class="col-6">
      <div  id="cy2"/>
    </div>
    <div class="col-3">
      <CButton @click ="zoom" color="primary" variant="outline">Восстановить</CButton>
    </div>
  </div>
  <div v-if="!visible" >
    Загрузите файл с проектом!
  </div>
</template>

<style scoped>
#cy2 {
  color: #d3d3d3;
  font: 12pt arial;
  height: 650px;
  border: 1px solid #444444;
  background-color: #ffffff;
}
</style>
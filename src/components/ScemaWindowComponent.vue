<script setup>
import {onMounted, defineProps, watch,defineEmits} from "vue";
import cytoscape from "cytoscape";
import fcose from 'cytoscape-fcose';
import {CButton} from "@coreui/vue/dist/esm/components/button";
cytoscape.use( fcose );
// eslint-disable-next-line no-unused-vars
let cy = null;
const props = defineProps(['projectId', 'refreshSchema']);
const emit = defineEmits(['afterLoad']);
watch(props, () =>{
  if (cy === null || props["refreshSchema"] === false) {
    return
  }
  loadGraph();
})
// eslint-disable-next-line no-unused-vars
var el = ['pcb','pcb2','chip','processor','pcb3','cpu']
// eslint-disable-next-line no-unused-vars
const RandPng = function () {
  var rand = Math.floor(Math.random() * el.length);
  return el[rand];
}
const loadGraph = function (){
  cy.remove(cy.elements());
  // eslint-disable-next-line no-unused-vars
  let response = fetch("https://localhost:44389/api/Schema/GetSchema", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();

    // check for error response
    if (!response.ok) {
      // get error message from body or default to response statusText
      const error = (data && data.message) || response.statusText;
      console.log(error)
    }
    console.log(data);
    data.componentsPcb.forEach((x) =>
        cy.add([{group: 'nodes',
          data: {
            id: x.designator,
            type: "comp",
            img: RandPng(),
            width: x.width*10,
            height: x.height*10
        }
      }])
    );
    for (let i = 0; i < data.connectionsComponent.length;i++){
      cy.add([{group: 'edges',
        data: {
          id: 'e' + (i+1),
          source: data.connectionsComponent[i].componentPcb1.designator,
          target: data.connectionsComponent[i].componentPcb2.designator,
          label: data.connectionsComponent[i].countConnection,
        }
      }])
    }
    console.log(cy.nodes()[0])
    cy.layout({name: 'circle'}).run();
    cy.layout({name: 'circle'}).stop();
    emit("afterLoad");
  }).catch(error => {
    console.log( error);
  });
}
const zoom = function (){
  cy.layout({name: 'circle'}).run();
  cy.layout({name: 'circle'}).stop();
}

onMounted(()=>{
  cy = window.cy = cytoscape({
    container: document.getElementById('cy'),

    elements: [],
    style: cytoscape.stylesheet()
        .selector('edge')
        .css({
          'width': 5,
          'line-color': 'black',
          'content': 'data(label)',
          'font-size': '10px',
          'color': 'white'
        })
        .selector('node')
        .css({
          'label': 'data(id)',
          'height': 'data(height)',
          'width': 'data(width)',
          'content': 'data(id)',
          'background-fit': 'cover',
          'border-color': '#000',
          'border-width': 0,
          'border-opacity': 0.5,
          'background-opacity': 0,
          'background-width': 100,
          'background-height': 100,
          'font-size': '10px',
          'shape': 'rectangle'
        })
        .selector('node[img="chip"]')
        .css({
          'background-image': 'https://cdn3.iconfinder.com/data/icons/computers-devices/64/chip-processor-motherboard-technology-512.png',
        })
        .selector('node[img="pcb"]')
        .css({
          'background-image': 'https://cdn-icons-png.freepik.com/512/11876/11876987.png',
        })
        .selector('node[img="pcb2"]')
        .css({
          'background-image': 'https://cdn-icons-png.freepik.com/512/2399/2399658.png',
        })
        .selector('node[img="pcb3"]')
        .css({
          'background-image': 'https://cdn-icons-png.freepik.com/512/7884/7884346.png',
        })
        .selector('node[img="cpu"]')
        .css({
          'background-image': 'https://cdn-icons-png.freepik.com/512/8789/8789774.png',
        })
        .selector('node[img="processor"]')
        .css({
          'background-image': 'https://cdn-icons-png.freepik.com/512/6533/6533373.png',
        })
  });
  loadGraph();
})
</script>

<template>
  <div id="cy" ></div>
  <CButton @click ="zoom">Восстановить</CButton>
</template>

<style scoped>
#cy {
  position: fixed;
  left: 25%;
  color: #d3d3d3;
  font: 12pt arial;
  height: 600px;
  width: 600px;
  border: 1px solid #444444;
  background-color: #ffffff;
}
</style>
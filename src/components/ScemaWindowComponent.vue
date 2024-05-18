<script setup>
import {onMounted, defineProps, watch,defineEmits} from "vue";
import cytoscape from "cytoscape";
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
          data: {id: x.designator}}])
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
onMounted(()=>{
  cy = window.cy = cytoscape({
    container: document.getElementById('cy'),

    elements: [],
    style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'height': 'data(height)',
          'width': 'data(width)',
          'background-fit': 'cover',
          'border-color': '#000',
          'border-width': 0,
          'border-opacity': 0.5,
          'shape':'rectangle',
          'background-opacity': 0,
          'content': 'data(label)',
          'font-size': '15px',
        })
        .selector('edge')
        .css({
          'width': 10,
          'line-color': 'orange',
          'content': 'data(label)',
          'font-size': '15px',
          'color': 'black'
        })
        .selector('node')
        .css({
    'shape': 'rectangle',
        'content': 'data(id)',
        'text-valign': 'center',
        'text-halign': 'center'
  })
  });
  loadGraph();
})
</script>

<template>
  <div id="cy" ></div>
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
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

    boxSelectionEnabled: false,

    style: [
      {
        selector: 'node',
        css: {
          'shape': 'rectangle',
          'content': 'data(id)',
          'text-valign': 'center',
          'text-halign': 'center'
        }
      },
      {
        selector: ':parent',
        css: {
          'text-valign': 'top',
          'text-halign': 'center',
          'shape': 'round-rectangle',
          'corner-radius': "10",
          'padding': 10
        }
      },
      {
        selector: 'node#e',
        css: {
          'corner-radius': "10",
          'padding': 0
        }
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
    layout: {
      name: 'preset',
      padding: 5
    }
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
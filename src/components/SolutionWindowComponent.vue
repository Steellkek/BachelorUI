<script setup>
import {onMounted, defineProps, watch, ref} from "vue";
import cytoscape from "cytoscape";
import {CButton} from "@coreui/vue/dist/esm/components/button";
import {CButtonGroup} from "@coreui/vue/dist/esm/components/button-group";
// eslint-disable-next-line no-unused-vars
let cy3 = null;
const props = defineProps(['projectId', 'refreshSolution']);
//const emit = defineEmits(['afterLoad']);
watch(props, () =>{
  if (cy3 === null || props["refreshSolution"] === false) {
    return
  }
  loadGraph();
})
const visible = ref(true);

// eslint-disable-next-line no-unused-vars
var el = ['pcb','pcb2','chip','processor','pcb3','cpu']
// eslint-disable-next-line no-unused-vars
const RandPng = function () {
  var rand = Math.floor(Math.random() * el.length);
  return el[rand];
}

const loadGraph = function (){
  cy3.remove(cy3.elements());
  // eslint-disable-next-line no-unused-vars
  let response = fetch("https://localhost:44389/api/Solution/GetSolution", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(props['projectId']),
  }).then(async response => {
    const data = await response.json();

    visible.value = data.item1.length !== 0;
    // check for error response
    if (!response.ok) {
      // get error message from body or default to response statusText
      const error = (data && data.message) || response.statusText;
      console.log(error)
    }
    console.log(data);
    let o = 1;
    data.item1.forEach((x) => 
      {
        cy3.add([{
          group: 'nodes',
          data: {
            id: "g" + x.id,
            width: x.width * 5,
            height: x.height * 5,
            type: "module",
            label: o++ +'\n'+x.height+'×'+x.width,
          }
        }])
        x.functionalBlocks.forEach((y) =>{
          cy3.add([{
            group: 'nodes',
            data: {
              id: "f" + y.id,
              parent: "g" + x.id,
              type: "func"
            }
          }])
          y.componentsPcb.forEach((k) =>{
            cy3.add([{
              group: 'nodes',
              data: {
                id: "c" + k.id,
                parent: "f" + y.id,
                type: "comp",
                width:k.width * 10,
                height: k.height * 10,
                label: k.designator +'\n'+k.height+'×'+k.width,
                img: RandPng(),
              }
            }])
          })
        })
      }
    );
    for (let i = 0; i < data.item2.length;i++){
      cy3.add([{group: 'edges',
        data: {
          id: 'e' + (i+1),
          source: "g" + data.item2[i].hardPartPcb1Id,
          target: "g" + data.item2[i].hardPartPcb2Id,
          label: data.item2[i].value,
          type: "flex"
        }
      }])
      zoom()
    }
    for (let i = 0; i < data.item3.length;i++){
      cy3.add([{group: 'edges',
        data: {
          id: 'e' + (i+1),
          source: "c" + data.item3[i].componentPcb1Id,
          target: "c" + data.item3[i].componentPcb2Id,
          type: "connect",
          label: data.item3[i].countConnection,
        }
      }])
      zoom()
    }
  }).catch(error => {
    console.log( error);
  });
}
const downloadSolution = function (){
  window.open("https://localhost:44389/api/Solution/download/"+ props['projectId']);
}
const zoom = function (){
  var layout = cy3.layout({
    name: 'fcose',
    quality: "proof",
    randomize: true,
    animate: false,
    animationDuration: 1000,
    animationEasing: undefined,
    fit: true,
    padding: 30,
    nestingFactor: 0.1,
    gravityRangeCompound: 1,
    initialEnergyOnIncremental: 1,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
  });
  layout.run();
}

onMounted(()=>{
  cy3 = window.cy3 = cytoscape({
    container: document.getElementById('cy3'),

    elements: [],
    style: cytoscape.stylesheet()
        .selector('node')        
        .css({
          'shape' : 'rectangle',
          'content': 'data(label)',
          'text-wrap':"wrap",
        })
        .selector('edge')
        .css({
        })
        .selector('edge[type="connect"]')
        .css({
          'width': 2.5,
          'line-color': '#b9775b',
          'content': 'data(label)',          
          'font-size': '5px',
          'color': 'black'
        })
        .selector('edge[type="flex"]')
        .css({
          'width': 5,
          'line-color': 'orange',
          'content': 'data(label)',
          'font-size': '10px',
          'color': 'black'
        })
        .selector('node[type="module"]')
        .css({
          'height': 'data(height)',
          'width': 'data(width)',
          'background-opacity': 1,
          'background-color': 'green',
          'font-size': '10px',
        })
        .selector('node[type="func"]')
        .css({
          'background-opacity': 0,
          'text-wrap':"wrap",
          'font-size': '10px',
          'border-width': 2,
        })
        .selector('node[type="comp"]')
        .css({
          'height': 'data(height)',
          'width': 'data(width)',
          'background-fit': 'cover',
          'border-color': '#000',
          'border-width': 0,
          'border-opacity': 0.5,
          'background-opacity': 0,
          'background-width': 100,
          'background-height': 100,
          'font-size': '10px',
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
  <div class="row justify-content-center" v-if="visible">
    <div class="col-6 ">
      <div id="cy3"/>
    </div>
    <div class="col-3">
      <CButtonGroup vertical role="group" aria-label="Vertical button group">
        <CButton @click ="zoom" color="primary" variant="outline">Восстановить</CButton>
        <CButton @click="downloadSolution" color="primary" variant="outline">Скачать решение</CButton>
      </CButtonGroup>
    </div>
  </div>
  <div v-if="!visible" >
    Запустите проектную процедуру!
  </div>
</template>

<style scoped>
#cy3 {
  color: #d3d3d3;
  font: 12pt arial;
  height: 650px;
  border: 1px solid #444444;
  background-color: #ffffff;
}
</style>
// eslint-disable-next-line no-unused-vars
var el = ['pcb','pcb2','chip','processor','pcb3','cpu']
// eslint-disable-next-line no-unused-vars
const RandPng = function () {
    var rand = Math.floor(Math.random() * el.length);
    return el[rand];
}
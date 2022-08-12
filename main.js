import CRUD from './index.js'

window.init = init
window.remove = remove
window.add = add
window.undo = undo

var data = [
  { content: 'som info' },
  { content: 'som info' },
  { content: 'som info' },
  { content: 'som info' },
]

var crudService
function init() {
  crudService = new CRUD(data, true, 'test', false)
  query()
}

function query() {
  crudService.query()
  getActivities()
}

function add() {
  const item = {
    content: 'addded',
  }
  crudService.add(item)
  getActivities()
}
function remove() {
  crudService.remove('eWMPup87')
  getActivities()
}
function getActivities() {
  console.log(crudService.activities)
}
function undo() {
  crudService.undoAction()
  getActivities()
}

---
id: 6xa4c
name: Vanilla js crud service
file_version: 1.0.2
app_version: 0.9.3-5
---

# Vanilla js full crud service useing crud-suit

```
import CRUD from './../package/index.js'

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
  crudService = new CRUD(data, true, 'test', false, baseURL)
  query()
}
function query() {
  crudService.query()
  getActivities()
}
function add(item) {
  crudService.add(item)
  getActivities()
}
function remove(itemId) {
  crudService.remove(itemId)
  getActivities()
}
function getActivities() {
  console.log(crudService.activities)
}
function undo() {
  crudService.undoAction()
  getActivities()
}
```





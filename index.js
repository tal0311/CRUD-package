console.log('package')

var items = [
  {
    _id: '101',
    content: 'some task',
  },
  {
    _id: '102',
    content: 'some task',
  },
  {
    _id: '103',
    content: 'some task',
  },
  {
    _id: '104',
    content: 'some task',
  },
]

class CRUD {
  constructor(data) {
    this.data = data
  }

  query() {
    // filtering options
    return this.data
  }
  remove(entityId) {
    const idx = this.data.findIndex((item) => item._id === entityId)
    this.data.splice(idx, 1)
  }
  update(entity) {
    const idx = this.data.findIndex((item) => item._id === entity._id)
    this.data.splice(idx, 1, entity)
  }
  setData(data) {
    this.data = data
  }
  getById(entityId) {
    return this.data.find((item) => item._id === entityId)
  }
}

const crudService = new CRUD(items)
console.log('crudService:', crudService)

// console.log(remove('101'))
function remove(taskId) {
  crudService.remove(taskId)
}

const task = {
  _id: '102',
  content: 'updated',
}

update(task)
function update(task) {
  crudService.update(task)
}

console.log('getting all items:', query())
function query() {
  return crudService.query()
}

console.log('getting item:', getById('101'))
function getById(taskId) {
  return crudService.getById(taskId)
}

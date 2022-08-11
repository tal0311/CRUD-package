console.log('package')

var items = [
  {
    _id: '101',
    content: 'some task',
    isDone: true,
    createdAt: Date.now(),
    reviews: [
      {
        _id: '101',
        reviewContent: 'some content',
      },
    ],
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
  constructor(data, isSaveToLS, key, promiseBased = false) {
    this.data = data
    this.isSaveToLS = isSaveToLS
    this.lcKey = key
    this.isAsync = promiseBased
    // this.itemId = CRUD.makeId()
  }

  query() {
    // filtering options
    return this.isAsync ? Promise.resolve(this.data) : this.data
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

  add(entity) {
    const addedEntity = Object.assign({ _id: this.#makeId() }, entity)

    this.data = [...this.data, addedEntity]
    return this.isAsync ? Promise.resolve(addedEntity) : addedEntity
  }

  getEmptyItem() {
    const item = Object.assign({}, this.data[0])
    for (let key in item) {
      if (typeof item[key] === 'string') {
        item[key] = ''
      } else if (typeof item[key] === 'boolean') {
        item[key] = false
      } else if (typeof item[key] === 'object') {
        item[key] = null
      } else {
        item[key] = 0
      }
    }
    return item
  }
  // private methods
  #makeId(length = 5) {
    var txt = ''
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    console.log(txt)
    return txt
  }
}

const crudService = new CRUD(items, true, 'tasks', false)
// console.log('crudService:', crudService)

// console.log(remove('101'))
// function remove(taskId) {
//   crudService.remove(taskId)
// }

const task = {
  content: 'added',
}

add(task)
function add(task) {
  crudService.add(task)
}

console.log(query())
function query() {
  return crudService.query()
}

// console.log('getting item:', getById('101'))
// function getById(taskId) {
//   return crudService.getById(taskId)
// }

getEmptyTask()
function getEmptyTask() {
  console.log(crudService.getEmptyItem())
}

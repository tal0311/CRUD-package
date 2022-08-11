'use strict'
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
    timeStamp: 3333333,
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
  constructor(data, isCache, key, promiseBased = false) {
    this.data = data
    this.isCache = isCache
    this.lcKey = key
    this.isAsync = promiseBased
  }

  query() {
    const data = this.#loadFromStorage()
    if (data && data.length > 0) {
      this.isAsync ? Promise.resolve(data) : data
      this.data = data
    }
    this.#setTimestamp(this.data)
    this.#saveToStorage()
    return this.isAsync ? Promise.resolve(this.data) : this.data
  }
  remove(entityId) {
    const idx = this.data.findIndex((item) => item._id === entityId)
    this.data.splice(idx, 1)
  }
  update(entity) {
    const idx = this.data.findIndex((item) => item._id === entity._id)
    entity = this.#setUpdateStamp(entity)
    console.log('updatetime:', entity)
    this.data.splice(idx, 1, entity)
    this.#saveToStorage()
  }
  setData(data) {
    this.data = data
  }
  getById(entityId) {
    return this.data.find((item) => item._id === entityId)
  }

  add(entity) {
    const addedEntity = Object.assign(
      { _id: this.#makeId(), timeStamp: Date.now() },
      entity
    )
    this.data = [...this.data, addedEntity]
    this.#saveToStorage()
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
  #setTimestamp(data) {
    console.log('before stamp:', data)
    this.data = data.map((item) => {
      return item.timeStamp ? item : { ...item, timeStamp: Date.now() }
    })
  }
  #setUpdateStamp(item) {
    item.updatedStamp = Date.now()
    return item
  }
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
  #saveToStorage() {
    localStorage.setItem(this.lcKey, JSON.stringify(this.data))
  }
  #loadFromStorage() {
    console.log(localStorage)
    return JSON.parse(localStorage.getItem(this.lcKey))
  }
}

const crudService = new CRUD(items, true, 'tasks', false)
// console.log('crudService:', crudService)

// console.log(remove('101'))
// function remove(taskId) {
//   crudService.remove(taskId)
// }

const task = {
  _id: 'FHhA7',
  content: 'added',
}

update(task)
function update(task) {
  crudService.update(task)
}

console.log(query())
function query() {
  return crudService.query()
}

// console.log('getting item:', getById('101'))
// function getById(taskId) {
//   return crudService.getById(taskId)
// }

// getEmptyTask()
// function getEmptyTask() {
//   console.log(crudService.getEmptyItem())
// }

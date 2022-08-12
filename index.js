'use strict'

var items = [
  {
    content: 'some task',
    isDone: true,
  },
  {
    content: 'some task',
    timeStamp: 3333333,
  },
  {
    content: 'some task',
  },
  {
    content: 'some task',
  },
]

class CRUD {
  constructor(data, isCache, key = null, promiseBased = false) {
    this.data = data
    this.isCache = isCache
    this.lcKey = key
    this.isAsync = promiseBased
    this.activities = []
    this.prevState = []
    console.log('CRUD service is online')
  }

  query() {
    const data = this.#loadFromStorage()
    if (data && data.length > 0) {
      this.data = data
    }
    this.#setItemId()
    this.#setTimestamp(this.data)
    this.#saveToStorage()
    this.#addActivity(
      `All data with ${
        this.lcKey
          ? `with local storage key \"${this.lcKey}\"`
          : 'without local storage key'
      } was requested`
    )
    return this.isAsync ? Promise.resolve(this.data) : this.data
  }
  remove(entityId) {
    this.#savePrevState()
    const idx = this.data.findIndex((item) => item._id === entityId)
    this.data.splice(idx, 1)
    this.#addActivity(`item with id:${entityId} was removed`)
    this.#saveToStorage()
  }
  update(entity) {
    this.#savePrevState()
    const idx = this.data.findIndex((item) => item._id === entity._id)
    entity = this.#setUpdateStamp(entity)
    this.data.splice(idx, 1, entity)
    this.#saveToStorage()
    this.#addActivity(`item with id:${entity._id} was updated`)
  }
  getById(entityId) {
    this.#addActivity(`item with id:${entityId} was requested`)
    return this.data.find((item) => item._id === entityId)
  }
  add(entity) {
    this.#savePrevState()
    const addedEntity = Object.assign(
      { _id: this.#makeId(), timeStamp: Date.now() },
      entity
    )
    this.data = [...this.data, addedEntity]
    this.#saveToStorage()
    this.#addActivity(`item with _id: ${addedEntity._id} was added`)
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
    this.#addActivity('getting empty item')
    return item
  }
  undoAction() {
    const prevState = this.#loadPrevState()
    this.data = prevState
    this.#saveToStorage()
    this.#addActivity('recovering last step')
    return this.data
  }
  // private methods
  #setTimestamp(data) {
    this.data = data.map((item) => {
      return item.timeStamp ? item : { ...item, timeStamp: Date.now() }
    })
  }
  #setUpdateStamp(item) {
    item.updatedStamp = Date.now()
    return item
  }
  #makeId(length = 8) {
    var txt = ''
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
  }
  #setItemId() {
    this.data = this.data.map((item) => {
      return item._id ? item : { _id: this.#makeId(), ...item }
    })
  }
  #addActivity(desc) {
    const activity = {
      _id: 'ACT' + this.#makeId(),
      desc,
      timeStamp: Date.now(),
    }
    this.activities.push(activity)
  }
  // SAVING TO LOCAL STORAGE
  #saveToStorage() {
    localStorage.setItem(this.lcKey, JSON.stringify(this.data))
  }
  #loadFromStorage() {
    return JSON.parse(localStorage.getItem(this.lcKey))
  }

  // UNDO
  #savePrevState() {
    this.prevState = [...this.prevState, this.data]
  }
  #loadPrevState() {
    return this.prevState.pop()
  }
}

export default CRUD

'use strict'

class CRUD {
  constructor(data, isCache, key = null, promiseBased = false, baseURL) {
    this.data = data
    this.isCache = isCache
    this.lcKey = key
    this.isAsync = promiseBased
    this.activities = []
    this.prevState = []
    this.baseURL = baseURL
    console.log('%c CRUD service is online', 'color: #bada55')
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
      `Data ${
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
    this.#addActivity(`Item with id: ${entityId} was removed`)
    this.#saveToStorage()
  }
  update(entity) {
    this.#savePrevState()
    const idx = this.data.findIndex((item) => item._id === entity._id)
    entity = this.#setUpdateStamp(entity)
    this.data.splice(idx, 1, entity)
    this.#saveToStorage()
    this.#addActivity(`Item with id: ${entity._id} was updated`)
  }
  getById(entityId) {
    this.#addActivity(`Item with id: ${entityId} was requested`)
    const item = this.data.find((item) => item._id === entityId)
    return this.isAsync ? Promise.resolve(item) : item
  }
  add(entity) {
    this.#savePrevState()
    const addedEntity = Object.assign(
      { _id: this.#makeId(), timeStamp: Date.now() },
      entity
    )
    this.data = [...this.data, addedEntity]
    this.#saveToStorage()
    this.#addActivity(`item with id: ${addedEntity._id} was added`)
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
    this.#addActivity('Getting empty item')
    return item
  }
  undoAction() {
    const prevState = this.#loadPrevState()
    this.data = prevState
    this.#saveToStorage()
    this.#addActivity('Recovering last step')
    return this.data
  }
  // PRIVATE METHODS
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
    if (!this.lcKey) {
      return
    }
    localStorage.setItem(this.lcKey, JSON.stringify(this.data))
  }
  #loadFromStorage() {
    if (!this.lcKey) {
      return
    }
    return JSON.parse(localStorage.getItem(this.lcKey))
  }
  // UNDO METHODS
  #savePrevState() {
    this.prevState = [...this.prevState, this.data]
  }
  #loadPrevState() {
    return this.prevState.pop()
  }
}

export default CRUD

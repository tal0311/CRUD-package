console.log('package')

var items = [
  {
    _id: '101',
    content: 'some task',
  },
  {
    _id: '101',
    content: 'some task',
  },
  {
    _id: '101',
    content: 'some task',
  },
  {
    _id: '101',
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
    this.data = this.data.splice(idx, 1)
    this.setData(this.data)
  }
  setData(data) {
    this.data = data
  }
}

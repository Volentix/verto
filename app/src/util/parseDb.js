
const Parse = require('parse')

Parse.initialize(
  '6olkjCvR0SZGZxExwEPKgBAL9O9vmeHlQ32RyK3t',
  'UEJsZbYlxn4iXIrKsgAGWj3kLzKMxPqsSuCjQhlP'
)

Parse.serverURL = 'https://volentix.b4a.io'

class ParseDB {
  createClass (name, content) {
    var MyClass = Parse.Object.extend(name)
    var object = new MyClass()
    return object.save(content)
  }

  parseQuery (name) {
    var data = Parse.Object.extend(name)
    var query = new Parse.Query(data)
    return query
  }

  destroy () {
    Parse.LiveQuery.close()
  }
  createUseACLObject (objectName, data, permission = {
    read: true,
    write: false
  }) {
    var acl = new Parse.ACL()
    var NewObject = Parse.Object.extend(objectName)
    let newObject = new NewObject()
    for (let i in data) {
      newObject.set(i, data[i])
    }
    if (permission.read) { acl.setReadAccess(Parse.User.current(), true) }

    if (permission.write) { acl.setWriteAccess(Parse.User.current(), true) }

    newObject.setACL(acl)
    return newObject.save()
  }
}

export default new ParseDB()

import * as grpc from '@grpc/grpc-js'
import {loadSync} from '@grpc/proto-loader'

const packageDef = loadSync('todo.proto', {})
const gRPCObject = grpc.loadPackageDefinition(packageDef)

const todoPackage = gRPCObject.pb

let todoList = []

function List(call, callback) {
    return callback(null, { todoItem: todoList })
}

function Insert(call, callback) {
    const data = call.request

    const newProductData = {...data, id: todoList.length + 1}

    todoList.push(newProductData)

    return callback(null, newProductData)
}

function Mark(call, callback) {
    const data = call.request

    let todoItem = todoList.find((item) => item.id === data.id)
    todoItem.done = true

    const newTodoList = todoList.filter((item) => todoItem !== item)
    todoList = [...newTodoList, todoItem]

    return callback(null, todoItem)
}

const server = new grpc.Server()
server.addService(todoPackage.TodoService.service, {
    List,
    Insert,
    Mark
})

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running')
})
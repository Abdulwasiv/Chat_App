import express from 'express'
import http from 'http'
import { Socket } from 'socket.io'

const app=express()
const server=http.createServer(app)
const io=Socket(server)

io.on('connection' , (socket)=>{
    console.log("user connected successfully")

    socket.on('message',(message)=>{
        io.emit('message' , message)
    })

    socket.on("disconnect" ,()=>{
        console.log("user disconnect")
    })
})

app.listen(3000,()=>{
    console.log("server start")
})
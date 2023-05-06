//dependencies
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const {PORT = 4000, MONGODB_URL} = process.env

//database settings
mongoose.connect(MONGODB_URL)
mongoose.connection
    .on('connected', () => console.log('connected to MongoDB'))
    .on('error', (err) => console.log('Error with MongoDB:' + err.message))

//model
const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps:true})

const People = mongoose.model('People', peopleSchema)

//mount middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

//ROUTES
app.get('/', (req,res) => {
    res.send('Hello and welcome to the people app')
})
//index
app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch (error) {
        console.log('error: ', error);
        res.json({error: 'something went wrong - check console'})
    }
})
//create
app.post('/people', async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        console.log('error: ', error)
        res.json({error: 'something went wrong - check console'})
    }
})
//update
app.put('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        ))
    } catch (error) {
        console.log('error: ', error)
        res.json({error: 'something went wrong - check console'})
    }
})
//delete
app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndDelete(req.params.id))
    } catch (error) {
        console.log('error: ', error)
        res.json({error: 'something went wrong - check console'})
    }
})
//express listener
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`)
})
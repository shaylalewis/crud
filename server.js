// console.log('I love Utah')

const express = require('express')
const bodyParser = require('body-parser')
const req = require('express/lib/request')
const PORT = 8000
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://neoduck:GPuqhFPFYdW0hY7m@cluster0.ogrcv.mongodb.net/?retryWrites=true&w=majority'
const app = express()


//Database connection using promises
MongoClient.connect(connectionString, {
        useUnifiedTopology: true
    })
    .then(client => {
        console.log('Hacked into the mainframe')
        const db = client.db('neo-city-quotes')
        const quotesCollection = db.collection('quotes')
        //EJS
        app.set('view engine', 'ejs')
        //Body Parser - goes before CRUD handlers
        app.use(bodyParser.urlencoded({
            extended: true
        }))
        app.use(bodyParser.json())
        app.use(express.static('public'))

        //Read
        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', {
                        quotes: results
                    })
                })
                .catch(error => console.error(error))
            // console.log(cursor)
            // res.sendFile(__dirname + '/index.html')
        })

        //Create
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate({
                    name: 'Yoda'
                }, {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                }, {
                    upsert: true
                })
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })
    })



//Listen for the server on PORT
app.listen(process.env.PORT || PORT, () => {
    console.log(`listening on port ${PORT}`)
})

// })
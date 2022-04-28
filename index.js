const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewareWrapper
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
})

// connection to mongodb

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.2jdxh.mongodb.net:27017,cluster0-shard-00-01.2jdxh.mongodb.net:27017,cluster0-shard-00-02.2jdxh.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7ndns6-shard-0&authSource=admin&retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const eventCollection = client.db("volunteerEvents").collection("event");

        // POST Events : add a new Event
        app.post('/event', async (req, res) => {
            const newEvent = req.body;
            console.log('Adding New Event', newEvent);
            const result = await eventCollection.insertOne(newEvent);
            console.log(result);
            res.send(result)
        })


        //get all Events
        app.get('/event', async (req, res) => {
            const query = {}
            const cursor = eventCollection.find(query);
            const events = await cursor.toArray()
            res.send(events)
        })


        // delete an Event 
        app.delete('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.deleteOne(query);
            res.send(result);
        })

        // app.get('/user/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await userCollection.findOne(query)
        //     res.send(result);
        // })

        //Specific User Update
        // app.put('/user/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id)
        //     const updatedUser = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             name: updatedUser.name,
        //             email: updatedUser.email
        //         },
        //     };
        //     const result = await userCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);

        // })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)



app.listen(port, () => {
    console.log('Listening server on ', port);
})
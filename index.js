const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application } = require('express');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;

// middle ware 

app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfvtb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('BestElectronics').collection('item');
        const emailCollection = client.db('BestElectronics').collection('email')

        // find all items
        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // find a single id 

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const item = await itemCollection.findOne(query);
            res.send(item);
        })

        //Post 
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })


        //update quantity
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedQuantity
            }
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        //delete 

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });

        // email collection app

        app.get('/addEmail', async (req, res) => {
            const seeEmail = req.query.email;
            const query = { email: seeEmail };
            const cursor = emailCollection.find(query);
            const email = await cursor.toArray();
            res.send(email);
        })

        app.post('/addEmail', async (req, res) => {
            const addEmail = req.body;
            const result = await emailCollection.insertOne(addEmail);
            res.send(result);
        })

        app.delete('/addEmail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await emailCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Running best electronic server")
})


app.listen(port, () => {
    console.log('listining port ', port);
})
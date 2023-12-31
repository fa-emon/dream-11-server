const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zdzdyrx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const countryCollection = client.db('dream11').collection('countries');
        const playersCollection = client.db('dream11').collection('players');
        const mySquadCollection = client.db('dream11').collection('mySquad');

        /* {---------------Countries API-------------} */
        //get all the country api
        app.get('/country', async (req, res) => {
            const result = await countryCollection.find().toArray();
            res.send(result);
        })

        //get all the players of specific country api
        app.get('/player/:country', async (req, res) => {
            const country = req.params.country;
            const query = { country: country };
            const result = await playersCollection.find(query).toArray();
            res.send(result);
        })

        /* {---------------Players API-------------} */
        //get specific player details api
        app.get('/player-details/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await playersCollection.findOne(query);
            res.send(result);
        })

        /* {---------------mySquad API-------------} */
        //get all player from mySquad collection
        app.get('/mySquad', async (req, res) => {
            const result = await mySquadCollection.find().toArray();
            res.send(result);
        })

        //add specific player information with user email
        app.post('/mySquad', async (req, res) => {
            const mySquad = req.body;
            const result = await mySquadCollection.insertOne(mySquad);
            res.send(result);
        })

        //delete a specific player from mySquad Collection
        app.delete('/mySquad/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await mySquadCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);

app.get('/', (req, res) => {
    res.send('Dream-11 Running..!!')
})

app.listen(port, () => {
    console.log(`Your server is running on port ${port}`)
})
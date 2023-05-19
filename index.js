const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000


// Middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgwn8xr.mongodb.net/?retryWrites=true&w=majority`;

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

    
    const toyHeroCollection = client.db("toyHero").collection("toyHeroCollection");

    // Create or post  a single new toy 
      
    app.post('/addToy', async(req, res) => {
        const newToy = req.body;
       const result = await toyHeroCollection.insertOne(newToy);
       res.send(result)
    })

    // get all toys data limit 20
    app.get('/toys', async(req, res) => {
        const limit = 20 ;
        const cursor = toyHeroCollection.find({}).limit(limit);
        const toys = await cursor.toArray();
        res.send(toys)
    })

    







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect();


 // Connect the client to the server	(optional starting in v4.7)
 client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
});


    
    const toyHeroCollection = client.db("toyHero").collection("toyHeroCollection");

// creating index for name field 

 const indexKey = {  toyName: 1 };
 const indexOptions = {name:'toyNameSearch' };
const result = await toyHeroCollection.createIndex(indexKey, indexOptions);



 // get all toys data limit 20
 app.get('/toys', async(req, res) => {
  const limit = 20 ;
  const cursor = toyHeroCollection.find({}).limit(limit);
  const toys = await cursor.toArray();
  res.send(toys)
})



//searching by name

app.get('/search/:text', async(req, res) => {
    

   
    const searchText = req.params.text;
    const result = await toyHeroCollection.find({ toyName: { $regex: searchText, $options: 'i' } }).toArray();
    res.send(result);
});



   

   

    // get some toy data by email 

    app.get('/mytoys', async(req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const cursor = toyHeroCollection.find(query);
        const myToys = await cursor.toArray();
        myToys.forEach((toy) => {
            toy.price = parseFloat(toy.price);
          });
        
          // Sort by price in ascending order
          myToys.sort((a, b) => a.price - b.price);
        
         
        res.send(myToys)
    })

// get single toy data by id 
 
app.get('/mytoys/:id', async(req, res) => {

    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    
      const toy = await toyHeroCollection.findOne(query);
      res.json(toy);
  } )

// get toy data by category

app.get('/toys/:category', async(req, res) => {
    const category = req.params.category;
    const query = {   toyCategory: category };
    const cursor = toyHeroCollection.find(query);       

    const toys = await cursor.toArray();
    res.send(toys)
})

   
 // Create or post  a single new toy 
      
 app.post('/addToy', async(req, res) => {
  const newToy = req.body;
 const result = await toyHeroCollection.insertOne(newToy);
 res.send(result)
})


  // update single toy data by id

    app.put('/mytoys/:id', async(req, res) => {
        const id = req.params.id;
        const updatedToy = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                
                price: updatedToy.price,
                Quantity : updatedToy.Quantity,
                description: updatedToy.description,
               
            },
            };
            const result = await toyHeroCollection.updateOne(filter, updateDoc, options);
            res.json(result);
    })

// delete single toy data by id  

    app.delete('/mytoys/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};

        const result = await toyHeroCollection.deleteOne(query);
        res.json(result);
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
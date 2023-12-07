const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.24pgglg.mongodb.net/?retryWrites=true&w=majority`;

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
      // Connect to the database and access its collection
      const userCollection = client.db("f11DB").collection("users");
      
      app.post('/users', async(req, res) => {
        const user = req.body;
        const query = {email: req.user?.email};
        const existingUser = await userCollection.findOne(query);
        if(existingUser) {
            res.send({message: "User already exists", insertedId: null})
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      })


    } finally {
       // Close the MongoDB client connection
    //   await client.close();
    }
  }

run().catch(console.dir);


app.get('/', async(req, res) => {
    res.send("hello, everyone");
})

app.listen(port, () => {
    console.log('Is everything OK!!!');
})
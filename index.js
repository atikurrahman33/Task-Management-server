const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_NAM}:${process.env.USER_PASS}@cluster0.o4gyyvr.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();
    const listCollection = client.db("task_management").collection("taskList");


    app.post('/task',async(req,res)=>{
        const task=req.body;
        console.log('new task',task);
        const result = await listCollection.insertOne(task);
        res.send(result)
      })

      app.get('/task', async (req, res) => {
        console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = listCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      app.delete('/task/:id', async (req, res) => {
        const id = req.params.id
        console.log('delete id', id)
        const query = { _id: new ObjectId(id) };
        const result = await listCollection.deleteOne(query);
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
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
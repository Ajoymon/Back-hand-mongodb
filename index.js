const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://smartdbuser:aod5ABYBndEmHvo5@my-first-cluster.ofk8daf.mongodb.net/?appName=my-First-Cluster";



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})


async function run() {
  try {

    await client.connect();

    const db = client.db('smart_db');
    const productsCllection = db.collection('products')

    app.post('/products', async (req, res) => {
      const newProducts = req.body;
      const result = await productsCllection.insertOne(newProducts)
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const cursor = productsCllection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/products', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCllection.findOne(query);
      res.send(result);
    })

    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedproducs = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedproducs.name,
          price: updatedproducs.price

        }
      }
      const resilt = await productsCllection.updateOne(query, update);
      res.send(resilt);
    })

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCllection.deleteOne(query);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
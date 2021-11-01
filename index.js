const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

//middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gntw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log('database connected successfully');
    const database = client.db('food_corner');
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('ordered');

    //get api of services
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //post api
    app.post('/services', async (req, res) => {
      const newUser = req.body;
      const result = await servicesCollection.insertOne(newUser);
      console.log('Got new user', req.body);
      console.log('added user', result);
      // res.send(JSON.stringify(result))

      //alternative of stringify kore posting....  res.send(JSON.stringify(newUser)) & post jehetu pura  result tak json hishebe client side e pathno jabe
      res.json(result);
    });

    //get api of orders
    app.get('/orders', async (req, res) => {
      console.log(req);
      const cursor = ordersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    //Booking single oreder
    app.post('/orders', async (req, res) => {
      console.log(req);
      const newUser = req.body;
      const result = await ordersCollection.insertOne(newUser);
      console.log('Got new user', req.body);
      console.log('added user', result);
      // res.send(JSON.stringify(result))

      //alternative of stringify kore posting....  res.send(JSON.stringify(newUser)) & post jehetu pura  result tak json hishebe client side e pathno jabe
      res.json(result);
    });

    // Personal booking
    app.get('/orders/:uid', async (req, res) => {
      const uid = req.params.uid;
      console.log('Getting specific service', uid);
      const query = { userid: { $in: [uid] } }; //database e key value theke alada ekta object 'in' er moddhe 'keys' gulo  thakle okhane object 'in' e add hbe
      const products = await ordersCollection.find(query).toArray();
      res.send(products);
    });

    //Delete API

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      console.log('Deleting user with id', result);

      res.json(result);
    });

    //update api (presents here in mongodb by PUT)...url.. https://d...content-available-to-author-only...b.com/drivers/node/current/usage-examples/updateOne/
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true }; //optional ...dile hobe na dileo hbe..upsert(update & insert mile upsert hoise works for update hole id dhore update hbe nahoi oi id dhore nahoi insert kore dibe)..module(64_5-2)
      const updateDoc = {
        $set: {
          orderStatus: 'Approved',
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc, options);
      console.log('updating user', req);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  console.log(req);
  console.log(res);
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

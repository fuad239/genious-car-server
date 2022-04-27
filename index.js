const express=require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors= require('cors');
const ObjectId=require('mongodb').ObjectId
const { json } = require('express/lib/response');
const app=express();
const port=5000;

app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    console.log('running')
    res.send('sending')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agbcv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//here we should not use password and username of database.So we have to secure this by using environment variable.For details go in dotenv website.
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");
//get api
app.get('/services',async(req,res)=>{
  const cursor=servicesCollection.find({})
  const result=await cursor.toArray(cursor)
  res.send(result)
})
//get one specifiq id
app.get('/services/:id',async(req,res)=>{
  const id=req.params.id 
  const query={_id: ObjectId(id)}
  const service=await servicesCollection.findOne(query)
  res.json(service)
})
//post api
      app.post('/services',async(req,res)=>{
        const service=req.body
        const result=await servicesCollection.insertOne(service)
        res.json(result)
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.listen(port,()=>{
    console.log('running on port,', port)
})
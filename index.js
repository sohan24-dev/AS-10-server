const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

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
        const database = client.db("AS_10");
        const LaywerData = database.collection("laywerData");
        const comments = database.collection('comments')
        // comment data 
        app.post("/comment", async (req, res) => {
            const comment = req.body;
            const result = await comments.insertOne(comment);
            res.send(result);
        });

        // get comment 
        app.get("/comment", async (req, res) => {

            const result = await comments.find().toArray();
            res.send(result);
        });

        // comment delete
        app.delete("/comment/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await comments.deleteOne(query);
            res.send(result);
        });

        // comments update 
        app.patch("/comment/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;

                const result = await comments.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Update failed" });
            }
        });


        // laywerData 
        app.get("/alllaywer", async (req, res) => {

            const result = await LaywerData.find().toArray();
            res.send(result);
        });
        // updateOne
        app.patch("/alllaywer/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;

                const result = await LaywerData.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Update failed" });
            }
        });
        // getdetails
        app.get("/alllaywer/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await LaywerData.findOne(query)
            res.send(result)
        })
        // Delete 
        app.delete("/alllaywer/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await LaywerData.deleteOne(query);
            res.send(result);
        });

        // addOne 
        app.post("/laywerdata", async (req, res) => {
            const movie = req.body;
            // console.log(movie);
            const result = await LaywerData.insertOne(movie);

            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
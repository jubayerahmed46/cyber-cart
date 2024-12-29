const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0n5ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb://localhost:5173/";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async function () {
  try {
    // apies
    await client.connect();
    const db = client.db("jobsDB");
    const jobsCollection = db.collection("jobs-collection");
    const bidCollection = db.collection("bidCollection");

    // get/read all job
    app.get("/jobs", async (req, res) => {
      try {
        let query = {};
        if (req?.query?.email) {
          query = { email: req?.query?.email };
        }
        const jobs = await jobsCollection.find(query).toArray();

        if (!jobs.length) {
          res.status(404).send({ message: "No Data Fount!" });
        }
        res.send(jobs);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });

    // get/read one job
    app.get("/jobs/:id", async (req, res) => {
      try {
        console.log(req.params);
        const query = { _id: new ObjectId(req.params.id) };
        const result = await jobsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    // get all bids for a specific user based on : email
    app.get("/bids/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { sellerEmail: email };
        const result = await bidCollection.find(query).toArray();

        if (!result.length) {
          return res.status(404).send({ message: "Bids not found!" });
        }

        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    // get all bid request for a buyer
    app.get("/requested-bids/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { buyerEmail: email };
        const result = await bidCollection.find(query).toArray();

        if (!result.length) {
          return res.status(404).send({ message: "Bids not found!" });
        }

        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    //  post/create new job : as a reqruter -
    app.post("/jobs", async (req, res) => {
      try {
        const data = req.body;
        const result = await jobsCollection.insertOne(data);
        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    // post a bid for a specific job
    app.post("/bids", async (req, res) => {
      try {
        const doc = req.body;

        const validedIsAlreadyBidded = await bidCollection.findOne({
          sellerEmail: doc.sellerEmail,
        });
        if (validedIsAlreadyBidded) {
          return res.status(403).send({ message: "Already Bidded" });
        }

        const result = await bidCollection.insertOne(doc);
        if (result.acknowledged) {
          const update = await jobsCollection.updateOne(
            { _id: new ObjectId(doc.jobId) },
            { $inc: { bidCount: 1 } },
            { upsert: true }
          );
          console.log(update);
        }
        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    // update job  - /jobs/update/
    app.patch("/jobs/update/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const updatedDoc = {
          $set: req.body,
        };
        const result = await jobsCollection.updateOne(query, updatedDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    //  update bid status
    app.patch("/bids/updadte-status/:bidId", async (req, res) => {
      try {
        console.log(
          req.body,
          "bidId id:",
          req.params.bidId,
          "------> from line no < 125"
        );
        const query = { _id: new ObjectId(req.params.bidId) };
        const update = {
          $set: {
            status: req.body.currStatus,
          },
        };
        const result = await bidCollection.updateOne(query, update);
        console.log(result);
        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
    // delete my post
    app.delete("/jobs/delete/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await jobsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send(`server error: ${error.message}`);
      }
    });
  } catch (err) {
    console.dir(err);
  }
})();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Running</title>
</head>
<body style="margin: 0; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f9; color: #333;">
    <div style="text-align: center;">
        <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: #0078d7;">Server is Running</h1>
        <p style="font-size: 1.2rem; color: #555;">Your server is up and ready to serve requests.</p>
        <div style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; border-radius: 8px; background-color: #e6f7ff; color: #00509e; font-weight: bold;">
            Status: Online
        </div>
    </div>
</body>
</html>

    `);
});

app.listen(port, () => console.log(`Server running on port ${port}`));

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0n5ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

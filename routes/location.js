const express = require('express');
const mongoDb = require('mongodb');  
const MongoClient = mongoDb.MongoClient;

const router = express.Router();

const connectionString =
  "connection string";
const client = new MongoClient(connectionString);

router.post('/add-location', async (request, response, next) => {
    const address = {
        address: request.body.address,
        coords: {
            lat: request.body.coords.lat,
            lng: request.body.coords.lng,
        }
    };

    try {
        const result = await client.db('locations').collection('user-locations').insertOne(address);
        console.log(result);
        response.json({message: 'Stored location!', locId: result.insertedId})
    } catch(err) {
        console.log(err);
    }
});

router.get('/location/:lid', async (request, response, next) => {
    const locationId = request.params.lid;

    try {
        const findResult = await client.db('locations').collection('user-locations').findOne(
        {
            _id: new mongoDb.ObjectId(locationId),
        });

        if (!findResult) {
            return response.status(404).json({message: 'Not found!'});
        }

        response.json({address: findResult.address, coordinates: findResult.coords});
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;
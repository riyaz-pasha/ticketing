import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = "jwt secret key";

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

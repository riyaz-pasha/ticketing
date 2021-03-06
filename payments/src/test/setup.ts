import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { getId } from './utils';

jest.mock("../nats-wrapper");
jest.mock("../stripe");

declare global {
    namespace NodeJS {
        interface Global {
            signin(userId?: string): string[]
        }
    }
}

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = "jwt secret key";
    process.env.STRIPE_KEY = "jwt secret key";

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = (userId?: string) => {
    const payload = {
        id: userId || getId(),
        email: "test@mail.com",
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString("base64");
    return [`express:sess=${base64}`];
};

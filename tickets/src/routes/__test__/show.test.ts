import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

const getTicketById = (id: string) => request(app)
    .get(`/api/tickets/${id}`)
    .send()

const creatTicket = (body: { title: string, price: number }) => request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)

const getId = () => new mongoose.Types.ObjectId().toHexString();

it('should return a 404 when ticket it not found', async () => {
    const id = getId();
    await getTicketById(id)
        .expect(404)
});

it('should the ticket if ticket is found', async () => {
    const title = "title";
    const price = 123;
    const createTicketResponse = await creatTicket({ title, price })
        .expect(201)

    const response = await getTicketById(createTicketResponse.body.id);

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
});

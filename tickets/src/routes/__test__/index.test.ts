import request from 'supertest';
import { app } from '../../app';

const getTickets = () => request(app)
    .get(`/api/tickets`)
    .send()

const creatTicket = (body: { title: string, price: number }) => request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)

const creatRandomTicket = () => creatTicket({ title: "title", price: 1 })

it('should fetch all the tickets', async () => {
    await creatRandomTicket();
    await creatRandomTicket();
    await creatRandomTicket();

    const response = await getTickets();

    expect(response.status).toStrictEqual(200);
    expect(response.body.length).toStrictEqual(3);
});

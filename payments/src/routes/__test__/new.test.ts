import { OrderStatus } from '@riyazpasha/ticketing-common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { getId } from '../../test/utils';

const purchace = (data: any, cookie: string[]) => request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send(data)

it('should return a 404 when purchasing a order that doesnot exists', async () => {
    const order = {
        token: "token",
        orderId: getId(),
    }

    const response = await purchace(order, global.signin());

    expect(response.status).toBe(404);
    expect(response.body.errors[0].message).toEqual("Not Found");
});

it('should return a 401 when purchacing an order that doesnot belong to the user', async () => {
    const order = Order.build({
        id: getId(),
        version: 0,
        userId: getId(),
        status: OrderStatus.Created,
        price: 100,
    });
    await order.save();
    const placeOrder = {
        token: "token",
        orderId: order.id,
    }

    const response = await purchace(placeOrder, global.signin());

    expect(response.status).toBe(401);
    expect(response.body.errors[0].message).toEqual("Not authorized");
});

it('should return a 400 when purchacing a cancelled order', async () => {
    const userId = getId();
    const order = Order.build({
        id: getId(),
        version: 0,
        userId: userId,
        status: OrderStatus.Cancelled,
        price: 100,
    });
    await order.save();
    const placeOrder = {
        token: "token",
        orderId: order.id,
    }

    const response = await purchace(placeOrder, global.signin(userId));

    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toEqual("Can not pay for cancelled order");
});
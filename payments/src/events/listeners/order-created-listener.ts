import { Listener, OrderCreatedEvent, Subjects } from "@riyazpasha/ticketing-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            status: data.status,
            price: data.ticket.price,
        });
        await order.save();

        msg.ack();
    }
}

export {
    OrderCreatedListener,
};

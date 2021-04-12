import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@riyazpasha/ticketing-common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const delay = (new Date(data.expiresAt).getTime() - new Date().getTime());
        console.log("🚀 delay", delay)

        await expirationQueue.add({
            orderId: data.id,
        }, {
            delay
        });

        msg.ack();
    }
}

export {
    OrderCreatedListener,
};

import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findByEvent(data);
        if (!order) throw new Error("Order not found");

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}

export {
    OrderCancelledListener,
};

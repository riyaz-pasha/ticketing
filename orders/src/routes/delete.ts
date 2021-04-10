import { NotAuthorizedError, NotFoundError, requireAuth } from '@riyazpasha/ticketing-common';
import { Request, Response, Router } from "express";
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete(
    "/api/orders/:orderId",
    requireAuth,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("ticket");
        if (!order) throw new NotFoundError();
        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            }
        })

        res.status(204).send(order);
    }
)

export {
    router as deleteOrderRouter,
};

import { NotAuthorizedError, NotFoundError, requireAuth } from '@riyazpasha/ticketing-common';
import { Request, Response, Router } from "express";
import { Order } from '../models/order';

const router = Router();

router.get(
    "/api/orders/:orderId",
    requireAuth,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("ticket");
        if (!order) throw new NotFoundError();
        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
        res.send(order);
    }
)

export {
    router as showOrderRouter,
};

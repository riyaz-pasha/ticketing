import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@riyazpasha/ticketing-common';
import { Request, Response, Router } from "express";
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = Router();

router.post(
    "/api/payments",
    requireAuth,
    [
        body("token")
            .notEmpty(),
        body("orderId")
            .notEmpty()
            .withMessage("please provide a valid orderId")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) throw new NotFoundError();
        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
        if (order.status === OrderStatus.Cancelled) throw new BadRequestError("Can not pay for cancelled order");

        await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100,
            source: token,
        });

        res.status(201).send({ success: true })
    }
);

export {
    router as createChargeRouter,
};

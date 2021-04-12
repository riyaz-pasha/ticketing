import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@riyazpasha/ticketing-common';
import { Request, Response, Router } from "express";
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
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

        const stripeResponse = await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100,
            source: token,
        });
        const payment = Payment.build({
            stripeId: stripeResponse.id,
            orderId,
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            stripeId: payment.stripeId,
            orderId: payment.orderId,
        });

        res.status(201).send({ success: true })
    }
);

export {
    router as createChargeRouter,
};

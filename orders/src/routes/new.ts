import { BadRequestError, NotFoundError, requireAuth, validateRequest } from "@riyazpasha/ticketing-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
import { isValidTicketId } from "../utils/validation";

const EXPIRATION_WINDOW_SECONDS = 15 * 50;

const router = Router();

router.post(
    "/api/orders",
    requireAuth,
    [
        body("ticketId")
            .notEmpty()
            .custom(isValidTicketId)
            .withMessage("Ticket id must be provided")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) throw new NotFoundError();

        const isTicketAlreadyUsedInOtherOrders = await ticket.isReserved();
        if (isTicketAlreadyUsedInOtherOrders) throw new BadRequestError("Ticket is already reserved");

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket,
        });
        await order.save();

        res.status(201).send(order);
    }
)

export {
    router as newOrderRouter,
};

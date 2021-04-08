import { requireAuth, validateRequest } from "@riyazpasha/ticketing-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../event/pubishers/ticket-created-pubilisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
    "/api/tickets",
    requireAuth,
    [
        body("title")
            .notEmpty()
            .withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        });
        await ticket.save();
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        })
        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
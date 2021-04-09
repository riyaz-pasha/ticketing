import { requireAuth, validateRequest } from "@riyazpasha/ticketing-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { isValidTicketId } from "../utils/validation";

const router = Router();

router.get(
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
        res.send({});
    }
)

export {
    router as indexOrderRouter,
};

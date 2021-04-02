import { requireAuth, validateRequest } from "@riyazpasha/ticketing-common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";

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
    (req: Request, res: Response) => {
        res.sendStatus(200);
    }
);

export { router as createTicketRouter };
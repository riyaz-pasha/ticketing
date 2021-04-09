import { Request, Response, Router } from "express";

const router = Router();

router.post(
    "/api/orders",
    async (req: Request, res: Response) => {
    }
)

export {
    router as newOrderRouter,
};

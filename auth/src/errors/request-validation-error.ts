import { ValidationError } from "express-validator";

class RequestValidationError extends Error {

    constructor(public reasons: ValidationError[]) {
        super();

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}

export {
    RequestValidationError,
}
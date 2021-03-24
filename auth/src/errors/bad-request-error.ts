import { CustomError } from "./custom-error";

class BadRequestError extends CustomError {
    statusCode: number = 404;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }]
    }

}

export {
    BadRequestError
};

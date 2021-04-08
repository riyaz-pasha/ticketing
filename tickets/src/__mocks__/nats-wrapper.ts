const natsWrapper = {
    client: {
        publish: (subject: string, data: string, callback: () => void) => {
            callback();
        }
    }
}

export {
    natsWrapper,
};

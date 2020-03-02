'use strict';
const app = require('./app');

function handleFatalError(err) {
    console.error(`[fatal error] ${err.message}`);
    return process.exit(1);
}

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

return app.connectMongoose()
    .then(() => {
        const application = app.initialize();
        application.listen(process.env.SERVER_PORT);
        console.log(`Your server is listening on port ${process.env.SERVER_PORT}`);
    })
    .catch((err) => {
        console.error(`ERROR: ${err}`);
        return process.exit(1);
    });

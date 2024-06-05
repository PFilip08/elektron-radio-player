import schedule from "node-schedule";
import 'dotenv/config';
import {POST} from "./modules/POST.js";

POST();

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})
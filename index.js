import schedule from "node-schedule";
import 'dotenv/config';
import {POST} from "./modules/POST.js";
import {autoRemoveFiles} from "./modules/MusicDownloader.js";

POST();
autoRemoveFiles()

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})
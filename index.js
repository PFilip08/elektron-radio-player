import {checkUpdate} from "./modules/ApiConnector.js";
import {massSchedule} from "./modules/TaskScheduler.js";
import schedule, {scheduleJob} from "node-schedule";
import {autoRemoveFiles, downloader} from "./modules/MusicDownloader.js";
import 'dotenv/config';

// getApiData();
// playMusic('Malik');
// setInterval(killPlayer, 1000);
// const time = await getApiData()
// console.log(time[1][0].end.split(':').reverse().join(' '));
massSchedule()
checkUpdate();
setInterval(() => {
    checkUpdate().catch(error => {
        console.log(error);
    });
}, 5000);
// setInterval(massSchedule, 10000);

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})
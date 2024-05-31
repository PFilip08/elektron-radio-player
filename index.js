import {checkUpdate} from "./modules/ApiConnector.js";
import {massSchedule} from "./modules/TaskScheduler.js";
import schedule from "node-schedule";

// getApiData();
// playMusic('Malik');
// setInterval(killPlayer, 1000);
// const time = await getApiData()
// console.log(time[1][0].end.split(':').reverse().join(' '));
massSchedule()
checkUpdate();
setInterval(checkUpdate, 5000);
// setInterval(massSchedule, 10000);

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})
import schedule from "node-schedule";
import {killPlayer, playMusic} from "./MusicPlayer.js";
import {getApiData} from "./ApiConnector.js";

function taskNumber() {
    let n = 0
    for (let i in schedule.scheduledJobs) {
        n = n+1
    }
    return console.log('Total tasks:', n);
}

function scheduleMusicTask(time, file) {
    schedule.scheduleJob(time, function () {
        playMusic(file);
        console.log(file)
    });
}

function scheduleKillTask(time) {
    schedule.scheduleJob(time, killPlayer);
}

async function massSchedule() {
    await schedule.gracefulShutdown();
    const data = await getApiData();
    if (!data.isOn) {
        taskNumber();
        return console.error('Missing data')
    }
    const time = data.timeRules.rules[1];
    const day = data.timeRules.applyRule;
    const dayMapping = {
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
        Sun: 7
    };

    const mappedDays = {};

    for (const i in day) {
        if (day.hasOwnProperty(i)) {
            const mappedDay = dayMapping[i];
            mappedDays[mappedDay] = day[i];
        }
    }

    for (let l in mappedDays) {
        if (mappedDays[l] === 1) {
            // console.log(mappedDays[l])
            for (let i in time) {
                // console.log(data[1][i].start.split(':').reverse().join(' '));
                // console.log(data[1][i].end.split(':').reverse().join(' '));
                scheduleMusicTask(`${time[i].start.split(':').reverse().join(' ')} * * ${l}`, 'Twilight');
                scheduleKillTask(`${time[i].end.split(':').reverse().join(' ')} * * ${l}`);
            }
        }
    }
    // console.log(time, day);

    scheduleMusicTask(`18 17 * * 1-5`, 'Twilight');
    scheduleKillTask(`19 17 * * 1-5`);
    taskNumber();
}

export { scheduleMusicTask, scheduleKillTask, massSchedule };
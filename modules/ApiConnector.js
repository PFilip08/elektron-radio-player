import axios from 'axios';
import {Agent} from "node:https";
import {massSchedule} from "./TaskScheduler.js";
let url = 'https://radio-elektron.vercel.app/api/timeTables';
let previousData = null;

const api = axios.create({
    httpsAgent: new Agent({
        rejectUnauthorized: false,
    }),
    headers: {
        'User-Agent': 'Radio-Elektron_SAW_MONITORING v1.0'
    }
});

// async function getApiData() {
//     api.get(url)
//         .then(res => console.log(res.data.timeTable[0].timeRules.rules))
//         .catch(err=>console.log(err));
// }

async function getApiData() {
    return await api.get(url)
        .then(res => {
            if (res.data.timeTable[0].isOn === false) {
                return {isOn: false};
            }
            return res.data.timeTable[0];
        })
        .catch(err=>console.log(err));
}

async function checkUpdate() {
    try {
        const currentData = await getApiData();

        if (previousData && JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            massSchedule();
            console.log('updated');
        }

        previousData = currentData;
    } catch (error) {
        console.error('Błąd podczas odpytywania API:', error);
    }
}

export {getApiData, checkUpdate};
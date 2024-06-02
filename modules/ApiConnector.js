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
        .catch(err=>{
            // console.log(err);
            console.log('Recovery mode activated!!!');
            // let res =
            let res = {"static":true,"isOn":true,"currentPlaylistId":1,"timeRules":{"rules":{"1":[{"end":"07:10","start":"07:07"},{"end":"08:00","start":"07:55"},{"end":"08:50","start":"08:45"},{"end":"09:45","start":"09:35"},{"end":"10:35","start":"10:30"},{"end":"11:40","start":"11:20"},{"end":"12:30","start":"12:25"},{"end":"13:20","start":"13:15"},{"end":"14:10","start":"14:05"},{"end":"14:55","start":"15:00"},{"end":"15:50","start":"15:45"}]},"applyRule":{"Fri":1,"Mon":1,"Sat":0,"Sun":0,"Thu":1,"Tue":1,"Wed":1}}};
            if (previousData !== null) {
                res = previousData;
                console.log('Using cached data.');
            }
            return res;
        });
}

async function checkUpdate() {
    try {
        const currentData = await getApiData();

        if (currentData.static) {
            console.log('Using static data.');
            return;
        }

        if (previousData && JSON.stringify(currentData) !== JSON.stringify(previousData)) {
            massSchedule();
            console.log('--------Check Update--------')
            console.log('Updated');
            console.log('--------Check Update--------')
        }

        previousData = currentData;
    } catch (error) {
        console.log('--------Check Update--------')
        console.error('Błąd podczas odpytywania API:', error);
        console.log('--------Check Update--------')
    }
}

export {getApiData, checkUpdate};
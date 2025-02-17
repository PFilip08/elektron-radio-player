const counterDiv = document.getElementById('counter');
let cachedData = null;

async function getCounterData() {
    try {
        if (!cachedData) {
            const res = await fetch('/stats/data');
            cachedData = await res.json();
        }
        return cachedData;
    } catch (e) {
        console.error('Błąd podczas pobierania danych:', e);
        return 'taboret';
    }
}

async function sortData() {
    const data = await getCounterData()
    if (!data.isOn) {
        return 'taboret';
    }
    // const time = data.timeRules.rules;
    const day = data.timeRules.applyRule;
    const currentPlaylist = data.currentPlaylistId;
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
    const today = new Date().toLocaleString('en-US', { weekday: 'short' });
    // const today = 'Fri';
    const ruleNumber = data.timeRules.applyRule[today] || 0;
    if (ruleNumber === 0) {
        // console.log(`Dziś (${today}) nie obowiązuje żadna reguła.`);
        return { today, ruleNumber, currentPlaylist };
    }

    const timeRules = data.timeRules.rules[ruleNumber] || [];

    // console.log(`Dziś jest ${today} (${ruleNumber}). Obowiązujące godziny:`, timeRules);
    return { today, ruleNumber, timeRules, currentPlaylist };
}

async function todayData() {
    const data = await sortData(); // data { today, ruleNumber, timeRules, currentPlaylist }
    if (!data) return 'Brak danych';

    const days = {
        Mon: 'Poniedziałek',
        Tue: 'Wtorek',
        Wed: 'Środa',
        Thu: 'Czwartek',
        Fri: 'Piątek',
        Sat: 'Sobota',
        Sun: 'Niedziela'
    };

    const today = days[data.today];
    const timeRules = data.timeRules;
    const currentDate = new Date();

    const getTimeToNextRule = (currentDate, rule) => {
        const startTime = parseTime(rule.start);
        const endTime = parseTime(rule.end);
        const remainingMs = (currentDate >= startTime && currentDate <= endTime)
            ? endTime - currentDate
            : startTime - currentDate;

        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

        return {
            time: `${remainingMinutes} min ${remainingSeconds} sek`,
            isInRule: currentDate >= startTime && currentDate <= endTime,
            whole: remainingMs
        };
    };

    let currentRule = null;
    let timeToNextRule = null;

    if (timeRules) {
        for (const rule of timeRules) {
            const { time, isInRule, whole } = getTimeToNextRule(currentDate, rule);

            if (isInRule) {
                currentRule = rule;
                timeToNextRule = `Lekcja za: ${time}`;
                if (whole < 0) timeToNextRule = 'taboret';
                break;
            } else if (!currentRule || rule.start > currentRule.start && rule.start) {
                currentRule = rule;
                timeToNextRule = `Przerwa za: ${time}`;
                if (whole < 0) timeToNextRule = 'taboret';
            }
        }
    } else timeToNextRule = 'taboret';

    if (currentRule) {
        const ruleStart = currentRule.start;
        const ruleEnd = currentRule.end;
        // console.log(`Dziś (${today}) najbliższa reguła zaczyna się o ${ruleStart} i kończy o ${ruleEnd}`);
        // console.log(timeToNextRule);
        return { today, timeToNextRule, data, currentRule };
    } else {
        // console.log(`Brak reguł na dzisiaj (${today})`);
        return { today, timeToNextRule, data };
    }
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

async function replaceCounterData() {
    const data = await todayData();
    let timeToNextRule = data.timeToNextRule;
    if (data.timeToNextRule === 'taboret') {
        timeToNextRule = 'Brak danych';
        data.currentRule = null;
    }
    // console.log(data);
    if(data.data === 'taboret') return counterDiv.innerHTML = 'Radio off';
    counterDiv.innerHTML = `
    <span class="playlist">Główna playlista: ${data.data.currentPlaylist}</span>
    <span class="day">Dziś jest <span class="day2">${data.today}</span>.</span>
    <span class="rule">${timeToNextRule}</span>
    ${data.currentRule ? data.currentRule.playlist ? `<span>Playlista: ${data.currentRule.playlist}</span>` : '' : ''}
    `;
}

async function checkCounterUpdate() {
    try {
        const currentData = await getCounterData();
        if (cachedData && JSON.stringify(currentData) !== JSON.stringify(cachedData)) {
            await replaceCounterData();
            cachedData = currentData;
        }
    } catch (error) {
        console.error(`Błąd podczas odpytywania API: ${error}`);
    }
}


replaceCounterData().then(r => r);
// setInterval(replaceCounterData, 1000);
setInterval(checkCounterUpdate, 900000);
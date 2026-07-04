async function getData() {
    const wzmakUri = "/power/wzmak?action=status";
    const mixerUri = "/power/mixer?action=status";

    const wzmakFetch = await fetch(wzmakUri);
    const mixerFetch = await fetch(mixerUri);
    const wzmakData = await wzmakFetch.json();
    const mixerData = await mixerFetch.json();

    return [wzmakData, mixerData];
}

async function parseData() {
    const data = await getData();
    /*
    data:
    0 - wzmakData
    1 - mixerData
    */
    // console.log(data[0]);
    const wzmakData = data[0];
    const wzmakVoltage = wzmakData.Voltage.toFixed(2);
    const wzmakCurrent = wzmakData.Current.toFixed(3);
    const wzmakPower = wzmakData.Power.toFixed(2);
    const wzmakConsumptionYesterday = wzmakData.Yesterday.toFixed(2);
    const wzmakConsumptionTotal = wzmakData.ConsumptionTotal.toFixed(2);

    const mixerData = data[1];
    const mixerVoltage = mixerData.Voltage.toFixed(2);
    const mixerCurrent = mixerData.Current.toFixed(3);
    const mixerPower = mixerData.Power.toFixed(2);
    const mixerConsumptionYesterday = mixerData.Yesterday.toFixed(2);
    const mixerConsumptionTotal = mixerData.ConsumptionTotal.toFixed(2);

    const wzmak = [wzmakVoltage, wzmakCurrent, wzmakPower, wzmakConsumptionYesterday, wzmakConsumptionTotal];
    const mixer = [mixerVoltage, mixerCurrent, mixerPower, mixerConsumptionYesterday, mixerConsumptionTotal];

    return {wzmak, mixer};
}

async function replaceText() {
    const data = await parseData();
    /*
    data:
    wzmak
    mixer

    layout:
    0 - Voltage
    1 - Current
    2 - Power
    3 - ConsYesterday
    4 - ConsTotal
    */
    const wzmakVoltage = document.getElementById("wzmakVoltage");
    const wzmakCurrent = document.getElementById("wzmakCurrent");
    const wzmakPower = document.getElementById("wzmakPower");
    const wzmakConsumptionYesterday = document.getElementById("wzmakConsumptionYesterday");
    const wzmakConsumptionTotal = document.getElementById("wzmakConsumptionTotal");

    const mixerVoltage = document.getElementById("mixerVoltage");
    const mixerCurrent = document.getElementById("mixerCurrent");
    const mixerPower = document.getElementById("mixerPower");
    const mixerConsumptionYesterday = document.getElementById("mixerConsumptionYesterday");
    const mixerConsumptionTotal = document.getElementById("mixerConsumptionTotal");

    wzmakVoltage.innerText = data.wzmak[0]+'V';
    wzmakCurrent.innerText = data.wzmak[1]+'A';
    wzmakPower.innerText = data.wzmak[2]+'W';
    wzmakConsumptionYesterday.innerText = data.wzmak[3]+'Wh';
    wzmakConsumptionTotal.innerText = data.wzmak[4]+'Wh';

    mixerVoltage.innerText = data.mixer[0]+'V';
    mixerCurrent.innerText = data.mixer[1]+'A';
    mixerPower.innerText = data.mixer[2]+'W';
    mixerConsumptionYesterday.innerText = data.mixer[3]+'Wh';
    mixerConsumptionTotal.innerText = data.mixer[4]+'Wh';
}

replaceText()
setInterval(replaceText, 1000);
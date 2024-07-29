console.log('dupa');

async function getData() {
    const uri = "/stats/api";
    const response = await fetch(uri);
    const responseJson = await response.json();
    // console.log(responseJson);

    return responseJson;
}

async function parseData() {
    const data = await getData();
    /*
    data:
    0 - cpus
    1 - totalmem
    2 - freemem
    3 - uptime
     */
    // console.log(data[0]);
    let cpus = data[0];
    let totalmem = data[1] / 1024 / 1024 / 1024;
    let freemem = data[2] / 1024 / 1024 / 1024;
    let uptime = new Date(data[3] * 1000).toISOString().substring(11, 19).split(':');
    uptime = uptime[0]+'h '+uptime[1]+'m '+uptime[2]+'s ';

    return [cpus, totalmem, freemem, uptime];
}

async function replaceText() {
    const data = await parseData();
    /*
    data:
    0 - cpus
    1 - totalmem
    2 - freemem
    3 - uptime
     */
    const cpu = document.getElementById("cpu");
    const mem = document.getElementById("mem");
    const uptime = document.getElementById("uptime");

    cpu.innerText = data[0].length + ' Cores';
    mem.innerText = data[1].toFixed(1)+' GiB / '+data[2].toFixed(2)+' GiB';
    uptime.innerText = data[3];
}

replaceText()
setInterval(replaceText, 1000);
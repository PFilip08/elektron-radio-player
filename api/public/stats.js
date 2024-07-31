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
    4 - loadavg
    */
    // console.log(data[0]);
    let cpus = data[0];
    let totalmem = data[1] / 1024 / 1024 / 1024;
    let freemem = data[2] / 1024 / 1024 / 1024;
    let uptime = new Date(data[3] * 1000).toISOString().substring(8, 19).split('T');
    uptime = [Number(uptime[0])-1, uptime[1].split(':')];
    uptime = uptime[0]+'d '+uptime[1][0]+'h '+uptime[1][1]+'m '+uptime[1][2]+'s ';
    let loadavg = data[4].join(', ');

    return [cpus, totalmem, freemem, uptime, loadavg];
}

async function replaceText() {
    const data = await parseData();
    /*
    data:
    0 - cpus
    1 - totalmem
    2 - freemem
    3 - uptime
    4 - loadavg
    */
    const cpu = document.getElementById("cpu");
    const mem = document.getElementById("mem");
    const uptime = document.getElementById("uptime");

    cpu.innerText = data[0].length + ' Cores; '+data[4];
    mem.innerText = data[2].toFixed(1)+' GiB / '+data[1].toFixed(2)+' GiB';
    uptime.innerText = data[3];
}

replaceText()
setInterval(replaceText, 1000);
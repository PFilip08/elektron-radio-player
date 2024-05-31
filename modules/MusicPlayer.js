import { exec } from 'child_process';
import * as path from "path";

async function playMusic(filename) {
    // const stream = fs.createReadStream('./Twilight.mp3');
    const buffer = await path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc --one-instance --play-and-exit ${buffer}`);

    console.log(buffer)
    console.log('Music playing...');
}

function killPlayer() {
    exec(`cvlc --one-instance vlc://quit`);

    console.log('Player killed');
}
export { playMusic, killPlayer };
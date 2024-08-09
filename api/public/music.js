function kastracja(input) {
    return input.split(' ').join('_').replace(/[^a-zA-Z_0-9-\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g, "");
}

async function getData() {
    let playlista = 3;
    const urlPlaying = '/status/query/playing';
    const urlPlaylists = '/status/query/playlist/list';

    const playing = await fetch(urlPlaying);
    const playlists = await fetch(urlPlaylists);

    /*
    data:
    0 - Current playing song
    1 - All playlists
     */
    return [await playing.json(), await playlists.json()];
}

async function getSongs(playlista){
    const urlSongs = '/status/query/playlist/songs?id='+playlista;
    const songs = await fetch(urlSongs);
    return await songs.json();
}

function clearTable(table) {
    // Usuwanie starych wpisów
    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

async function replacePlaylists(data) {
    if (JSON.stringify(data[1]) === JSON.stringify(previousPlaylists)) return;
    const playlistsTable = document.getElementById('playlists');
    clearTable(playlistsTable);

    // Tworzenie nowych wpisów
    for (let i = 0; i < data[1].playlistList.length; i++) {
        const row = playlistsTable.insertRow(-1);
        row.insertCell(0).innerText = data[1].playlistList[i];
        row.insertCell(1).innerText = data[1].playlistNames[i+1];
    }
    previousPlaylists = data[1];
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

let previousPlaylists, previousSongs, currentSongData, previousSong, progressInterval = null;
let playlista, id, oldRowId;

async function replaceData() {
    const data = await getData();
    /*
    data:
    0 - playing
    1 - playlists
     */

    await replacePlaylists(data);

    if (previousSong !== data[0].playingSongName) {
        for (let i in data[1].playlistNames) {
            if (!(!isNaN(Number(data[1].playlistList[i-1])) && data[1].playlistList[i-1].trim() !== '')) continue;
            // console.log(i)
            // console.log(data[1].playlistList[i-1])
            const playlist = await getSongs(i);
            for (let j in playlist.playlistSongsName) {
                // console.log(kastracja(playlist.playlistSongsName[j].title))
                // console.log(kastracja(data[0].playingSongName))
                if (kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].title))) {
                    // console.log(data[1].playlistNames[i]);
                    // console.log(i)
                    id=i
                    break;
                }
            }
        }
        previousSong = data[0].playingSongName;
    }
    if (id) playlista = await getSongs(id);

    const currentPlaylist = document.getElementById('currentPlaylist');

    if (JSON.stringify(playlista) !== JSON.stringify(previousSongs)) {
        const songsTable = document.getElementById('songlist');
        clearTable(songsTable);
        if (!playlista) {
            const row = songsTable.insertRow(-1);
            row.insertCell(0).innerText = 'brak danych';
            row.insertCell(1).innerText = 'brak danych';
            currentPlaylist.innerText = '---';
            return;
        }
        const playlistsTable = document.getElementById('playlists');
        if (oldRowId) {
            playlistsTable.rows[oldRowId].style.removeProperty('color');
            playlistsTable.rows[oldRowId].style.removeProperty('background-color');
        }
        playlistsTable.rows[id].style.color = 'cyan';
        playlistsTable.rows[id].style.backgroundColor = 'yellowgreen';
        for (let i = 0; i < playlista.playlistSongsName.length; i++) {
            const row = songsTable.insertRow(-1);
            row.insertCell(0).innerText = playlista.playlistSongsName[i].title;
            row.insertCell(1).innerText = playlista.playlistSongsName[i].artist;
        }
        oldRowId = id;
        previousSongs = playlista;
    }

    const songName = document.getElementById('songName');
    const songArtist = document.getElementById('songArtist');
    const duration = document.getElementById('duration');
    const durationText = document.getElementById('durationText');

    duration.value = data[0].time.played;
    duration.max = data[0].time.toPlay;

    if (!currentSongData || currentSongData.playingSongName !== data[0].playingSongName) {
        // songName.innerText = data[0].playingSongName;
        if (!playlista) {
            songName.innerText = '--------------';
            songArtist.innerText = '----------';
            currentPlaylist.innerText = '---';
            return;
        }
        currentPlaylist.innerText = id+` (${data[1].playlistNames[id]})`;
        for (let i in playlista.playlistSongsName) {
            if (kastracja(data[0].playingSongName).includes(kastracja(playlista.playlistSongsName[i].title))) {
                songName.innerText = playlista.playlistSongsName[i].title;
                songArtist.innerText = playlista.playlistSongsName[i].artist;
                break;
            } else {
                songArtist.innerText = 'brak danych';
            }
        }
        duration.value = data[0].time.played;
        duration.max = data[0].time.toPlay;

        const playedFormatted = formatTime(data[0].time.played);
        const toPlayFormatted = formatTime(data[0].time.toPlay);
        durationText.innerText = `${playedFormatted} / ${toPlayFormatted}`;


        currentSongData = data[0]; // Przechowuj dane o obecnej piosence
        startProgressBar(duration); // Uruchom aktualizację progress baru
    }
}

function startProgressBar(duration) {
    if (progressInterval) {
        clearInterval(progressInterval);
    }

    progressInterval = setInterval(() => {
        if (duration.value < duration.max) {
            duration.value = parseFloat(duration.value) + 1;
            durationText.innerText = `${formatTime(duration.value)} / ${formatTime(duration.max)}`;
        } else {
            clearInterval(progressInterval); // Zatrzymaj, gdy utwór się skończy
        }
    }, 1000);
}

replaceData().then(r => r);
setInterval(replaceData, 5000);
function kastracja(input) {
    if (!input) return '';
    return input
        .toLowerCase()
        .split(' ').join('_')
        .replace(/[^a-z0-9_\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g, "");
}

async function getData() {
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
let playlista, id, oldRowId, intervalReset, noDataCounter, cover;
let isProcessing = false;

async function replaceData() {
    if (isProcessing) {console.log('slowdown'); return;}
    isProcessing = true;

    try {
        const data = await getData();
        /*
        data:
        0 - playing
        1 - playlists
         */
        const songName = document.getElementById('songName');
        const songArtist = document.getElementById('songArtist');
        const duration = document.getElementById('duration');
        const durationText = document.getElementById('durationText');
        const currentPlaylist = document.getElementById('currentPlaylist');
        const playlistsTable = document.getElementById('playlists');
        const songsTable = document.getElementById('songlist');
        const coverCover = document.getElementById('cover');

        await replacePlaylists(data);

        if (!data[0].isPlaying) {
            //songName.innerText = '--------------';
            updateSongName('--------------');
            songArtist.innerText = '----------';
            currentPlaylist.innerText = '---';
            durationText.innerText = '';
            coverCover.src = "../images/taboret.png";
            clearInterval(progressInterval);
            clearTable(songsTable);
            const row = songsTable.insertRow(-1);
            row.insertCell(0).innerText = 'brak danych';
            row.insertCell(1).innerText = 'brak danych';
            if (oldRowId) {
                playlistsTable.rows[oldRowId].style.removeProperty('color');
                playlistsTable.rows[oldRowId].style.removeProperty('background-color');
            }
            currentSongData = null;
            return;
        }

        if (previousSong !== data[0].playingSongName) {
            // console.log("Zmiana piosenki")
            krzeslo:
                for (let i in data[1].playlistNames) {
                    // console.log(data[1].playlistList);
                    // if (!(!isNaN(Number(data[1].playlistList[i-1])) && data[1].playlistList[i-1].trim() !== '')) continue;
                    // console.log(i)
                    // console.log(data[1].playlistList[i-1])
                    let playlist;
                    try {
                        playlist = await getSongs(data[1].playlistList[i - 1]);
                    } catch (e) {
                        id = null;
                        break;
                    }
                    for (let j in playlist.playlistSongsName) {
                        // console.log(kastracja(playlist.playlistSongsName[j].title))
                        // console.log(playlist.playlistSongsName[j])
                        // console.log(kastracja(data[0].playingSongName))
                        // console.log("--------------------------------")
                        // console.log("Playlista nr %s",i)
                        // console.log("Nazwa muzyki: %s", kastracja(data[0].playingSongName))
                        // console.log("Nazwa piosenki z playlisty: %s",kastracja(playlist.playlistSongsName[j].title))
                        // console.log("Nazwa artysty z playlisty: %s",kastracja(playlist.playlistSongsName[j].artist))
                        // console.log("Warunki:")
                        // console.log("Warunek nr 1: %s",kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].title)))
                        // console.log("Warunek nr 2: %s",kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].artist)))
                        // console.log("--------------------------------")
                        if (kastracja(playlist.playlistSongsName[j].filePath).includes(kastracja(data[0].playingSongName))) {
                            id = i;
                            //console.log(playlist.playlistSongsName[j].coverData)
                            if (playlist.playlistSongsName[j].coverData !== 'taboret' && playlist.playlistSongsName[j].coverData !== undefined){
                                cover = `data:${playlist.playlistSongsName[j].coverData.format};base64,${playlist.playlistSongsName[j].coverData.data}`;
                            } else {
                                cover = "../images/taboret.png";
                            }
                            break krzeslo;
                        } else if ((kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].title)) && kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].artist)))) {
                            // console.log(data[1].playlistNames[i]);
                            // console.log(i)
                            id = i;
                            if (playlist.playlistSongsName[j].coverData !== 'taboret'){
                                cover = `data:${playlist.playlistSongsName[j].coverData.format};base64,${playlist.playlistSongsName[j].coverData.data}`;
                            } else {
                                cover = "../images/taboret.png";
                            }
                            break krzeslo;
                        } else {
                            id = null;
                            cover = "../images/taboret.png";
                        }
                    }
                }
            if (id === null) {
                let playlist;
                playlist = await getSongs('onDemand');
                for (let j in playlist.playlistSongsName) {
                    // console.log("--------------------------------")
                    // console.log("onDemand")
                    // console.log("Nazwa muzyki: %s", kastracja(data[0].playingSongName))
                    // console.log("Nazwa artysty z playlisty: %s",kastracja(playlist.playlistSongsName[j].artist))
                    // console.log("Warunki:")
                    // console.log("Warunek nr 1: %s",kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].title)))
                    // console.log("Warunek nr 2: %s",kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].artist)))
                    // console.log("--------------------------------")
                    if ((kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].title))) && kastracja(data[0].playingSongName).includes(kastracja(playlist.playlistSongsName[j].artist))) {
                        id = 'onDemand';
                        if (playlist.playlistSongsName[j].coverData !== 'taboret'){
                            cover = `data:${playlist.playlistSongsName[j].coverData.format};base64,${playlist.playlistSongsName[j].coverData.data}`;
                        } else {
                            cover = "../images/taboret.png";
                        }
                        break;
                    } else {
                        id = null;
                        cover = "../images/taboret.png";
                    }
                }
            }
            previousSong = data[0].playingSongName;
        }
        if (id === 'onDemand') {
            playlista = await getSongs(id);
            noDataCounter = true;
        } else if (id) playlista = await getSongs(data[1].playlistList[id - 1]);
        noDataCounter = true;

        coverCover.src = cover;

        if (!playlista) {
            if (!noDataCounter) {
                clearTable(songsTable);
                const row = songsTable.insertRow(-1);
                row.insertCell(0).innerText = 'brak danych';
                row.insertCell(1).innerText = 'brak danych';
                noDataCounter = true;
            }
            currentPlaylist.innerText = '---';
            if (oldRowId) {
                playlistsTable.rows[oldRowId].style.removeProperty('color');
                playlistsTable.rows[oldRowId].style.removeProperty('background-color');
            }
        }

        if (JSON.stringify(playlista) !== JSON.stringify(previousSongs)) {
            clearTable(songsTable);
            if (oldRowId) {
                playlistsTable.rows[oldRowId].style.removeProperty('color');
                playlistsTable.rows[oldRowId].style.removeProperty('background-color');
            }
            if (id !== 'onDemand') {
                playlistsTable.rows[id].style.color = 'cyan';
                playlistsTable.rows[id].style.backgroundColor = 'yellowgreen';
                oldRowId = id;
            }
            for (let i = 0; i < playlista.playlistSongsName.length; i++) {
                const row = songsTable.insertRow(-1);
                row.insertCell(0).innerText = playlista.playlistSongsName[i].title;
                row.insertCell(1).innerText = playlista.playlistSongsName[i].artist;
            }
            previousSongs = playlista;
        }

        if (intervalReset) {
            startProgressBar(duration);
        }

        duration.value = data[0].time.played;
        duration.max = data[0].time.toPlay;

        if (!currentSongData || currentSongData.playingSongName !== data[0].playingSongName) {
            if (data[0].playingSongName && !id) {
                updateSongName(data[0].playingSongName);
                songArtist.innerText = 'nieznane';
                currentPlaylist.innerText = 'nieznane';
                if (oldRowId) {
                    playlistsTable.rows[oldRowId].style.removeProperty('color');
                    playlistsTable.rows[oldRowId].style.removeProperty('background-color');
                }
                clearTable(songsTable);
                const row = songsTable.insertRow(-1);
                row.insertCell(0).innerText = 'brak danych';
                row.insertCell(1).innerText = 'brak danych';
                noDataCounter = true;
                startProgressBar(duration);
                return;
            }
            if (!playlista) {
                //songName.innerText = '--------------';
                updateSongName('--------------');
                songArtist.innerText = '----------';
                currentPlaylist.innerText = '---';
                return;
            }
            currentPlaylist.innerText = id + ` (${data[1].playlistNames[id]})`;
            if (id === 'onDemand') currentPlaylist.innerText = id;
            for (let i in playlista.playlistSongsName) {
                // console.log("--------------------------------")
                // console.log(i)
                // console.log("Nazwa muzyki: %s", kastracja(data[0].playingSongName))
                // console.log("Nazwa artysty z playlisty: %s",kastracja(playlista.playlistSongsName[i].artist))
                // console.log("Warunki:")
                // console.log("Warunek nr 1: %s",kastracja(data[0].playingSongName).includes(kastracja(playlista.playlistSongsName[i].title)))
                // console.log("Warunek nr 2: %s",kastracja(data[0].playingSongName).includes(kastracja(playlista.playlistSongsName[i].artist)))
                // console.log("--------------------------------")
                if (kastracja(playlista.playlistSongsName[i].filePath).includes(kastracja(data[0].playingSongName))) {
                    updateSongName(playlista.playlistSongsName[i].title);
                    songArtist.innerText = playlista.playlistSongsName[i].artist;
                    break;
                } else if ((kastracja(data[0].playingSongName).includes(kastracja(playlista.playlistSongsName[i].title))) && kastracja(data[0].playingSongName).includes(kastracja(playlista.playlistSongsName[i].artist))) {
                    //songName.innerText = playlista.playlistSongsName[i].title;
                    updateSongName(playlista.playlistSongsName[i].title);
                    songArtist.innerText = playlista.playlistSongsName[i].artist;
                    break;
                } else {
                    songArtist.innerText = 'brak danych';
                }
            }

            const playedFormatted = formatTime(data[0].time.played);
            const toPlayFormatted = formatTime(data[0].time.toPlay);
            durationText.innerText = `${playedFormatted} / ${toPlayFormatted}`;


            currentSongData = data[0];
            startProgressBar(duration);
        }
    } catch (e) {
        console.log(e);
    } finally {
        isProcessing = false;
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
            intervalReset=false;
        } else {
            clearInterval(progressInterval);
            duration.value = 0;
            intervalReset=true;
        }
    }, 1000);
}

function updateSongName(text) {
    const songNameElement = document.getElementById('songName');
    const marqueeContent = songNameElement.parentElement;

    songName.innerText = text;

    const songNameWidth = songNameElement.scrollWidth;
    const marqueeContainerWidth = marqueeContent.parentElement.offsetWidth;
    if (songNameWidth > marqueeContainerWidth) {
        //console.log('scrolluj');
        marqueeContent.classList.add('scroll');
    } else {
        //console.log('nie scrolluj');
        marqueeContent.classList.remove('scroll');
    }
}

replaceData().then(r => r);
setInterval(replaceData, 5000);
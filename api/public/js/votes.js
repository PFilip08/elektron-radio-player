console.log('Inicjowanie tworzenia trzyfazowego połączenie multibinarnego do cewki komutatora pokrywy bulbulatora');

const spotifyRegex = /^(?:https?:\/\/)?(?:www\.)?(?:open\.spotify\.com|spotify\.com)\/.+$/;
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|music\.youtube\.com|youtu\.be)\/.+$/;

function getURIType(url) {
    if (spotifyRegex.test(url)) {
        return "spotify";
    } else if (youtubeRegex.test(url)) {
        return "yt";
    } else {
        return "ni ma";
    }
}

async function fetchVotes() {
    try {
        const response = await fetch('/votes/get');
        const votes = await response.json();

        const tableBody = document.querySelector('#votesTable tbody');
        tableBody.innerHTML = '';

        const dateVotes = document.getElementById('date');
        let date = '1970-01-01';
        if (votes[0]) date = votes[0].created_at;
        dateVotes.innerHTML = date;

        votes.forEach(vote => {
            const row = document.createElement('tr');
            let explicit = String();
            let service = 'taboret';
            if (vote.uSongs.explicit) {
                explicit = `<img src="../images/explicit.gif" alt="explicit" width="50px" style="position: absolute; right: 0;"/>`;
            }
            if (vote.uSongs.url) {
                let type = getURIType(vote.uSongs.url);
                if (type === 'spotify') {
                    service = `<img src="../images/spotify.png" alt="spotify" width="24px" style="position: absolute; transform: translate(-50%, -50%);"/>`;
                } else if (type === 'yt') {
                    service = `<img src="../images/yt.png" alt="youtube" width="26px" style="position: absolute; transform: translate(-50%, -50%);"/>`;
                }
            }

            row.innerHTML = `
        <td>${vote.id}</td>
        <td style="position: relative;">${vote.uSongs.title+explicit || 'Przekorny Los'}</td>
        <td>${vote.uSongs.artist || 'Akcent'}</td>
        <td>${vote.uSongs.duration || `21:37`}</td>
        <td>${service}</td>
        <td>
          <button onclick="delVote(${vote.id})">Usuń</button>
        </td>
      `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Błąd podczas pobierania głosów:', error);
    }
}

async function delVote(voteId) {
    try {
        const response = await fetch(`/votes/del/${voteId}`, {
            method: 'DELETE'
        });

        if (response.ok) await fetchVotes();
    } catch (error) {
        console.error('Błąd podczas usuwania głosu:', error);
    }
}

async function save() {
    try {
        const response = await fetch(`/votes/save`);
        await fetchVotes();
        if (response.ok) return 'git';
    } catch (error) {
        console.error('Błąd podczas zapisywania:', error);
    }
}

async function reset() {
    try {
        const response = await fetch(`/votes/reset`);
        await fetchVotes();
        if (response.ok) return 'git';
    } catch (error) {
        console.error('Błąd podczas resetu:', error);
    }
}

window.onload = fetchVotes;
console.log('Inicjowanie tworzenia trzyfazowego połączenie multibinarnego do cewki komutatora pokrywy bulbulatora');

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
            if (vote.uSongs.explicit) {
                explicit = `<img src="../images/explicit.gif" alt="explicit" width="50px" style="position: absolute; right: 0;"/>`;
            }

            row.innerHTML = `
        <td>${vote.id}</td>
        <td style="position: relative;">${vote.uSongs.title+explicit || 'Przekorny Los'}</td>
        <td>${vote.uSongs.artist || 'Akcent'}</td>
        <td>${vote.uSongs.duration || `21:37`}</td>
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
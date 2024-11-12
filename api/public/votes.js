console.log('Inicjowanie tworzenia trzyfazowego połączenie multibinarnego do cewki komutatora pokrywy bulbulatora');

async function fetchVotes() {
    try {
        const response = await fetch('/votes/get');
        const votes = await response.json();

        const tableBody = document.querySelector('#votesTable tbody');
        tableBody.innerHTML = '';

        votes.forEach(vote => {
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${vote.id}</td>
        <td>${vote.uSongs.title || 'Przekorny Los'}</td>
        <td>${vote.uSongs.artist || 'Akcent'}</td>
        <td>${vote.uSongs.duration || '21:37'}</td>
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
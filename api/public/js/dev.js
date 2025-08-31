function performAction(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const iframe = document.getElementById('res');
    fetch(`${url}?${queryString}`, { method: 'GET' })
        .then(response => response.text())
        .then(data => {
            console.log('Akcja wykonana:', data);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(data);
            iframe.contentWindow.document.close();
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas wykonywania akcji.\nSkontaktuj się z Działem Taboretów.');
        });
}

function removeTask(taskName) {
    if (confirm('Czy na pewno chcesz usunąć zadanie: ' + taskName + '?')) {
        performAction('/dev/schedules/removeTask', { name: taskName });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Funkcje przeniesione z devapi.ejs
function showMessage(message) {
    const iframe = window.frames.res;
    if (iframe && iframe.document) {
        iframe.document.open();
        iframe.document.write(`<html><head><style>body{font-family:Arial,sans-serif;padding:10px;background:#f5f5f5;color:#333}</style></head><body><p>${message}</p></body></html>`);
        iframe.document.close();
    }
}

// DevAPI Management Functions
function toggleDevAPI(state) {
    fetch(`/dev/api?action=${state}`)
        .then(response => response.json())
        .then(data => {
            updateStatusIndicator(data.devAPIEnabled);
            showMessage(data.message);
        })
        .catch(error => {
            console.error('Error trykania DevAPI:', error);
            showMessage('Error trykania DevAPI: ' + error.message);
        });
}

function checkDevAPIStatus() {
    fetch('/dev/api?action=status')
        .then(response => response.json())
        .then(data => {
            updateStatusIndicator(data.devAPIEnabled);
            showMessage('DevAPI Status: ' + (data.devAPIEnabled ? 'ENABLED' : 'DISABLED'));
        })
        .catch(error => {
            console.error('Error sprawdzania statusu:', error);
            updateStatusIndicator(null, 'Error');
        });
}

function rescheduleTasksNow() {
    fetch('/dev/api?action=reschedule')
        .then(response => response.json())
        .then(data => {
            showMessage(data.message);
        })
        .catch(error => {
            console.error('Error reschedulowania tasków:', error);
            showMessage('Error reschedulowania tasków: ' + error.message);
        });
}

function updateStatusIndicator(enabled, errorMsg = null) {
    const indicator = document.getElementById('status-indicator');
    const container = document.getElementById('devapi-status');

    if (errorMsg) {
        indicator.textContent = errorMsg;
        container.className = 'devapi-status';
        return;
    }

    if (enabled) {
        indicator.textContent = 'ENABLED - Overriding partyvote.ciac.me';
        container.className = 'devapi-status enabled';
    } else {
        indicator.textContent = 'DISABLED - Using partyvote.ciac.me';
        container.className = 'devapi-status disabled';
    }
}

function updateTimeTables() {
    const timeRules = {
        rules: { "1": [] },
        applyRule: {}
    };

    document.querySelectorAll('input[name="day"]').forEach(checkbox => {
        timeRules.applyRule[checkbox.value] = checkbox.checked ? 1 : 0;
    });

    document.querySelectorAll('.time-rule-entry').forEach(entry => {
        const start = entry.querySelector('.rule-start').value;
        const end = entry.querySelector('.rule-end').value;
        if (start && end) {
            timeRules.rules["1"].push({ start, end });
        }
    });

    const data = {
        isOn: document.querySelector('input[name="isOn"]:checked').value === 'true',
        currentPlaylistId: parseInt(document.getElementById('currentPlaylistId').value),
        timeRules: timeRules
    };

    fetch('/dev/api/timeTables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);
    })
    .catch(error => {
        console.error('Error apdejtowania TimeTables:', error);
        showMessage('Error apdejtowania TimeTables: ' + error.message);
    });
}

function updateVotes() {
    const votes = [];

    document.querySelectorAll('.vote-entry').forEach(entry => {
        const idInput = entry.querySelector('.song-id');
        const nameInput = entry.querySelector('.song-name');
        const urlInput = entry.querySelector('.song-url');
        const votesInput = entry.querySelector('.song-votes');
        const dateInput = entry.querySelector('.song-date');

        if (!idInput || !nameInput || !urlInput || !votesInput || !dateInput) return;

        const id = parseInt(idInput.value) || 1;
        const title = nameInput.value;
        const url = urlInput.value;
        const voteCount = parseInt(votesInput.value) || 0;
        const date = dateInput.value;

        if (title && url) {
            votes.push({
                id: id,
                votes: voteCount,
                created_at: date || new Date().toLocaleDateString('en-CA'),
                uSongs: {
                    url: url,
                    title: title
                }
            });
        }
    });

    fetch('/dev/api/votes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(votes)
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);
    })
    .catch(error => {
        console.error('Error apdejtowania Votes:', error);
        showMessage('Error apdejtowania Votes: ' + error.message);
    });
}

function addTimeRule() {
    const container = document.getElementById('timeRulesContainer');
    const entry = document.createElement('div');
    entry.className = 'time-rule-entry';
    entry.innerHTML = `
        <input type="time" class="rule-start" placeholder="Start">
        <input type="time" class="rule-end" placeholder="End">
        <button onclick="removeTimeRule(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeTimeRule(button) {
    button.parentElement.remove();
}

function addVoteEntry() {
    const container = document.getElementById('votesContainer');
    const entry = document.createElement('div');
    entry.className = 'vote-entry';
    const nextId = document.querySelectorAll('.vote-entry').length + 1;
    entry.innerHTML = `
        <input type="number" value="${nextId}" class="song-id" placeholder="ID">
        <input type="text" class="song-name" placeholder="Nazwa piosenki">
        <input type="text" class="song-url" placeholder="Plik/URL">
        <input type="number" value="0" class="song-votes" placeholder="Votes" min="0">
        <input type="date" value="${new Date().toLocaleDateString('en-CA')}" class="song-date">
        <button onclick="removeVoteEntry(this)">Remove</button>
    `;
    container.appendChild(entry);
}

function removeVoteEntry(button) {
    button.parentElement.remove();
}

function loadTimeTablesPreset(preset) {
    switch(preset) {
        case 'school':
            document.querySelector('input[name="isOn"][value="true"]').checked = true;
            document.getElementById('currentPlaylistId').value = '7';

            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(day => {
                document.querySelector(`input[name="day"][value="${day}"]`).checked = true;
            });
            ['Sat', 'Sun'].forEach(day => {
                document.querySelector(`input[name="day"][value="${day}"]`).checked = false;
            });

            document.getElementById('timeRulesContainer').innerHTML = '';
            const schoolTimes = [
                {start: '07:07', end: '07:10'},
                {start: '07:55', end: '08:00'},
                {start: '08:45', end: '08:50'},
                {start: '09:35', end: '09:45'},
                {start: '10:30', end: '10:35'},
                {start: '11:20', end: '11:40'},
                {start: '12:25', end: '12:30'},
                {start: '13:15', end: '13:20'},
                {start: '14:05', end: '14:10'},
                {start: '14:55', end: '15:00'},
                {start: '15:45', end: '15:50'}
            ];
            schoolTimes.forEach(time => {
                addTimeRule();
                const entries = document.querySelectorAll('.time-rule-entry');
                const lastEntry = entries[entries.length - 1];
                lastEntry.querySelector('.rule-start').value = time.start;
                lastEntry.querySelector('.rule-end').value = time.end;
            });
            showMessage(`Załadowano preset: ${preset} - Harmonogram dzwonków szkolnych z playlistą klasyczną`);
            break;
        case 'weekend':
            document.querySelector('input[name="isOn"][value="true"]').checked = true;
            document.getElementById('currentPlaylistId').value = '1';

            ['Sat', 'Sun'].forEach(day => {
                document.querySelector(`input[name="day"][value="${day}"]`).checked = true;
            });
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(day => {
                document.querySelector(`input[name="day"][value="${day}"]`).checked = false;
            });
            document.getElementById('timeRulesContainer').innerHTML = '';
            showMessage(`Załadowano preset: ${preset} - Weekend z standardowymi playlistami`);
            break;
        case 'off':
            document.querySelector('input[name="isOn"][value="false"]').checked = true;
            document.querySelectorAll('input[name="day"]').forEach(cb => cb.checked = false);
            document.getElementById('timeRulesContainer').innerHTML = '';
            showMessage(`Załadowano preset: ${preset} - Radyjko kopnięte`);
            break;
    }
}

function loadVotesPreset(preset) {
    const container = document.getElementById('votesContainer');
    container.innerHTML = '';

    switch(preset) {
        case 'popular':
            const popularSongs = [
                {id: 1, title: 'Popular Hit Song 1', url: '7Popular_Hit_1.mp3', votes: 450},
                {id: 2, title: 'Popular Hit Song 2', url: '7Popular_Hit_2.mp3', votes: 350},
                {id: 3, title: 'Popular Hit Song 3', url: '7Popular_Hit_3.mp3', votes: 300},
                {id: 4, title: 'Popular Hit Song 4', url: '7Popular_Hit_4.mp3', votes: 250},
                {id: 5, title: 'Popular Hit Song 5', url: '7Popular_Hit_5.mp3', votes: 150}
            ];

            popularSongs.forEach(song => {
                addVoteEntry();
                const entries = document.querySelectorAll('.vote-entry');
                const lastEntry = entries[entries.length - 1];
                lastEntry.querySelector('.song-id').value = song.id;
                lastEntry.querySelector('.song-name').value = song.title;
                lastEntry.querySelector('.song-url').value = song.url;
                lastEntry.querySelector('.song-votes').value = song.votes;
            });
            showMessage(`Załadowano preset: ${preset} - Popularne muzyki, zmyślone na razie`);
            break;

        case 'test':
            const testSongs = [
                {id: 1, title: "DevAPI - L'amour Toujours", url: 'https://music.youtube.com/watch?v=c3Pd7nH7Y40', votes: 8},
                {id: 2, title: 'DevAPI - Rickus Astleyus', url: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ', votes: 16}
            ];

            testSongs.forEach(song => {
                addVoteEntry();
                const entries = document.querySelectorAll('.vote-entry');
                const lastEntry = entries[entries.length - 1];
                lastEntry.querySelector('.song-id').value = song.id;
                lastEntry.querySelector('.song-name').value = song.title;
                lastEntry.querySelector('.song-url').value = song.url;
                lastEntry.querySelector('.song-votes').value = song.votes;
            });
            showMessage(`Załadowano preset: ${preset} - Testowe songi z ytmusic`);
            break;

        case 'empty':
            showMessage(`Załadowano preset: ${preset} - Reset wszystkich songów`);
            break;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Sprawdzamy, czy jesteśmy na stronie devapi.ejs
    if (document.getElementById('devapi-status')) {
        checkDevAPIStatus();
    }
});

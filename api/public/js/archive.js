console.log('Inicjowanie modułu archiwum muzycznego');

let allSongs = [];
let filteredSongs = [];
let searchResults = [];
let isSearchActive = false;
let isFilterActive = false;
let currentFilterType = null;
let currentPage = 1;
const songsPerPage = 15;

function showInIframe(message, isError = false) {
    const iframe = document.getElementById('res');
    const color = isError ? 'red' : 'lime';
    const content = `${message}`;
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(content);
    iframe.contentWindow.document.close();
}

function hasCJKCharacters(text) {
    // Regex dla znaków chińskich, japońskich i koreańskich i innych hebrajskich
    const cjkRegex = /[一-鿿぀-ゟ゠-ヿ가-힯㐀-䶿]/;
    return cjkRegex.test(text);
}

function filterNoMetadata() {
    const filtered = allSongs.filter(song => {
        const titleIsFilename = !song.title || song.title === song.filename?.replace('.mp3', '') || 
                                song.title === (song.filePath ? song.filePath.split('/').pop().replace('.mp3', '') : '');
        const noArtist = !song.artist || song.artist === 'Nieznany Artysta' || song.artist === 'Nieznany wykonawca';
        return titleIsFilename || noArtist;
    });
    applyFilter(filtered, 'noMetadata', `Piosenki bez metadanych: ${filtered.length}`);
}

function filterCJKCharacters() {
    const filtered = allSongs.filter(song => {
        const titleHasCJK = song.title && hasCJKCharacters(song.title);
        const artistHasCJK = song.artist && hasCJKCharacters(song.artist);
        const filenameHasCJK = song.filename && hasCJKCharacters(song.filename);
        return titleHasCJK || artistHasCJK || filenameHasCJK;
    });
    applyFilter(filtered, 'cjk', `Piosenki z chińskimi/japońskimi znakami: ${filtered.length}`);
}

function filterNoDuration() {
    const filtered = allSongs.filter(song => {
        return !song.duration || song.duration === 0;
    });
    applyFilter(filtered, 'noDuration', `Piosenki bez czasu: ${filtered.length}`);
}

function filterRootFiles() {
    const baseList = isSearchActive ? searchResults : allSongs;
    const filtered = baseList.filter(song => {
        const filePath = song.filePath || song.path || '';
        if (!filePath) return false;
        const normalizedPath = filePath.replace(/\/+/g, '/');
        const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
        const archiveIndex = pathParts.findIndex(part => 
            part.toLowerCase().includes('archive') || part === 'elp-archive'
        );
        if (archiveIndex === -1) return false;
        const segmentsAfterArchive = pathParts.length - archiveIndex - 1;
        return segmentsAfterArchive === 1;
    });
    
    const baseCount = isSearchActive ? searchResults.length : allSongs.length;
    applyFilterWithSearch(filtered, 'rootFiles', `Pliki w katalogu głównym: ${filtered.length}`, 'locationInfo');
}

function filterSubfolderFiles() {
    const baseList = isSearchActive ? searchResults : allSongs;
    const filtered = baseList.filter(song => {
        const filePath = song.filePath || song.path || '';
        if (!filePath) return false;
        const normalizedPath = filePath.replace(/\/+/g, '/');
        const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
        const archiveIndex = pathParts.findIndex(part => 
            part.toLowerCase().includes('archive') || part === 'elp-archive'
        );
        if (archiveIndex === -1) return false;
        const segmentsAfterArchive = pathParts.length - archiveIndex - 1;
        return segmentsAfterArchive > 1;
    });
    const baseCount = isSearchActive ? searchResults.length : allSongs.length;
    applyFilterWithSearch(filtered, 'subfolderFiles', `Pliki w podfolderach: ${filtered.length}`, 'locationInfo');
}

function applyFilter(filtered, filterType, message, infoElementId = 'filterInfo') {
    filteredSongs = filtered;
    isFilterActive = true;
    isSearchActive = false;
    currentFilterType = filterType;
    currentPage = 1;
    document.getElementById('filterInfo').innerHTML = '';
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) locationInfo.innerHTML = '';
    document.getElementById('searchInfo').innerHTML = '';
    const targetElement = document.getElementById(infoElementId);
    if (targetElement) {
        targetElement.innerHTML = `✓ ${message}`;
        if (infoElementId === 'locationInfo') {
            targetElement.style.color = '#87ceeb';
        } else {
            targetElement.style.color = '#ff69b4';
        }
    }
    document.getElementById('searchFile').value = '';
    displayPage();
}

function applyFilterWithSearch(filtered, filterType, message, infoElementId = 'filterInfo') {
    filteredSongs = filtered;
    isFilterActive = true;
    currentFilterType = filterType;
    currentPage = 1;
    const filterInfo = document.getElementById('filterInfo');
    if (filterInfo && infoElementId !== 'filterInfo') filterInfo.innerHTML = '';
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo && infoElementId !== 'locationInfo') locationInfo.innerHTML = '';
    const targetElement = document.getElementById(infoElementId);
    if (targetElement) {
        targetElement.innerHTML = `✓ ${message}`;
        if (infoElementId === 'locationInfo') {
            targetElement.style.color = '#87ceeb';
        } else {
            targetElement.style.color = '#ff69b4';
        }
    }
    displayPage();
}

function resetFilters() {
    isFilterActive = false;
    currentFilterType = null;
    if (isSearchActive) {
        filteredSongs = searchResults;
    } else {
        isSearchActive = false;
        filteredSongs = [];
    }
    currentPage = 1;
    document.getElementById('filterInfo').innerHTML = '';
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) locationInfo.innerHTML = '';
    if (!isSearchActive) {
        document.getElementById('searchInfo').innerHTML = '';
        document.getElementById('searchFile').value = '';
    }
    displayPage();
}

function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '21:37';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePaginationControls() {
    const displaySongs = (isSearchActive || isFilterActive) ? filteredSongs : allSongs;
    const totalPages = Math.ceil(displaySongs.length / songsPerPage);
    document.getElementById('pageInfo').textContent = `${currentPage} / ${totalPages}`;
    document.getElementById('totalSongs').textContent = displaySongs.length;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
}

function displayPage() {
    const tableBody = document.querySelector('#archiveTable tbody');
    tableBody.innerHTML = '';
    const displaySongs = (isSearchActive || isFilterActive) ? filteredSongs : allSongs;
    if (!displaySongs || displaySongs.length === 0) {
        const row = document.createElement('tr');
        let message = 'Brak utworów w archiwum';
        if (isSearchActive) message = 'Brak wyników wyszukiwania';
        if (isFilterActive) message = 'Brak utworów spełniających kryteria filtrowania';
        row.innerHTML = `
            <td colspan="6" class="center" style="color: ${(isSearchActive || isFilterActive) ? 'yellow' : 'white'};">${message}</td>
        `;
        tableBody.appendChild(row);
        updatePaginationControls();
        return;
    }
    const startIndex = (currentPage - 1) * songsPerPage;
    const endIndex = Math.min(startIndex + songsPerPage, displaySongs.length);
    const songsToDisplay = displaySongs.slice(startIndex, endIndex);
    let lastMatchType = null;
    songsToDisplay.forEach((song, index) => {
        if (isSearchActive && song.matchType && song.matchType !== lastMatchType) {
            if (song.matchType === 'filename' && lastMatchType === 'metadata') {
                const separatorRow = document.createElement('tr');
                separatorRow.innerHTML = `
                    <td colspan="6" style="background: rgba(255, 165, 0, 0.3); text-align: center; font-weight: bold; padding: 8px;">
                        Wyniki znalezione po nazwie pliku
                    </td>
                `;
                tableBody.appendChild(separatorRow);
            } else if (song.matchType === 'metadata' && lastMatchType === null) {
                const separatorRow = document.createElement('tr');
                separatorRow.innerHTML = `
                    <td colspan="6" style="background: rgba(0, 128, 0, 0.3); text-align: center; font-weight: bold; padding: 8px;">
                        Wyniki znalezione po metadanych
                    </td>
                `;
                tableBody.appendChild(separatorRow);
            }
            lastMatchType = song.matchType;
        }
        const row = document.createElement('tr');
        const globalIndex = startIndex + index + 1;
        const fileName = song.filePath ? song.filePath.split('/').pop() : song.filename;
        row.innerHTML = `
            <td>${globalIndex}</td>
            <td><strong>${song.title || 'Nieznany tytuł'}</strong></td>
            <td>${song.artist || 'Nieznany wykonawca'}</td>
            <td>${formatDuration(song.duration)}</td>
            <td style="font-size: 0.85em; color: #ccc;">${fileName}</td>
            <td><button onclick="deleteArchiveFile('${fileName}')">Usuń</button></td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationControls();
}

async function deleteArchiveFile(filename) {
    if (!confirm(`Czy na pewno chcesz usunąć plik "${filename}" z archiwum?`)) {
        return;
    }
    try {
        const response = await fetch(`/archive/deleteArchive?filename=${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (response.ok) {
            showInIframe(`Pomyślnie usunięto plik: <strong>${filename}</strong>`);
            // Usuń z lokalnej tablicy allSongs
            allSongs = allSongs.filter(song => {
                const songFilename = song.filePath ? song.filePath.split('/').pop() : song.filename;
                return songFilename !== filename;
            });
            // Jeśli aktywne wyszukiwanie lub filtr, usuń też z filteredSongs i searchResults
            if (isSearchActive || isFilterActive) {
                filteredSongs = filteredSongs.filter(song => {
                    const songFilename = song.filePath ? song.filePath.split('/').pop() : song.filename;
                    return songFilename !== filename;
                });
                if (isSearchActive) {
                    searchResults = searchResults.filter(song => {
                        const songFilename = song.filePath ? song.filePath.split('/').pop() : song.filename;
                        return songFilename !== filename;
                    });
                }
            }
            // Sprawdź czy aktualna strona nie jest pusta
            const displaySongs = (isSearchActive || isFilterActive) ? filteredSongs : allSongs;
            const totalPages = Math.ceil(displaySongs.length / songsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            // Odśwież wyświetlanie bez pobierania z serwera
            displayPage();
        } else {
            showInIframe(`Błąd podczas usuwania: ${result.error}`, true);
        }
    } catch (error) {
        console.error('Błąd podczas usuwania pliku:', error);
        showInIframe('Błąd podczas usuwania pliku!', true);
    }
}

async function fetchArchive() {
    try {
        const response = await fetch('/archive/archiveSongsQuery');
        const songs = await response.json();
        allSongs = songs;
        isSearchActive = false;
        isFilterActive = false;
        currentFilterType = null;
        filteredSongs = [];
        searchResults = [];
        currentPage = 1;
        document.getElementById('searchInfo').innerHTML = '';
        document.getElementById('filterInfo').innerHTML = '';
        const locationInfo = document.getElementById('locationInfo');
        if (locationInfo) locationInfo.innerHTML = '';
        document.getElementById('searchFile').value = '';
        displayPage();
        showInIframe(`Załadowano <strong>${songs.length}</strong> utworów z archiwum`);
    } catch (error) {
        console.error('Błąd podczas pobierania listy utworów:', error);
        const tableBody = document.querySelector('#archiveTable tbody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="center" style="color: red;">Błąd podczas pobierania listy utworów!</td>
            </tr>
        `;
        showInIframe('Błąd podczas pobierania listy utworów!', true);
    }
}

function nextPage() {
    const displaySongs = (isSearchActive || isFilterActive) ? filteredSongs : allSongs;
    const totalPages = Math.ceil(displaySongs.length / songsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPage();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPage();
    }
}

function resetSearch() {
    isSearchActive = false;
    isFilterActive = false;
    currentFilterType = null;
    filteredSongs = [];
    currentPage = 1;
    document.getElementById('searchInfo').innerHTML = '';
    document.getElementById('filterInfo').innerHTML = '';
    document.getElementById('searchFile').value = '';
    displayPage();
}

async function searchFile() {
    const searchQuery = document.getElementById('searchFile').value;
    if (!searchQuery) {
        showInIframe('Podaj tytuł lub wykonawcę do wyszukania!', true);
        return;
    }
    try {
        const response = await fetch(`/archive/searchArchive?file=${encodeURIComponent(searchQuery)}`);
        const results = await response.json();
        const allResults = results.all || results;
        searchResults = allResults;
        filteredSongs = allResults;
        isSearchActive = true;
        isFilterActive = false;
        currentPage = 1;
        const searchInfo = document.getElementById('searchInfo');
        if (!allResults || allResults.length === 0) {
            searchInfo.innerHTML = 'Nie znaleziono utworów pasujących do zapytania :<';
            searchInfo.style.color = 'yellow';
            showInIframe(`Nie znaleziono utworów dla zapytania: <strong>${searchQuery}</strong>`, true);
        } else {
            const metaCount = results.metadataMatches?.length || 0;
            const fileCount = results.filenameMatches?.length || 0;
            searchInfo.innerHTML = `Znaleziono: <strong>${allResults.length}</strong> utworów dla "${searchQuery}" <span style="font-size: 0.9em;">(metadane: ${metaCount}, nazwa pliku: ${fileCount})</span>`;
            searchInfo.style.color = '#0f0';
            showInIframe(`Znaleziono <strong>${allResults.length}</strong> utworów dla: <strong>${searchQuery}</strong><br><small>Metadane: ${metaCount}, Nazwa pliku: ${fileCount}</small>`);
        }
        displayPage();
    } catch (error) {
        console.error('Błąd podczas wyszukiwania:', error);
        const searchInfo = document.getElementById('searchInfo');
        searchInfo.innerHTML = 'Błąd podczas wyszukiwania utworów!';
        searchInfo.style.color = 'red';
        showInIframe('Błąd podczas wyszukiwania utworów!', true);
    }
}
window.onload = fetchArchive;

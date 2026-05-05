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

function normalizeSlashes(value) {
    return value ? value.replace(/\\/g, '/') : '';
}

function getSongFilePath(song) {
    return song.relativePath || song.filePath || song.path || song.filename || '';
}

function getSongBasename(song) {
    const normalized = normalizeSlashes(getSongFilePath(song));
    return normalized.split('/').pop();
}

function getArchiveRelativePath(song) {
    if (song.relativePath) return normalizeSlashes(song.relativePath);
    const normalized = normalizeSlashes(getSongFilePath(song));
    const lower = normalized.toLowerCase();
    const archiveToken = '/archive/';
    const elpArchiveToken = '/elp-archive/';
    let index = lower.lastIndexOf(archiveToken);
    if (index !== -1) return normalized.slice(index + archiveToken.length);
    index = lower.lastIndexOf(elpArchiveToken);
    if (index !== -1) return normalized.slice(index + elpArchiveToken.length);
    return normalized.replace(/^\.?\//, '');
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
        const fileName = getSongBasename(song);
        const archiveRelativePath = getArchiveRelativePath(song) || fileName;
        const encodedArchivePath = encodeURIComponent(archiveRelativePath);
        row.innerHTML = `
            <td>${globalIndex}</td>
            <td><strong>${song.title || 'Nieznany tytuł'}</strong></td>
            <td>${song.artist || 'Nieznany wykonawca'}</td>
            <td>${formatDuration(song.duration)}</td>
            <td style="font-size: 0.85em; color: #ccc;">${fileName}</td>
            <td><button onclick="deleteArchiveFile('${encodedArchivePath}')">Usuń</button></td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationControls();
}

async function deleteArchiveFile(encodedArchivePath) {
    const archivePath = decodeURIComponent(encodedArchivePath || '');
    if (!archivePath) {
        showInIframe('Nieprawidlowa sciezka pliku do usuniecia!', true);
        return;
    }
    if (!confirm(`Czy na pewno chcesz usunąć plik "${archivePath}" z archiwum?`)) {
        return;
    }
    try {
        const response = await fetch(`/archive/deleteArchive?filename=${encodeURIComponent(archivePath)}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (response.ok) {
            showInIframe(`Pomyślnie usunięto plik: <strong>${archivePath}</strong>`);
            allSongs = allSongs.filter(song => {
                const songArchivePath = getArchiveRelativePath(song) || getSongBasename(song);
                return songArchivePath !== archivePath;
            });
            if (isSearchActive || isFilterActive) {
                filteredSongs = filteredSongs.filter(song => {
                    const songArchivePath = getArchiveRelativePath(song) || getSongBasename(song);
                    return songArchivePath !== archivePath;
                });
                if (isSearchActive) {
                    searchResults = searchResults.filter(song => {
                        const songArchivePath = getArchiveRelativePath(song) || getSongBasename(song);
                        return songArchivePath !== archivePath;
                    });
                }
            }
            const displaySongs = (isSearchActive || isFilterActive) ? filteredSongs : allSongs;
            const totalPages = Math.ceil(displaySongs.length / songsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
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
        const response = await fetch(`/archive/searchArchive?file=${encodeURIComponent(searchQuery)}`, {
            method: 'POST'
        });
        const results = await response.json();
        const allResults = results.all || results;
        searchResults = allResults;
        filteredSongs = allResults;
        isSearchActive = true;
        isFilterActive = false;
        currentPage = 1;
        if (!allResults || allResults.length === 0) {
            showInIframe(`Nie znaleziono utworów dla zapytania: <strong>${searchQuery}</strong>`, true);
        } else {
            const metaCount = results.metadataMatches?.length || 0;
            const fileCount = results.filenameMatches?.length || 0;
            showInIframe(`Znaleziono <strong>${allResults.length}</strong> utworów dla: <strong>${searchQuery}</strong><br><small>Metadane: ${metaCount}, Nazwa pliku: ${fileCount}</small>`);
        }
        displayPage();
    } catch (error) {
        console.error('Błąd podczas wyszukiwania:', error);
        showInIframe('Błąd podczas wyszukiwania utworów!', true);
    }
}
let copyData = null;

async function loadArchiveFolders() {
    const select = document.getElementById('archiveFolderSelect');
    try {
        const response = await fetch('/archive/getArchiveFolders');
        const folders = await response.json();
        select.innerHTML = '<option value="">-- Wybierz podkatalog archiwum --</option>';
        if (folders.length === 0) {
            showInIframe('Brak podkatalogów w archiwum!', true);
            return;
        }
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.name;
            option.textContent = `${folder.name} (${folder.mp3Count} plików)`;
            select.appendChild(option);
        });    
    } catch (error) {
        console.error('Błąd podczas ładowania podkatalogów:', error);
        showInIframe('Błąd podczas ładowania podkatalogów!', true);
    }
}

async function initiateCopyFromArchive() {
    const select = document.getElementById('archiveFolderSelect');
    const subfolderName = select.value;
    if (!subfolderName) {
        showInIframe('Wybierz podkatalog archiwum!', true);
        return;
    }
    try {
        const checkResponse = await fetch('/archive/copyFromArchive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subfolderName: subfolderName, clearFolder: false })
        });
        if (!checkResponse.ok) {
            throw new Error(`HTTP ${checkResponse.status}: ${await checkResponse.text()}`);
        }
        const checkResult = await checkResponse.json();
        if (checkResult.needsConfirmation) {
            const confirmed = confirm(
                `Folder playlisty 6 zawiera ${checkResult.existingFilesCount} plików.\n\n` +
                `Czy chcesz usunąć te pliki i zastąpić je plikami z archiwum?`
            );
            if (!confirmed) {
                showInIframe('Kopiowanie anulowane', false);
                return;
            }
            showInIframe('Czyszczenie folderu 6 i kopiowanie plików z archiwum...', false);
            const copyResponse = await fetch('/archive/copyFromArchive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subfolderName: subfolderName, clearFolder: true })
            });
            if (!copyResponse.ok) {
                throw new Error(`HTTP ${copyResponse.status}: ${await copyResponse.text()}`);
            }
            const copyResult = await copyResponse.json();
            showInIframe(
                `Folder 6 wyczyszczony i wypełniony plikami z archiwum!<br>` +
                `Skopiowano: ${copyResult.copiedFiles}/${copyResult.totalFiles}`,
                copyResult.errors.length > 0
            );
        } else {
            showInIframe(
                `Kopiowanie zakończone!<br>` +
                `Skopiowano: ${checkResult.copiedFiles}/${checkResult.totalFiles}`,
                checkResult.errors.length > 0
            );
        }
    } catch (error) {
        console.error('Błąd podczas kopiowania:', error);
        showInIframe('Błąd podczas kopiowania!', true);
    }
}

async function movePlaylistToArchive(playlistId) {
    const playlistNames = {
        1: 'Klasyczna',
        2: 'POP',
        3: 'RAP',
        4: 'ROCK',
        5: 'Soundtracki',
        6: 'Specjalna'
    };
    showInIframe(`Przenoszenie playlisty ${playlistNames[playlistId]}...`, false);
    try {
        const response = await fetch('/archive/movePlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playlistId: playlistId })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        const result = await response.json();
        showInIframe(
            `Playlista o nazwie ${playlistNames[playlistId]} przeniesiona!<br>` +
            `Folder: ${result.folderName}<br>` +
            `Pliki: ${result.copiedFiles}/${result.totalFiles}`,
            result.errors.length > 0
        );
    } catch (error) {
        console.error('Błąd podczas przenoszenia playlisty:', error);
        showInIframe(`Błąd podczas przenoszenia playlisty: ${error.message}`, true);
    }
}

window.onload = () => {
    fetchArchive();
    loadArchiveFolders();
};
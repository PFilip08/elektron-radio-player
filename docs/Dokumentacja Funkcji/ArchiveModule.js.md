# initArchive()

Funkcja `initArchive()` inicjalizuje katalog archiwum utworów.

Sprawdza, czy katalog archiwum określony w zmiennej `archdir` istnieje na dysku. Jeżeli katalog nie istnieje, tworzy go rekurencyjnie. Następnie odczytuje listę plików i informuje logiem w konsoli o liczbie zarchiwizowanych plików.

# copyToArchive()

Funkcja `copyToArchive()` kopiuje wskazany plik lub zawartość wskazanego katalogu do archiwum.

Funkcja przyjmuje jeden argument:

- `path` - ścieżka do pojedynczego pliku lub katalogu z plikami MP3.

Przed skopiowaniem funkcja sprawdza, czy dany plik już istnieje w archiwum – jeśli istnieje, operacja jest pomijana.

# copyFromArchive()

Funkcja `copyFromArchive()` kopiuje pojedynczy plik z katalogu archiwum do wskazanej ścieżki docelowej.

Funkcja przyjmuje dwa argumenty:

- `file` - nazwa pliku w archiwum,
- `destPath` - pełna ścieżka docelowa wraz z nazwą pliku.

W przypadku braku pliku w archiwum funkcja loguje błąd i przerywa działanie. W przypadku powodzenia zwraca komunikat tekstowy.

# copyFileFromArchiveToPlaylist()

Funkcja `copyFileFromArchiveToPlaylist()` kopiuje pojedynczy plik z archiwum bezpośrednio do określonej playlisty.

Funkcja przyjmuje dwa argumenty:

- `file` - ścieżka względna lub nazwa pliku w archiwum,
- `playlistId` - numer/identyfikator playlisty docelowej (np. `1`, `6`).

Tworzy folder playlisty docelowej, jeśli ten nie istnieje, sprawdza czy plik nie istnieje już w playliście i kopiuje go przy użyciu [`copyFromArchive()`](#copyfromarchive).

# checkIfFileExistsInArchive()

Funkcja `checkIfFileExistsInArchive()` sprawdza, czy plik o danej nazwie znajduje się w katalogu archiwum.

Funkcja przyjmuje jeden argument:

- `file` - nazwa pliku do sprawdzenia.

Zwraca:
- `true` - jeśli plik istnieje w archiwum,
- `false` - jeśli plik nie został odnaleziony.

# getAllMp3FilesInArchive()

Funkcja `getAllMp3FilesInArchive()` przeszukuje rekurencyjnie katalog archiwum i zbiera ścieżki do wszystkich plików z rozszerzeniem `.mp3`.

Zwraca tablicę (array) zawierającą pełne ścieżki do wszystkich plików MP3 w archiwum.

## Tryb Debugowania

W przypadku błędu podczas skanowania katalogu stack trace jest zapisywany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ArchiveModule/getAllMp3FilesInArchive/catched_error`.

# archiveSongsQuery()

Funkcja `archiveSongsQuery()` odczytuje listę wszystkich utworów w archiwum i parsuje ich metadane (tytuł, autor, czas trwania, ścieżka względna).

Zwraca Promise z tablicą obiektów reprezentujących utwory:

```javascript
[
  {
    title: 'Nazwa utworu',
    artist: 'Nazwa wykonawcy',
    duration: 180, // długość w sekundach
    filePath: './mp3/Archive/utwor.mp3',
    relativePath: 'utwor.mp3'
  }
]
```

## Tryb Debugowania

W przypadku błędu odczytu metadanych z pliku stack trace zapisywany jest w `debug/ArchiveModule/archiveSongsQuery/catched_error`.

# searchInArchive()

Funkcja `searchInArchive()` wyszukuje utwory w archiwum na podstawie przekazanej frazy tekstowej.

Funkcja przyjmuje jeden argument:

- `query` - szukana fraza tekstowa (tytuł, wykonawca, album lub nazwa pliku).

Dopasowuje utwory pod kątem metadanych (tytuł, autor, album) oraz nazwy pliku. Zwraca obiekt z podziałem na typy dopasowań:

```javascript
{
  metadataMatches: [ /* lista dopasowań w metadanych */ ],
  filenameMatches: [ /* lista dopasowań w nazwie pliku */ ],
  all: [ /* wszystkie znalezione wyniki */ ]
}
```

## Tryb Debugowania

W przypadku wystąpienia błędu podczas przeszukiwania błąd trafia do `debug/ArchiveModule/searchInArchive/catched_error`.

# deleteFromArchive()

Funkcja `deleteFromArchive()` trwale usuwa plik z archiwum.

Funkcja przyjmuje jeden argument:

- `filename` - nazwa lub ścieżka pliku w archiwum do usunięcia.

Zwraca obiekt:
- `{ message: 'Usunięto plik ... z archiwum.' }` - w przypadku powodzenia,
- `{ error: '...' }` - w przypadku, gdy plik nie istnieje lub wystąpi błąd usuwania.

## Tryb Debugowania

W przypadku błędu usuwania pliku stack trace zrzucany jest do `debug/ArchiveModule/deleteFromArchive/catched_error`.

# getArchiveSubfolders()

Funkcja `getArchiveSubfolders()` zwraca listę wszystkich podkatalogów znajdujących się w archiwum wraz z liczbą zawartych w nich plików MP3.

Zwraca tablicę obiektów:

```javascript
[
  {
    name: '1-Klasyczna-2024-05-10',
    mp3Count: 15
  }
]
```

# copyFromArchiveToSix()

Funkcja `copyFromArchiveToSix()` kopiuje utwory z wybranego podfolderu archiwum do folderu playlisty specjalnej 6 (`./mp3/6`).

Funkcja przyjmuje dwa argumenty:

- `subfolderName` - nazwa podkatalogu w archiwum,
- `clearFolder` - parametr opcjonalny (boolean, domyślnie `false`), czy wyczyścić folder playlisty 6 przed skopiowaniem plików.

Jeśli w playliście 6 znajdują się już pliki, a `clearFolder` ma wartość `false`, funkcja zwraca prośbę o potwierdzenie nadpisania:

```javascript
{
  needsConfirmation: true,
  existingFilesCount: 5
}
```

Po wyczyszczeniu i skopiowaniu (lub gdy folder był pusty) funkcja zwraca podsumowanie operacji (`totalFiles`, `copiedFiles`, `errors`).

# movePlaylistToArchive()

Funkcja `movePlaylistToArchive()` przenosi wskazaną playlistę do nowego podfolderu w archiwum.

Funkcja przyjmuje dwa argumenty:

- `playlistId` - numer/identyfikator playlisty do zarchiwizowania,
- `userNotice` - opcjonalna notatka użytkownika dodawana do nazwy folderu w archiwum.

Funkcja tworzy w archiwum podkatalog o formacie nazwy `{playlistId}-{playlistName}-{userNotice}` (lub ze znacznikiem daty, jeśli brak notatki), kopiuje wszystkie pliki MP3, a następnie usuwa je z folderu źródłowego playlisty.

# Zmienne modułu

- `archdir` - ścieżka katalogu głównego archiwum (konfigurowana przez zmienną środowiskową `ARCHIVE_DIR`, domyślnie `./mp3/Archive`).


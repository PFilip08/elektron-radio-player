# initArchive()

Funkcja ta nie przyjmuje żadnych argumentów i służy do inicjalizacji katalogu archiwum, którego ścieżka jest zapisana w zmiennej `archdir` (domyślnie `./mp3/Archive` lub ścieżka ze zmiennej środowiskowej `ARCHIVE_DIR`).

Na początku funkcja sprawdza, czy folder archiwum istnieje. Jeżeli nie istnieje, to wyświetla ostrzeżenie w konsoli, tworzy ten katalog i wywołuje samą siebie ponownie.
Gdy katalog istnieje, funkcja odczytuje listę plików w archiwum. Jeżeli archiwum jest puste, to w konsoli wyświetli ostrzeżenie, że archiwum jest puste, a jeżeli są w nim pliki, to wyświetli log z informacją, ile plików znajduje się w archiwum.

# copyToArchive()

Funkcja przyjmuje jeden argument, którym jest `path_to_copy`, czyli ścieżka do pojedynczego pliku lub całego folderu z plikami mp3, które mają zostać skopiowane do archiwum.

Na początku funkcja sprawdza, czy podana ścieżka prowadzi do pojedynczego pliku:
- Jeżeli jest to pojedynczy plik, to wyciąga samą nazwę pliku i sprawdza, czy taki plik już istnieje w folderze archiwum. Jeżeli istnieje, to wyświetla loga o tym, że plik jest już w archiwum i kończy działanie. Jeżeli nie istnieje, to kopiuje plik do archiwum i wyświetla loga o skopiowaniu pliku.
- Jeżeli podana ścieżka jest katalogiem, to funkcja odczytuje wszystkie pliki w tym katalogu i w pętli dla każdego pliku sprawdza, czy jest on plikiem i czy nie ma go już w archiwum, po czym kopiuje brakujące pliki do katalogu archiwum.

# copyFromArchive()

Funkcja przyjmuje dwa argumenty:

- `file` - nazwa pliku znajdującego się w archiwum
- `destPath` - ścieżka docelowa, gdzie plik ma zostać skopiowany

Na początku funkcja sprawdza, czy podany plik w ogóle istnieje w archiwum. Jeżeli nie istnieje, to zwraca w konsoli loga z błędem i kończy działanie.
Jeżeli plik istnieje, to kopiuje go z archiwum do ścieżki `destPath`, wyświetla o tym loga w konsoli i zwraca stringa z komunikatem o skopiowaniu pliku.

# copyFileFromArchiveToPlaylist()

Funkcja przyjmuje dwa argumenty:

- `file` - nazwa pliku (lub ścieżka względna) w archiwum
- `playlistId` - id playlisty, do której plik ma zostać skopiowany

Funkcja na początku sprawdza, czy folder docelowej playlisty w `./mp3/` istnieje, a jeżeli nie, to go tworzy. Następnie sprawdza, czy plik o takiej nazwie nie znajduje się już na tej playliście. Jeżeli plik już tam jest, to wyświetla ostrzeżenie w konsoli i zwraca komunikat `Plik już istnieje: <nazwa pliku>`.
Jeżeli pliku jeszcze nie ma na playliście, to przekazuje zadanie skopiowania do funkcji [`copyFromArchive()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ArchiveModule.js.md#copyfromarchive).

# checkIfFileExistsInArchive()

Funkcja przyjmuje jeden argument, którym jest `file` i jak sama nazwa wskazuje, jest to nazwa pliku, który chcemy sprawdzić, czy znajduje się w archiwum.

Jeżeli plik istnieje w katalogu archiwum, to funkcja wyświetla loga w konsoli i zwraca `true`, a jeżeli pliku nie ma, to wyświetla o tym loga i zwraca `false`.

# getAllMp3FilesInArchive()

Funkcja ta nie przyjmuje żadnych argumentów. Skanuje ona cały katalog archiwum (wraz z podfolderami) w poszukiwaniu wszystkich plików z rozszerzeniem `.mp3` i zwraca je w formacie array:

```array
[
  './mp3/Archive/utwor1.mp3',
  './mp3/Archive/1-Klasyczna/utwor2.mp3'
]
```

## Tryb Debugowania

W przypadku błędu podczas odczytywania katalogu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ArchiveModule/getAllMp3FilesInArchive/catched_error.txt`.

# archiveSongsQuery()

Funkcja ta działa na bardzo podobnej zasadzie co funkcja [`playlistSongQuery()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playlistsongquery).
Na początku pobiera listę wszystkich plików mp3 z archiwum przy użyciu funkcji [`getAllMp3FilesInArchive()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ArchiveModule.js.md#getallmp3filesinarchive), a następnie odczytuje z każdego pliku metadane i zwraca je w formacie object:

```object
{
  title: 'Nazwa piosenki',
  artist: 'Nazwa artysty',
  duration: 180,
  filePath: './mp3/Archive/utwor.mp3',
  relativePath: 'utwor.mp3'
}
```

W przypadku, gdy plik nie posiada w metadanych tytułu lub artysty, bądź wywali błąd podczas odczytywania metadanych, to jako tytuł ustawiana jest nazwa pliku, jako artysta `Nieznany Artysta`, a czas trwania na `0`.

## Tryb Debugowania

W przypadku błędu podczas odczytu metadanych błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ArchiveModule/archiveSongsQuery/catched_error.txt`.

# searchInArchive()

Funkcja przyjmuje jeden argument, którym jest `query`, czyli fraza, której szukamy w archiwum.

Jeżeli fraza jest pusta albo katalog archiwum nie istnieje, to funkcja od razu zwraca pusty obiekt wyników.
W normalnym działaniu funkcja pobiera wszystkie pliki mp3 przy pomocy [`getAllMp3FilesInArchive()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ArchiveModule.js.md#getallmp3filesinarchive), po czym przeszukuje je paczkami po 20 plików, sprawdzając, czy szukana fraza znajduje się w metadanych (tytuł, artysta, album) albo w samej nazwie pliku.
Na koniec zwraca wyniki w formacie object:

```object
{
  metadataMatches: [ /* dopasowania znalezione w metadanych */ ],
  filenameMatches: [ /* dopasowania znalezione w nazwie pliku */ ],
  all: [ /* wszystkie znalezione dopasowania razem */ ]
}
```

## Tryb Debugowania

W przypadku błędu podczas parsowania metadanych lub przeszukiwania archiwum błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ArchiveModule/searchInArchive/catched_error.txt`.

# deleteFromArchive()

Funkcja przyjmuje jeden argument, którym jest `filename`, czyli nazwa pliku do usunięcia z archiwum.

Na początku funkcja sprawdza, czy plik w ogóle istnieje w archiwum. Jeżeli nie istnieje, to wyświetla w konsoli błąd i zwraca object:

```object
{
  error: 'Plik nazwa.mp3 nie istnieje w archiwum.'
}
```

Jeżeli plik istnieje, to funkcja usuwa go z dysku, wyświetla loga w konsoli i zwraca object:

```object
{
  message: 'Usunięto plik nazwa.mp3 z archiwum.'
}
```

## Tryb Debugowania

W przypadku błędu podczas usuwania pliku błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ArchiveModule/deleteFromArchive/catched_error.txt`.

# getArchiveSubfolders()

Funkcja ta nie przyjmuje żadnych argumentów. Sprawdza ona wszystkie podkatalogi znajdujące się w folderze archiwum, zlicza ile w każdym z nich znajduje się plików `.mp3` i zwraca listę w formacie array:

```array
[
  {
    name: '1-Klasyczna-2024-05-10-12-00',
    mp3Count: 15
  }
]
```

# copyFromArchiveToSix()

Funkcja ta służy do kopiowania utworów z wybranego podfolderu w archiwum do playlisty specjalnej nr 6 (`./mp3/6`).
Przyjmuje ona dwa argumenty:

- `subfolderName` - nazwa podkatalogu w archiwum
- `clearFolder` - zmienna typu boolean (domyślnie `false`), która określa, czy wyczyścić folder playlisty 6 przed skopiowaniem plików

Na początku funkcja sprawdza, czy podany podkatalog istnieje w archiwum. Następnie sprawdza, czy w folderze `./mp3/6` znajdują się już jakieś pliki mp3.
Jeżeli w folderze `./mp3/6` są już pliki, a argument `clearFolder` jest ustawiony na `false`, to funkcja nie kopiuje jeszcze plików, tylko zwraca object z informacją, że wymagane jest potwierdzenie:

```object
{
  needsConfirmation: true,
  existingFilesCount: 5
}
```

Jeżeli `clearFolder` jest ustawione na `true`, to funkcja najpierw usuwa stare pliki mp3 z folderu `./mp3/6`, a następnie kopiuje wszystkie pliki mp3 z podkatalogu archiwum do `./mp3/6` i zwraca object:

```object
{
  needsConfirmation: false,
  totalFiles: 15,
  copiedFiles: 15,
  errors: []
}
```

# movePlaylistToArchive()

Funkcja ta przenosi całą playlistę z folderu `./mp3/{playlistId}` do osobnego podkatalogu w archiwum.
Przyjmuje ona dwa argumenty:

- `playlistId` - id playlisty, którą chcemy przenieść do archiwum
- `userNotice` - opcjonalny dopisek użytkownika do nazwy tworzonego folderu

Na początku funkcja sprawdza, czy folder playlisty istnieje oraz czy nie jest pusty. Jeżeli w playliście nie ma żadnych plików mp3, to funkcja wyświetla ostrzeżenie i zwraca stringa z informacją, że playlista jest pusta.
Jeżeli pliki istnieją, to funkcja pobiera nazwę playlisty przez [`getPlaylistName()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#getplaylistname) i tworzy w archiwum nowy folder o nazwie `{playlistId}-{playlistName}-{userNotice}` (a jeżeli `userNotice` nie zostało podane, to zamiast niego wstawia aktualną datę i godzinę w formacie `YYYY-MM-DD-HH-MM`).
Następnie w pętli kopiuje każdy plik mp3 do nowo utworzonego folderu w archiwum i usuwa go z folderu źródłowego playlisty, a na koniec zwraca object:

```object
{
  folderName: '1-Klasyczna-2024-05-10-12-00',
  totalFiles: 10,
  copiedFiles: 10,
  errors: []
}
```

# Endpoint searchArchive

### Opis

Ten endpoint wyszukuje plik w archiwum po podanej frazie (w metadanych lub nazwie pliku).

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/searchArchive`
- **Parametry zapytania:**
  - `file` - Parametr wymagany, nazwa pliku lub fraza do wyszukania.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "metadataMatches": [ //array <Dopasowania w metadanych>
        { //object
            "filename": "Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Nazwa pliku>
            "path": "./mp3/Archive/Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Ścieżka do pliku>
            "relativePath": "Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Ścieżka względna w archiwum>
            "title": "Never Gonna Give You Up", //string <Tytuł piosenki>
            "artist": "Rick Astley", //string <Nazwa artysty>
            "album": "Whenever You Need Somebody", //string <Nazwa albumu>
            "duration": 213, //number <Czas trwania w sekundach>
            "format": "MPEG", //string <Format pliku>
            "matchType": "metadata" //string <Typ dopasowania>
        }
    ],
    "filenameMatches": [], //array <Dopasowania w nazwie pliku>
    "all": [ //array <Wszystkie znalezione wyniki>
        { //object
            "filename": "Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Nazwa pliku>
            "path": "./mp3/Archive/Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Ścieżka do pliku>
            "relativePath": "Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Ścieżka względna w archiwum>
            "title": "Never Gonna Give You Up", //string <Tytuł piosenki>
            "artist": "Rick Astley", //string <Nazwa artysty>
            "album": "Whenever You Need Somebody", //string <Nazwa albumu>
            "duration": 213, //number <Czas trwania w sekundach>
            "format": "MPEG", //string <Format pliku>
            "matchType": "metadata" //string <Typ dopasowania>
        }
    ]
}
```

W przypadku gdy parametr `file` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy pliku!`

W przypadku błędu podczas wyszukiwania pliku w archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/archive/searchArchive?file=Never"
```

# Endpoint listArchive

### Opis

Ten endpoint zwraca listę ścieżek do wszystkich plików mp3 znajdujących się w archiwum.

### Request

- **Metoda:** GET
- **Endpoint:** `/archive/listArchive`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
[ //array <Ścieżki do plików mp3 w archiwum>
    "./mp3/Archive/Rick_Astley_Never_Gonna_Give_You_Up.mp3", //string <Ścieżka do pliku>
    "./mp3/Archive/1-Klasyczna-2024-05-10/C418_Sweden.mp3" //string <Ścieżka do pliku>
]
```

W przypadku błędu podczas wypisywania plików w archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X GET http://localhost:8080/archive/listArchive
```

# Endpoint archiveSongsQuery

### Opis

Ten endpoint zwraca listę wszystkich piosenek z archiwum wraz z ich metadanymi.

### Request

- **Metoda:** GET
- **Endpoint:** `/archive/archiveSongsQuery`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
[ //array <Lista piosenek w archiwum>
    { //object
        "title": "Sweden", //string <Nazwa piosenki>
        "artist": "C418", //string <Nazwa artysty>
        "duration": 215, //number <Czas trwania w sekundach>
        "filePath": "./mp3/Archive/C418_Sweden.mp3", //string <Ścieżka do pliku>
        "relativePath": "C418_Sweden.mp3" //string <Ścieżka względna w archiwum>
    }
]
```

W przypadku błędu podczas zapytania archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X GET http://localhost:8080/archive/archiveSongsQuery
```

# Endpoint deleteArchive

### Opis

Ten endpoint usuwa wskazany plik z archiwum.

### Request

- **Metoda:** DELETE
- **Endpoint:** `/archive/deleteArchive`
- **Parametry zapytania:**
  - `filename` - Parametr wymagany, nazwa pliku do usunięcia.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "message": "Usunięto plik test.mp3 z archiwum." //string <Komunikat o usunięciu pliku>
}
```

W przypadku gdy parametr `filename` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy pliku!`

W przypadku gdy użytkownik próbował podać ścieżkę, która by uciekła poza folder archiwum:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

W przypadku gdy plik nie istnieje w archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:**

```json
{
    "error": "Plik test.mp3 nie istnieje w archiwum." //string <Komunikat o błędzie>
}
```

W przypadku błędu podczas usuwania pliku z archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X DELETE "http://localhost:8080/archive/deleteArchive?filename=test.mp3"
```

# Endpoint getArchiveFolders

### Opis

Ten endpoint zwraca listę podkatalogów znajdujących się w archiwum wraz z liczbą plików mp3 w każdym z nich.

### Request

- **Metoda:** GET
- **Endpoint:** `/archive/getArchiveFolders`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
[ //array <Lista podkatalogów w archiwum>
    { //object
        "name": "1-Klasyczna-2024-05-10-12-00", //string <Nazwa podkatalogu>
        "mp3Count": 14 //number <Liczba plików mp3 w podkatalogu>
    }
]
```

W przypadku błędu podczas pobierania podkatalogów archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X GET http://localhost:8080/archive/getArchiveFolders
```

# Endpoint copyFromArchive

### Opis

Ten endpoint kopiuje pliki z wybranego podkatalogu archiwum do folderu playlisty 6 (`./mp3/6`).

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/copyFromArchive`
- **Parametry body:**
  - `subfolderName` - Parametr wymagany, nazwa podkatalogu w archiwum.
  - `clearFolder` - Parametr opcjonalny (boolean), jeśli zostanie ustawiony na `true`, to folder playlisty 6 zostanie wyczyszczony przed skopiowaniem plików.

### Response

W przypadku powodzenia i gdy pliki zostały skopiowane zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "needsConfirmation": false, //boolean <Czy wymagane jest potwierdzenie nadpisania>
    "totalFiles": 14, //number <Łączna liczba plików mp3 w podkatalogu>
    "copiedFiles": 14, //number <Liczba skopiowanych plików>
    "errors": [] //array <Lista błędów przy kopiowaniu>
}
```

W przypadku gdy w folderze playlisty 6 znajdują się już pliki, a `clearFolder` nie zostało ustawione na `true`, zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "needsConfirmation": true, //boolean <Wymagane potwierdzenie wyczyszczenia folderu 6>
    "existingFilesCount": 5 //number <Liczba plików znajdujących się już w playliście 6>
}
```

W przypadku gdy parametr `subfolderName` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy podkatalogu!`

W przypadku gdy użytkownik próbował podać ścieżkę, która by uciekła poza folder archiwum:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

W przypadku błędu podczas kopiowania z archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/archive/copyFromArchive" \
  -H "Content-Type: application/json" \
  -d '{"subfolderName":"1-Klasyczna-2024-05-10-12-00","clearFolder":true}'
```

# Endpoint copyFileToPlaylist

### Opis

Ten endpoint kopiuje pojedynczy plik z archiwum do wskazanej playlisty.

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/copyFileToPlaylist`
- **Parametry body:**
  - `file` - Parametr wymagany, nazwa pliku do skopiowania.
  - `playlistId` - Parametr wymagany, ID playlisty docelowej.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "message": "Skopiowano/Pobrano plik test.mp3 z archiwum do mp3/1/test.mp3." //string <Komunikat o skopiowaniu (lub informacja że plik już istnieje)>
}
```

W przypadku gdy parametr `file` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy pliku!`

W przypadku gdy parametr `playlistId` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano ID playlisty!`

W przypadku gdy użytkownik próbował podać ścieżkę, która by uciekła poza folder archiwum:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

W przypadku błędu podczas kopiowania pliku z archiwum do playlisty zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/archive/copyFileToPlaylist" \
  -H "Content-Type: application/json" \
  -d '{"file":"test.mp3","playlistId":1}'
```

# Endpoint movePlaylist

### Opis

Ten endpoint przenosi wskazaną playlistę do nowego podfolderu w archiwum.

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/movePlaylist`
- **Parametry body:**
  - `playlistId` - Parametr wymagany, ID playlisty do przeniesienia.
  - `userNotice` - Parametr opcjonalny, dopisek użytkownika dodawany do nazwy folderu w archiwum.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "folderName": "1-Klasyczna-archiwizacja", //string <Nazwa utworzonego folderu w archiwum>
    "totalFiles": 10, //number <Łączna liczba plików mp3 na playliście>
    "copiedFiles": 10, //number <Liczba przeniesionych plików>
    "errors": [] //array <Lista błędów przy przenoszeniu>
}
```

W przypadku gdy podano nieprawidłowe `playlistId` (bądź playlista o takim ID nie jest zdefiniowana):

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nieprawidłowy ID playlisty!`

W przypadku gdy użytkownik próbował podać ścieżkę, która by uciekła poza folder archiwum:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

W przypadku gdy wybrana playlista jest pusta i nie ma na niej żadnych plików do przeniesienia:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Playlista <id> jest pusta, brak plików do przeniesienia`

W przypadku błędu podczas przenoszenia playlisty do archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/archive/movePlaylist" \
  -H "Content-Type: application/json" \
  -d '{"playlistId":1,"userNotice":"archiwizacja"}'
```

# Endpoint searchArchive

### Opis

Ten endpoint wyszukuje plik w archiwum po nazwie.

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/searchArchive`
- **Parametry zapytania:**
	- `file` - Parametr wymagany, nazwa pliku do wyszukania.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** wynik wyszukiwania w archiwum

W przypadku braku parametru `file` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy pliku!`

W przypadku błędu podczas wyszukiwania pliku w archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/archive/searchArchive?file=test.mp3"
```

# Endpoint listArchive

### Opis

Ten endpoint zwraca listę wszystkich plików mp3 znajdujących się w archiwum.

### Request

- **Metoda:** GET
- **Endpoint:** `/archive/listArchive`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** lista plików mp3 z archiwum

W przypadku błędu podczas wypisywania plików w archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl "http://localhost:8080/archive/listArchive"
```

# Endpoint archiveSongsQuery

### Opis

Ten endpoint zwraca wynik zapytania dotyczącego plików w archiwum.

### Request

- **Metoda:** GET
- **Endpoint:** `/archive/archiveSongsQuery`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** wynik zapytania dla plików archiwum

W przypadku błędu podczas zapytania archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl "http://localhost:8080/archive/archiveSongsQuery"
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
- **Treść:** wynik operacji usunięcia pliku

W przypadku braku parametru `filename` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy pliku!`

W przypadku próby użycia niebezpiecznej ścieżki zwracany jest:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

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

Ten endpoint zwraca listę podkatalogów znajdujących się w archiwum.

### Request

- **Metoda:** GET
- **Endpoint:** `/archive/getArchiveFolders`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** lista podkatalogów archiwum

W przypadku błędu podczas pobierania podkatalogów archiwum zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl "http://localhost:8080/archive/getArchiveFolders"
```

# Endpoint copyFromArchive

### Opis

Ten endpoint kopiuje pliki z wybranego podkatalogu archiwum do folderu docelowego.

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/copyFromArchive`
- **Parametry body:**
	- `subfolderName` - Parametr wymagany, nazwa podkatalogu źródłowego.
	- `clearFolder` - Parametr opcjonalny, jeśli ustawiony, folder docelowy może zostać wyczyszczony przed kopiowaniem.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** wynik kopiowania z archiwum

W przypadku braku parametru `subfolderName` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy podkatalogu!`

W przypadku próby użycia niebezpiecznej ścieżki zwracany jest:

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
	-d '{"subfolderName":"1","clearFolder":true}'
```

# Endpoint copyFileToPlaylist

### Opis

Ten endpoint kopiuje pojedynczy plik z archiwum do wskazanej playlisty.

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/copyFileToPlaylist`
- **Parametry body:**
	- `file` - Parametr wymagany, nazwa pliku do skopiowania.
	- `playlistId` - Parametr wymagany, identyfikator playlisty docelowej.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** obiekt z polem `message`

W przypadku braku parametru `file` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy pliku!`

W przypadku braku parametru `playlistId` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano ID playlisty!`

W przypadku próby użycia niebezpiecznej ścieżki zwracany jest:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

W przypadku gdy plik lub playlista nie istnieje zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** komunikat zwrócony przez funkcję kopiującą

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

Ten endpoint przenosi wskazaną playlistę do archiwum.

### Request

- **Metoda:** POST
- **Endpoint:** `/archive/movePlaylist`
- **Parametry body:**
	- `playlistId` - Parametr wymagany, identyfikator playlisty do przeniesienia.
	- `userNotice` - Parametr opcjonalny, dodatkowa notatka użytkownika.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** wynik operacji przeniesienia playlisty

W przypadku nieprawidłowego `playlistId` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nieprawidłowy ID playlisty!`

W przypadku próby użycia niebezpiecznej ścieżki zwracany jest:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`

W przypadku gdy funkcja przenosząca zwróci komunikat tekstowy zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** komunikat zwrócony przez funkcję kopiującą playlistę do archiwum

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

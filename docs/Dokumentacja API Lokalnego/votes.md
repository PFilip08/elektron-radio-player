# Endpoint status

### Opis

Ten endpoint zwraca aktualny stan pobierania głosów oraz informację, czy lista głosów jest pusta.

### Request

- **Metoda:** GET
- **Endpoint:** `/votes/status`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "downloaded": true, //boolean <true,false> oznacza czy głosy zostały już pobrane
    "emptyVotes": false //boolean <true,false> oznacza czy lista głosów z API była pusta
}
```

### Przykład

```bash
curl -X GET http://localhost:8080/votes/status
```

# Endpoint get

### Opis

Ten endpoint zwraca aktualną listę głosów zapisaną w pliku `./mp3/Votes.json`.

### Request

- **Metoda:** GET
- **Endpoint:** `/votes/get`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
[ //array <Lista głosów>
    { //object
        "id": 1, //number <ID głosu>
        "votes": 25, //number <Liczba głosów>
        "created_at": "2026-07-05", //string <Data utworzenia głosu>
        "uSongs": { //object <Informacje o piosence>
            "title": "Never Gonna Give You Up", //string <Tytuł piosenki>
            "artist": "Rick Astley", //string <Nazwa artysty>
            "url": "https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8" //string <URI piosenki>
        }
    }
]
```

W przypadku gdy plik z głosami nie istnieje zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Brak pliku!!`

W przypadku błędu podczas pobierania głosów zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X GET http://localhost:8080/votes/get
```

# Endpoint del

### Opis

Ten endpoint usuwa głos o podanym ID z pliku `./mp3/Votes.json`.

### Request

- **Metoda:** DELETE
- **Endpoint:** `/votes/del/:id`
- **Parametry ścieżki:**
  - `id` - Parametr wymagany, ID głosu do usunięcia.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `Głos usunięty`

W przypadku gdy głos o podanym ID nie zostanie znaleziony:

- **Kod statusu:** 404
- **Typ:** text/html
- **Treść:** `Głos nie znaleziony!`

W przypadku gdy plik z głosami nie istnieje zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Brak pliku!!`

W przypadku błędu podczas usuwania głosu zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd serwera podczas usuwania głosu; ...`

### Przykład

```bash
curl -X DELETE "http://localhost:8080/votes/del/1"
```

# Endpoint add

### Opis

Ten endpoint dodaje nowy głos do pliku `./mp3/Votes.json` na podstawie podanego URI piosenki.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/add`
- **Parametry zapytania:**
  - `uri` - Parametr opcjonalny, URI piosenki. Jeśli będzie pusty, to zostanie użyty domyślny link Spotify.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:**

```json
{
    "id": 2, //number <Nowo nadane ID głosu>
    "created_at": "2026-07-05", //string <Data dodania głosu>
    "party_id": 1, //number <ID imprezy/radiowęzła>
    "uSongs": { //object <Informacje o piosence pobrane przez getTrackInfo()>
        "title": "Never Gonna Give You Up", //string <Tytuł piosenki>
        "artist": "Whenever You Need Somebody", //string <Nazwa albumu/artysty>
        "duration": null, //null
        "thumbnail": "https://i.scdn.co/image/...", //string <Link do okładki>
        "url": "https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8", //string <URI piosenki>
        "created_at": "2026-07-05T12:00:00.000Z", //string <Data utworzenia>
        "updatedAt": "2026-07-05T12:00:00.000Z", //string <Data aktualizacji>
        "status": "active" //string <Status piosenki>
    }
}
```

W przypadku błędu podczas dodawania głosu zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Wystąpił błąd serwera; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/votes/add?uri=https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8"
```

# Endpoint reset

### Opis

Ten endpoint wymusza ponowne pobranie i nadpisanie pliku `./mp3/Votes.json` danymi z API przy pomocy funkcji `getVotesData(true)`.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/reset`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku błędu podczas resetowania głosów zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/votes/reset"
```

# Endpoint save

### Opis

Ten endpoint czyści folder `./mp3/7` (a jeżeli VLC aktualnie gra z głosów, to ubija je siłowo) i na nowo pobiera pliki mp3 na podstawie głosów.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/save`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku błędu podczas odczytywania folderu `./mp3/7` zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `dział taboretów trza zagonić do roboty`

W przypadku błędu podczas zapisywania głosów zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/votes/save"
```

# Endpoint downloadVotes

### Opis

Ten endpoint czyści folder `./mp3/7` i pobiera piosenki z głosowania dla podanej daty.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/downloadVotes`
- **Parametry zapytania:**
  - `date` - Parametr opcjonalny, data (w formacie `YYYY-MM-DD`), z której mają zostać pobrane głosy.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku gdy dla podanej daty nie ma żadnych głosów do pobrania:

- **Kod statusu:** 410
- **Typ:** text/html
- **Treść:** `brak danych`

W przypadku błędu podczas odczytywania folderu `./mp3/7` zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `dział taboretów trza zagonić do roboty`

W przypadku błędu podczas pobierania głosów zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/votes/downloadVotes?date=2026-07-05"
```

# Endpoint download

### Opis

Ten endpoint pobiera pliki mp3 dla wszystkich głosów zapisanych aktualnie w pliku `./mp3/Votes.json`.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/download`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku gdy plik `./mp3/Votes.json` jest pusty i nie ma danych do pobrania:

- **Kod statusu:** 410
- **Typ:** text/html
- **Treść:** `brak danych`

W przypadku błędu podczas pobierania mp3 zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/votes/download"
```

# Endpoint delmp3

### Opis

Ten endpoint usuwa wszystkie pliki mp3 z folderu `./mp3/7` (a jeżeli VLC aktualnie odtwarza głosy, to ubija je siłowo).

### Request

- **Metoda:** DELETE
- **Endpoint:** `/votes/delmp3`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku błędu podczas odczytywania folderu `./mp3/7` zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `dział taboretów trza zagonić do roboty`

W przypadku błędu podczas usuwania plików mp3 zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd; Skontaktuj się z działem taboretów; ...`

### Przykład

```bash
curl -X DELETE "http://localhost:8080/votes/delmp3"
```

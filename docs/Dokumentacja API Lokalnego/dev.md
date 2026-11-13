# Endpoint resetTasks

### Opis

Ten endpoint resetuje harmonogram zadań ELP wymuszając odpalenie funkcji massSchedule().

### Request

- **Metoda:** POST
- **Endpoint:** `/dev/schedules/resetTasks`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 202
- **Typ:** text/html
- **Treść:** `resetd`

### Przykład

```bash
curl -X POST "http://localhost:8080/dev/schedules/resetTasks"
```

# Endpoint cleanTasks

### Opis

Ten endpoint czyści zaplanowane zadania ELP ale nie wymusza uruchomienia funkcji massSchedule() aby ponownie je zaplanować.

### Request

- **Metoda:** POST
- **Endpoint:** `/dev/schedules/cleanTasks`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 202
- **Typ:** text/html
- **Treść:** `cleaned`

### Przykład

```bash
curl -X POST "http://localhost:8080/dev/schedules/cleanTasks"
```

# Endpoint removeTask

### Opis

Ten endpoint usuwa wskazane zadanie z harmonogramu.

### Request

- **Metoda:** DELETE
- **Endpoint:** `/dev/schedules/removeTask`
- **Parametry zapytania:**
	- `name` - Parametr wymagany, nazwa zadania do usunięcia.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `Zadanie "<nazwa zadania> - <data DD.MM.YYYY HH:MM:SS>" zostało usunięte!`

W przypadku braku parametru `name` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Brak nazwy zadania!`

W przypadku gdy zadanie o takiej nazwie nie istnieje zwracany jest:

- **Kod statusu:** 404
- **Typ:** text/html
- **Treść:** `Nie znaleziono zadania o nazwie: <nazwa zadania> - <data DD.MM.YYYY HH:MM:SS>`

W przypadku błędu podczas usuwania zadania zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd podczas usuwania zadania: <stacktrace>`

### Przykład

```bash
curl -X DELETE "http://localhost:8080/dev/schedules/removeTask?name=testTask"
```

# Endpoint addTask

### Opis

Ten endpoint dodaje nowe zadanie do harmonogramu.

### Request

- **Metoda:** POST
- **Endpoint:** `/dev/schedules/addTask`
- **Typ danych:** `application/x-www-form-urlencoded`
- **Parametry formularza:**
	- `taskName` - Parametr wymagany, nazwa zadania.
	- `taskType` - Parametr wymagany, typ zadania przyjmuje on wartość `playMusic`, `playPlaylist`,`killPlayer` lub `inne`.
	- `taskDate` - Parametr wymagany, data wykonania zadania.
	- `taskData` - Parametr opcjonalny, JSON z dodatkowymi danymi zadania wymagany gdy `taskType` ma wartość `playMusic`, `playPlaylist` lub `inne`
        - Dla `taskType=playMusic` podajemy JSON z kluczem `filename` który przyjmuje wartość nazwy pliku do odtworzenia.
        - Dla `taskType=playPlaylist` podajemy JSON z kluczem `id` który przyjmuje wartość ID playlisty do odtworzenia.
        - Dla `taskType=inne` podajemy JSON z kluczem `action` który przyjmuje wartość `autoRemoveFiles`, `downloadVotes` lub `miscTask`.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 302
- **Typ:** text/html
- **Treść:** przekierowanie na `/dev/schedules/addTask?status=added`

W przypadku błędnego JSON-a w `taskData` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nieprawidłowy JSON w polu taskData!`

W przypadku braku wymaganych pól zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano wszystkich wymaganych pól!`

W zależności od `taskType` mogą wystąpić dodatkowe błędy:

- W przypadku `taskType=playMusic` gdy w jsonie nie podano `filename` zwracany jest:
    - **Kod statusu:** 400
    - **Typ:** text/html
    - **Treść:** `Nie podano nazwy pliku!`
- W przypadku `taskType=playPlaylist` gdy w jsonie nie podano `id` zwracany jest:
    - **Kod statusu:** 400
    - **Typ:** text/html
    - **Treść:** `Nie podano ID playlisty!`
- W przypadku `taskType=inne` gdy w jsonie nie podano `action` lub jest on nieznany zwracany jest:
    - **Kod statusu:** 400
    - **Typ:** text/html
    - **Treść:** `Nieznana akcja dla zadania "inne" w polu taskData!`
- W przypadku gdy `taskType` ma niepoprawną wartość zwracany jest:
    - **Kod statusu:** 400
    - **Typ:** text/html
    - **Treść:** `Nieznany typ zadania!`


### Przykład

```bash
curl -X POST "http://localhost:8080/dev/schedules/addTask" \
    -d "taskName=testTask" \
    -d "taskType=killPlayer" \
    -d "taskDate=2026-07-05T12:00:00.000Z"
```

# Endpoint restart

### Opis

Ten endpoint kończy proces aplikacji (i automatycznie uruchamia ponownie jeżeli ELP działa z daemonem typu pm2).

### Request

- **Metoda:** POST
- **Endpoint:** `/dev/action/restart`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 202
- **Typ:** text/html
- **Treść:** `Kopanie wszystkiego...`

### Przykład

```bash
curl -X POST "http://localhost:8080/dev/action/restart"
```

# Endpoint downloadYToverride

### Opis

Ten endpoint pobiera materiał z YouTube do wskazanego folderu i opcjonalnie uruchamia tryb override.

### Request

- **Metoda:** POST
- **Endpoint:** `/dev/action/downloadYToverride`
- **Parametry zapytania:**
  - `url` - Parametr wymagany, adres materiału do pobrania z YT.
  - `override` - Parametr opcjonalny, jeśli ma wartość `true`, odtwarzanie zostanie uruchomione po pobraniu.
  - `path` - Parametr opcjonalny, ścieżka docelowa zaczynająca się od `./mp3/`. Domyślnie `./mp3/onDemand/`.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:**
  - Gdy `override=true`:
    - `gut, override, <ścieżka pliku>`
  - Gdy `override` nie jest ustawione na `true`:
    - `gut, <ścieżka pliku>`

W przypadku gdy parametr `url` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano URL!`

W przypadku niepoprawnej ścieżki (gdy jej długość jest mniejsza niż 6 znaków lub gdy nie zaczyna się od `./mp3/`) zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Niepoprawna ścieżka!`

### Przykład

```bash
curl -X POST "http://localhost:8080/dev/action/downloadYToverride?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&override=true"
```

# Endpoint resetRecoveryLock

### Opis

Ten endpoint resetuje blokadę trybu recovery dla `getApiData`.

### Request

- **Metoda:** POST
- **Endpoint:** `/dev/action/resetRecoveryLock`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:**
  - Gdy blokada trybu recovery dla `getApiData` została zresetowana:
    - `Zresetowano blokadę trybu recovery dla getApiData`
  - Gdy blokada trybu recovery dla `getApiData` nie była ustawiona:
    - `Funkcja getApiData nie była zablokowana, więc nie można było zdjąć blokady`

### Przykład

```bash
curl -X POST "http://localhost:8080/dev/action/resetRecoveryLock"
```

# Endpoint devAPI

### Opis

Ten endpoint zarządza stanem DevAPI oraz trybem mock danych (a w przypadku wywołania GET bez parametru `action` renderuje widok panelu DevAPI).

### Request

- **Metoda:** GET / POST
- **Endpoint:** `/dev/api`
- **Parametry zapytania:**
  - `action` - Parametr opcjonalny, możliwe wartości to `on`, `off`, `status` oraz `reschedule`.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**
  - dla `action=on`:
    ```json
    {
        "success": true, //boolean <true,false>
        "message": "DevAPI włączone - używanie mock danych i zreschedulowanie tasków", //string <Komunikat>
        "devAPIEnabled": true //boolean <Stan DevAPI>
    }
    ```
  - dla `action=off`:
    ```json
    {
        "success": true, //boolean <true,false>
        "message": "DevAPI wyłączone - używanie main API i zreschedulowanie tasków", //string <Komunikat>
        "devAPIEnabled": false //boolean <Stan DevAPI>
    }
    ```
  - dla `action=status`:
    ```json
    {
        "success": true, //boolean <true,false>
        "devAPIEnabled": false, //boolean <Stan DevAPI>
        "overrideTarget": "partyvote.ciac.me", //string <Adres głównego API>
        "mockData": {} //object <Aktualnie ustawione dane mock>
    }
    ```
  - dla `action=reschedule` (gdy DevAPI jest włączone):
    ```json
    {
        "success": true, //boolean <true,false>
        "message": "Taski zreschedulowane z DevAPI data" //string <Komunikat>
    }
    ```
  - dla `action=reschedule` (gdy DevAPI jest wyłączone):
    ```json
    {
        "success": false, //boolean <true,false>
        "message": "zaś DevAPI wyłączone" //string <Komunikat>
    }
    ```

W przypadku gdy parametr `action` ma niepoprawną wartość:

- **Kod statusu:** 400
- **Typ:** application/json
- **Treść:**

```json
{
    "error": "Niestety to nie koncert życzeń", //string <Komunikat o błędzie>
    "availableActions": ["on", "off", "status", "reschedule"] //array <Dostępne akcje>
}
```

W przypadku błędu serwera zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:**

```json
{
    "error": "Taboretowy error serwera", //string <Komunikat o błędzie>
    "message": "..." //string <Treść błędu>
}
```

### Przykład

```bash
curl -X GET "http://localhost:8080/dev/api?action=status"
```

# Endpoint timeTables

### Opis

Ten endpoint pobiera oraz aktualizuje mockowane dane harmonogramu (`timeTables`) dla DevAPI.

### Request

- **Metoda:** GET / POST
- **Endpoint:** `/dev/api/timeTables`

### Response

#### W przypadku GET
W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "timeTable": [ //array <Tablica z harmonogramem>
        { //object
            "isOn": true, //boolean <Czy automat jest włączony>
            "currentPlaylistId": 1, //number <ID aktualnej playlisty>
            "timeRules": { //object <Zasady godzinowe>
                "rules": {
                    "1": []
                },
                "applyRule": {
                    "Fri": 1, "Mon": 1, "Sat": 0, "Sun": 0, "Thu": 1, "Tue": 1, "Wed": 1
                }
            }
        }
    ],
    "lastUpdated": "2026-07-05T12:00:00.000Z" //string <Data ostatniego odczytu>
}
```

#### W przypadku POST
W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "success": true, //boolean <true,false>
    "message": "Zaktualizowano dane TimeTables i zreschedulowano taski" //string <Komunikat (lub informacja że DevAPI jest wyłączone i nie zreschedulowano tasków)>
}
```

W przypadku błędu serwera zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:**

```json
{
    "error": "Taboretowy error serwera", //string <Komunikat o błędzie>
    "message": "..." //string <Treść błędu>
}
```

### Przykład

```bash
curl -X GET "http://localhost:8080/dev/api/timeTables"
```

# Endpoint votes

### Opis

Ten endpoint pobiera oraz aktualizuje mockowane dane głosów (`votes`) dla DevAPI.

### Request

- **Metoda:** GET / POST
- **Endpoint:** `/dev/api/votes`

### Response

#### W przypadku GET
W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "playlist": [ //array <Lista mockowanych głosów>
        { //object
            "id": 1, //number <ID głosu>
            "votes": 25, //number <Liczba głosów>
            "created_at": "2026-07-05", //string <Data utworzenia>
            "uSongs": { //object
                "url": "https://music.youtube.com/watch?v=c3Pd7nH7Y40", //string <Link do piosenki>
                "title": "DevAPI - L'amour Toujours" //string <Tytuł piosenki>
            }
        }
    ]
}
```

#### W przypadku POST
W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**

```json
{
    "success": true, //boolean <true,false>
    "message": "Zaktualizowano dane Votes" //string <Komunikat>
}
```

W przypadku błędu serwera zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:**

```json
{
    "error": "Taboretowy error serwera", //string <Komunikat o błędzie>
    "message": "..." //string <Treść błędu>
}
```

### Przykład

```bash
curl -X GET "http://localhost:8080/dev/api/votes"
```

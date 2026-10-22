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

Ten endpoint kończy proces aplikacji (i automatycznie uruchamia ponownie jeżeli działa ELP działa z deamonem typu pm2).

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

W przypadku braku parametru `url` zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano URL!`

W przypadku niepoprawnej ścieżki (gdy jej długość przekracza 6 znaków oraz gdy nie zaczyna się od `./mp3/`) zwracany jest:

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

Ten endpoint zarządza stanem DevAPI i trybem mock danych.

### Request

- **Metoda:** GET / POST
- **Endpoint:** `/dev/api`
- **Parametry zapytania:**
	- `action` - Parametr opcjonalny, możliwe wartości to `on`, `off`, `status`, `reschedule`.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**
	- dla `action=on` zwracany jest obiekt z `success: true` i `devAPIEnabled: true`
	- dla `action=off` zwracany jest obiekt z `success: true` i `devAPIEnabled: false`
	- dla `action=status` zwracany jest obiekt z aktualnym stanem `devAPIEnabled`, `overrideTarget` i `mockData`
	- dla `action=reschedule` zwracany jest obiekt z informacją o ponownym schedulowaniu lub komunikatem, że DevAPI jest wyłączone

W przypadku braku parametru `action` lub nieobsługiwanej wartości zwracany jest:

- **Kod statusu:** 400
- **Typ:** application/json
- **Treść:** obiekt z błędem i listą dostępnych akcji

W przypadku błędu zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:** obiekt z błędem serwera

### Przykład

```bash
curl "http://localhost:8080/dev/api?action=status"
```

# Endpoint timeTables

### Opis

Ten endpoint pobiera i aktualizuje dane timetable dla DevAPI.

### Request

- **Metoda:** GET / POST
- **Endpoint:** `/dev/api/timeTables`

### Response

W przypadku metody GET zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** obiekt z polem `timeTable` oraz `lastUpdated`

W przypadku metody POST zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** `success: true` oraz komunikat o zaktualizowaniu danych TimeTables

W przypadku błędu zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:** obiekt z błędem serwera

### Przykład

```bash
curl "http://localhost:8080/dev/api/timeTables"
```

# Endpoint votes

### Opis

Ten endpoint pobiera i aktualizuje dane głosów dla DevAPI.

### Request

- **Metoda:** GET / POST
- **Endpoint:** `/dev/api/votes`

### Response

W przypadku metody GET zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** obiekt z polem `playlist`

W przypadku metody POST zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** `success: true` oraz komunikat o zaktualizowaniu danych Votes

W przypadku błędu zwracany jest:

- **Kod statusu:** 500
- **Typ:** application/json
- **Treść:** obiekt z błędem serwera

### Przykład

```bash
curl "http://localhost:8080/dev/api/votes"
```

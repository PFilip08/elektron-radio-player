# Endpoint status

### Opis

Ten endpoint zwraca podstawowy stan modułu głosów.

### Request

- **Metoda:** GET
- **Endpoint:** `/votes/status`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** obiekt z polami `downloaded` oraz `emptyVotes`

### Przykład

```bash
curl "http://localhost:8080/votes/status"
```

# Endpoint get

### Opis

Ten endpoint zwraca aktualną listę głosów z pliku danych.

### Request

- **Metoda:** GET
- **Endpoint:** `/votes/get`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:** zawartość pliku z głosami

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
curl "http://localhost:8080/votes/get"
```

# Endpoint del

### Opis

Ten endpoint usuwa głos o podanym identyfikatorze.

### Request

- **Metoda:** DELETE
- **Endpoint:** `/votes/del/:id`
- **Parametry ścieżki:**
	- `id` - Parametr wymagany, identyfikator głosu do usunięcia.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `Głos usunięty`

W przypadku gdy głos nie zostanie znaleziony zwracany jest:

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

Ten endpoint dodaje nowy głos na podstawie wskazanego URI utworu.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/add`
- **Parametry zapytania:**
	- `uri` - Parametr opcjonalny, URI utworu. Jeśli nie zostanie podany, używany jest domyślny adres Spotify.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** nowo utworzony obiekt głosu

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

Ten endpoint resetuje dane głosów do stanu pobieranego z zewnętrznego źródła.

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

Ten endpoint zapisuje aktualne głosy i pobiera odpowiadające im pliki do folderu z plikami mp3.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/save`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

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

Ten endpoint pobiera pliki dla głosów, opcjonalnie według wskazanej daty.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/downloadVotes`
- **Parametry zapytania:**
	- `date` - Parametr opcjonalny, data używana do pobrania zestawu głosów.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku gdy nie ma danych do pobrania zwracany jest:

- **Kod statusu:** 410
- **Typ:** text/html
- **Treść:** `brak danych`

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

Ten endpoint pobiera pliki mp3 dla wszystkich zapisanych głosów.

### Request

- **Metoda:** POST
- **Endpoint:** `/votes/download`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku gdy nie ma danych do pobrania zwracany jest:

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

Ten endpoint usuwa pliki mp3 z folderu używanego przez głosy.

### Request

- **Metoda:** DELETE
- **Endpoint:** `/votes/delmp3`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `ok`

W przypadku błędu podczas usuwania plików mp3 zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `dział taboretów trza zagonić do roboty`

### Przykład

```bash
curl -X DELETE "http://localhost:8080/votes/delmp3"
```

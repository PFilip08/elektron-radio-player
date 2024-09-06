# Endpoint /(root)

### Opis

Ten endpoint pobiera piosenkę z podanego URI.
### Request

- **Metoda:** GET
- **Endpoint:** `/download/`
- **Parametry zapytania:**
  - `uri` - URI piosenki do pobrania.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `gut`
W przypadku gdy parametr `uri` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano linku!`
W przypadku gdy nie można będzie wykryć typu linku z parametru `uri` bądź link nie będzie poprawny:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Nie można wykryć typu linku Spotify!`

### Przykład

```bash
curl -X GET "http://localhost:8080/download/?uri=https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8"
```

# Endpoint override

### Opis

Ten endpoint pobiera piosenkę z podanego URI i odtwarza ją z opóźnieniem 3 sekund.

### Request

- **Metoda:** GET
- **Endpoint:** `/download/override`
- **Parametry zapytania:**
  - `uri` - URI piosenki do pobrania.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `gut, 3s opóźnienia`
W przypadku gdy parametr `uri` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano linku!`
W przypadku gdy nie można będzie wykryć typu linku z parametru `uri` bądź link nie będzie poprawny:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Nie można wykryć typu linku Spotify!`

### Przykład

```bash
curl -X GET "http://localhost:8080/download/override?uri=https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8"
```

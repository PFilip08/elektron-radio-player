# Endpoint /(root)
### Opis
Ten endpoint pobiera piosenkę z podanego URI.
### Request
- **Metoda:** GET
- **Endpoint:** `/download/`
- **Parametry zapytania:**
    - `uri` - URI piosenki do pobrania.
### Response
- **Kod statusu:** 201
- **Treść:** `gut`
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
- **Kod statusu:** 201
- **Treść:** `gut, 3s opóźnienia`
### Przykład
```bash
curl -X GET "http://localhost:8080/download/override?uri=https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8"
```
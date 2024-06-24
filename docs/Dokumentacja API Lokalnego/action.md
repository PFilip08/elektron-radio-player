# Endpoint kill

### Opis
Ten endpoint zatrzymuje odtwarzacz muzyki.

### Request
- **Metoda:**: POST
- **Endpoint:** `/action/kill`
### Response
- **Kod statusu:** 201
- **Treść:** `gut`

### Przykład
```bash
curl -X POST http://localhost:8080/action/kill
```
# Endpoint playMusic
### Opis
Ten endpoint odtwarza określony plik muzyczny.

### Request
- **Metoda:** GET
- **Endpoint:** `/action/playMusic`
- **Parametry zapytania:**
    - `file` - Nazwa pliku muzycznego do odtworzenia.
### Response
- Kod statusu: 201
- Treść: gut
### Przykład
```bash
curl -X GET "http://localhost:8080/action/playMusic?file=song.mp3"
```
# Endpoint playPlaylist
### Opis
Ten endpoint odtwarza określoną playlistę.

### Request
- **Metoda:** GET
- **Endpoint:** `/action/playPlaylist`
- **Parametry zapytania:**
    - `id` - ID playlisty do odtworzenia.
### Response
- Kod statusu: 201
- Treść: gut
### Przykład
```bash
curl -X GET "http://localhost:8080/action/playPlaylist?id=1"
```

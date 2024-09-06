# Endpoint kill

### Opis
Ten endpoint zatrzymuje odtwarzacz muzyki.

### Request
- **Metoda:** GET
- **Endpoint:** `/action/kill`
- **Parametry zapytania:**
    - `force` - Parametr opcjonalny, jeśli zostanie podany to zatrzymuje odtwarzacz muzyki siłowo.
### Response
W przypadku powodzenia i gdy parametr `force` nie został podany to zwracany jest:
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `gut`
W przypadku gdy parametr `force` został podany:
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `force gut`
### Przykład
```bash
curl -X GET http://localhost:8080/action/kill
```
# Endpoint play
### Opis
Ten endpoint odtwarza określony plik muzyczny.

### Request
- **Metoda:** GET
- **Endpoint:** `/action/play`
- **Parametry zapytania:**
    - `file` - Nazwa pliku muzycznego do odtworzenia.
### Respons
W przypadku powodzenia zwracany jest:
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut
W przypadku gdy parametr `file` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** Nie podano nazwy pliku!
W przypadku gdy użytkownik próbował podać ścieżkę która by uciekła poza folder mp3:
- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:**Niebezpieczna ścieżka!
### Przykład
```bash
curl -X GET "http://localhost:8080/action/play?file=song"
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
W przypadku powodzenia zwracany jest:
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut
W przypadku gdy parametr `id` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** Nie podano numeru playlisty!
W przypadku gdy użytkownik próbował podać ścieżkę która by uciekła poza folder z mp3:
- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** Niebezpieczna ścieżka!
### Przykład
```bash
curl -X GET "http://localhost:8080/action/playPlaylist?id=1"
```
# Endpoint vlcPlay
### Opis
Ten endpoint pozwala na zatrzymanie/wznowienie muzyki w działającym VLC.
### Request
- **Metoda:** GET
- **Endpoint:** `/action/vlcPlay`
### Response
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut
### Przykład
```bash
curl -X GET http://localhost:8080/action/vlcPlay
```
# Endpoint vlcNext
### Opis
Ten endpoint pozwala na przejście do następnego utworu w działającym VLC.
### Request
- **Metoda:** GET
- **Endpoint:** `/action/vlcNext`
### Response
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut
### Przykład
```bash
curl -X GET http://localhost:8080/action/vlcNext
```
# Endpoint vlcPrevious
### Opis
Ten endpoint pozwala na przejście do poprzedniego utworu w działającym VLC.
### Request
- **Metoda:** GET
- **Endpoint:** `/action/vlcPrevious`
### Response
- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut
### Przykład
```bash
curl -X GET http://localhost:8080/action/vlcPrevious
```
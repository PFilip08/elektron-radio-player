#Poprawka
# Endpoint kill

### Opis

Ten endpoint zatrzymuje odtwarzacz muzyki.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/kill`
- **Parametry zapytania:**
  - `force` - Parametr opcjonalny, jeśli zostanie podany, to zatrzymuje odtwarzacz muzyki siłowo.

### Response
W przypadku powodzenia i gdy parametr `force` nie został podany, to zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `gut`

W przypadku gdy parametr `force` został podany:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `force gut`

### Przykład

```bash
curl -X POST http://localhost:8080/action/kill
```

# Endpoint play

### Opis

Ten endpoint odtwarza określony plik muzyczny.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/play`
- **Parametry zapytania:**
  - `file` - Nazwa pliku muzycznego do odtworzenia.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut
W przypadku gdy parametr `file` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** Nie podano nazwy pliku!
W przypadku gdy użytkownik próbował podać ścieżkę, która by uciekła poza folder mp3:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** Niebezpieczna ścieżka!

### Przykład

```bash
curl -X POST "http://localhost:8080/action/play?file=song"
```

# Endpoint playPlaylist

### Opis

Ten endpoint odtwarza określoną playlistę.

### Request

- **Metoda:** POST
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

W przypadku gdy użytkownik próbował podać ścieżkę, która by uciekła poza folder z mp3:

- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** Niebezpieczna ścieżka!

### Przykład

```bash
curl -X POST "http://localhost:8080/action/playPlaylist?id=1"
```

# Endpoint vlcPlay

### Opis

Ten endpoint pozwala na zatrzymanie/wznowienie muzyki w działającym VLC.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/vlcPlay`

### Response

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut

### Przykład

```bash
curl -X POST http://localhost:8080/action/vlcPlay
```

# Endpoint vlcNext

### Opis

Ten endpoint pozwala na przejście do następnego utworu w działającym VLC.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/vlcNext`

### Response

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut

### Przykład

```bash
curl -X POST http://localhost:8080/action/vlcNext
```

# Endpoint vlcPrevious

### Opis

Ten endpoint pozwala na przejście do poprzedniego utworu w działającym VLC.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/vlcPrevious`

### Response

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** gut

### Przykład

```bash
curl -X POST http://localhost:8080/action/vlcPrevious
```

# Endpoint vlcSzuffle

### Opis

Ten endpoint pozwala na włączenie/wyłączenie losowego odtwarzania oraz zwrócenie informacji o jego stanie w działającym VLC.

### Request

- **Metoda:** GET
- **Endpoint:** `/action/vlcShuffle`
- **Parametry zapytania:**
  - `state` - Parametr wymagany z wartością `check`, zwraca aktualny stan szuffle.

- **Metoda:** POST
- **Endpoint:** `/action/vlcShuffle`
- **Parametry zapytania:**
  - `state` - Parametr wymagany, jeśli zostanie podany, to ustawia stan szuffle. Może przyjmować wartości `true` lub `false`.

### Response

#### W przypadku GET
W przypadku powodzenia i podania w parametrze `state` który będzie miał wartość `check` zostanie użyta to zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `true` lub `false` w zależności od aktualnego stanu szuffle.

W przypadku powodzenia i bez podania parametru `state` lub bez wartości `check` zostanie użyty to zwracany jest:

- **Kod statusu:** 405
- **Typ:** text/html
- **Treść:** `Nie ta metoda!`

#### W przypadku POST
W przypadku powodzenia i podania w parametrze `state` który będzie miał wartość `true` lub `false` to zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `Szuffle true` lub `Szuffle false` w zależności od ustawionego stanu szuffle.

W przypadku powodzenia i bez podania parametru `state` lub bez wartości `true` lub `false` to zwracany jest:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano stanu!`

### Przykład

```bash
curl -X GET http://localhost:8080/action/vlcShuffle?state=check
```

# Endpoint delFiles

### Opis
Ten endpoint pozwala na usunięcie plików z playlisty 7.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/delFiles`
- **Parametry zapytania:**
  - `path` - ID playlisty z której mają zostać usunięte pliki.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `usunło chyba`

W przypadku gdy parametr `path` nie został podany bądź będzie pusty:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano ścieżki do pliku!`

### Przykład

```bash
curl -X POST "http://localhost:8080/action/delFiles?path=7"
```

# Endpoint normalize

### Opis

Ten endpoint pozwala na normalizację playlisty przy pomocy mp3gain.

### Request

- **Metoda:** POST
- **Endpoint:** `/action/normalize`
- **Parametry zapytania:**
  - `playlist` - ID playlisty do znormalizowania.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** Zwracany jest output bezpośrednio z mp3gain np. `./mp3/4/Chivas_Zabij_Dla_Mnie.mp3 No changes to ./mp3/4/Chivas_Zabij_Dla_Mnie.mp3 are necessary`

W przypadku gdy podano parametr `playlist` a w folderze z playlistą nie ma plików mp3:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `error/brakplikuf!!`

W przypadku gdy parametr `playlist` posiada dwukropki w nazwie:

- **Kod statusu:** 511
- **Typ:** text/html
- **Treść:** `a dzie masło roota?!?!1`

W przypadku gdy podano parametr `playlist` a w folder z playlistą nie istnieje:

- **Kod statusu:** 406
- **Typ:** text/html
- **Treść:** `playlista nie istnieje lub to nie playlista!!`

### Przykład

```bash
curl -X POST "http://localhost:8080/action/normalize?playlist=4"
```

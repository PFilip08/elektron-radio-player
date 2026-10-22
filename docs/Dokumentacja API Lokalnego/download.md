> [!CAUTION]
> Dokumentacja od API NIEAKTUALNA!!! Może kiedyś ktoś ją zaaktualizuje
# Endpoint /(root)

### Opis

Ten endpoint pobiera piosenkę z podanego URI.
### Request

- **Metoda:** POST
- **Endpoint:** `/download/`
- **Parametry zapytania:**
  - `uri` - Parametr wymagany, URI piosenki do pobrania.
  - `path` - Parametr opcjonalny, jeśli zostanie podany, to piosenka zostanie pobrana do podanej ścieżki. Jeśli nie zostanie podany, to piosenka zostanie pobrana do folderu onDemand.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** np. `gut: Pobrano OwO` bo może być też wariant komunikatu że skopiowano z archiwum albo że plik już istnieje i nie trzeba go pobierać
W przypadku nieudania się pobrania piosenki zwracany jest:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** Zwracany jest downloadReason którym może być np. (w sumie nie używane do niczego, ale może kiedyś będzie)
W przypadku gdy parametr `path` próbował podać ścieżkę, która by uciekła poza folder mp3:
- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`
W przypadku gdy parametr `uri` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano linku!`
W przypadku gdy nie można będzie wykryć typu linku z parametru `uri` bądź link nie będzie poprawny:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Nie można wykryć typu linku!`

### Przykład

```bash
curl -X POST "http://localhost:8080/download/?uri=https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8"
```

# Endpoint override

### Opis

Ten endpoint pobiera piosenkę z podanego URI i odtwarza ją z opóźnieniem 3 sekund.

### Request

- **Metoda:** POST
- **Endpoint:** `/download/override`
- **Parametry zapytania:**
  - `uri` - Parametr wymagany, URI piosenki do pobrania.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 201
- **Typ:** text/html
- **Treść:** `gut, 1s opóźnienia`
W przypadku nieudania się pobrania piosenki zwracany jest:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** Zwracany jest downloadReason którym może być np. (w sumie nie używane do niczego, ale może kiedyś będzie)
W przypadku gdy parametr `uri` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano linku!`
W przypadku gdy nie można będzie wykryć typu linku z parametru `uri` bądź link nie będzie poprawny:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Nie można wykryć typu linku!`

### Przykład

```bash
curl -X POST "http://localhost:8080/download/override?uri=https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8"
```

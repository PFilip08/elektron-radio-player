# Endpoint confident

### Opis
Ten endpoint służy mechanizmowi blokady panelu na raportowanie zdarzeń związanych z czasową blokadą panelu np. aby nie puszczać muzyki w trakcie lekcji albo w weekendy.

### Request

- **Metoda:** POST
- **Endpoint:** `/security/confident`
- **Parametry zapytania:**
    - `type` - Parametr wymagany, możliwe wartości to `safeguardd`, `safeguarde`, `weekend`, `weekenda`, `lesson`, `lessona`, `hebel`, `after` lub `logicfail`

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `gut confident`

W przypadku gdy parametr `type` nie został podany bądź będzie pusty lub niepoprawny:

- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nieznany typ logu`

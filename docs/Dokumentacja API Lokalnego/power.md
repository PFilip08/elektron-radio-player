# Endpoint wzmak

### Opis

Ten endpoint steruje wzmacniaczem oraz pozwala odczytać jego status energetyczny.

### Request

- **Metoda:** GET
- **Endpoint:** `/power/wzmak`
- **Parametry zapytania:**
	- `action` - Parametr wymagany, możliwe wartości to `status`.

- **Metoda:** POST
- **Endpoint:** `/power/wzmak`
- **Parametry zapytania:**
    - `action` - Parametr wymagany, możliwe wartości to `on` oraz `off`.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**
	- dla `action=status` TYLKO WYSŁANY JAKO GET zwracany jest obiekt `StatusSNS.ENERGY` z urządzenia
        ```json
        {
            "Power":0, // float moc chwilowa w Watach
            "ApparentPower":1.831964, // float moc pozorna w VA
            "ReactivePower":1.831964, // float moc bierna w VAR
            "Factor":0, // float współczynnik mocy
            "Voltage":228.99562, // float napięcie w Voltach
            "Current":0.007999, // float prąd w Amperach
            "Frequency":0, // float częstotliwość w Hz
            "ConsumptionTotal":4865.253906, // float całkowite zużycie energii w kWh
            "Yesterday":0.118649, // float zużycie energii w kWh wczoraj
            "ConsumptionLastHour":0 // float zużycie energii w kWh w ostatniej godzinie
        }
        ```
	- dla `action=on` zwracana jest odpowiedź urządzenia po włączeniu wzmacniacza
        ```json
        {
            "POWER":"ON" // string <ON|OFF> stan urządzenia
        }
        ```
	- dla `action=off` zwracana jest odpowiedź urządzenia po wyłączeniu wzmacniacza
        ```json
        {
            "POWER":"OFF" // string <ON|OFF> stan urządzenia
        }
        ```

W przypadku gdy parametr `action` ma niepoprawną wartość (np. podamy action jako on dla GET) lub nie został podany:

- **Kod statusu:** 402
- **Typ:** text/html
- **Treść:** `nieznanen`

W przypadku błędu komunikacji z wtyczką zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd komunikacji z wtyczką; ...`

### Przykład

```bash
curl -X GET "http://localhost:8080/power/wzmak?action=status"
```

# Endpoint mixer

### Opis

Ten endpoint steruje mikserem oraz pozwala odczytać jego status energetyczny.

### Request

- **Metoda:** GET
- **Endpoint:** `/power/mixer`
- **Parametry zapytania:**
	- `action` - Parametr wymagany, możliwe wartości to `status`.

- **Metoda:** POST
- **Endpoint:** `/power/mixer`
- **Parametry zapytania:**
    - `action` - Parametr wymagany, możliwe wartości to `on` oraz `off`.

### Response

W przypadku powodzenia zwracany jest:

- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**
	- dla `action=status` TYLKO WYSŁANY JAKO GET zwracany jest obiekt `StatusSNS.ENERGY` z urządzenia
        ```json
        {
            "Power":0, // float moc chwilowa w Watach
            "ApparentPower":1.831964, // float moc pozorna w VA
            "ReactivePower":1.831964, // float moc bierna w VAR
            "Factor":0, // float współczynnik mocy
            "Voltage":228.99562, // float napięcie w Voltach
            "Current":0.007999, // float prąd w Amperach
            "Frequency":0, // float częstotliwość w Hz
            "ConsumptionTotal":4865.253906, // float całkowite zużycie energii w kWh
            "Yesterday":0.118649, // float zużycie energii w kWh wczoraj
            "ConsumptionLastHour":0 // float zużycie energii w kWh w ostatniej godzinie
        }
        ```
	- dla `action=on` zwracana jest odpowiedź urządzenia po włączeniu miksera
        ```json
        {
            "POWER":"ON" // string <ON|OFF> stan urządzenia
        }
        ```
	- dla `action=off` zwracana jest odpowiedź urządzenia po wyłączeniu miksera
        ```json
        {
            "POWER":"OFF" // string <ON|OFF> stan urządzenia
        }
        ```

W przypadku gdy parametr `action` ma niepoprawną wartość (np. podamy action jako on dla GET) lub nie został podany:

- **Kod statusu:** 402
- **Typ:** text/html
- **Treść:** `nieznanen`

W przypadku błędu komunikacji z wtyczką zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Błąd komunikacji z wtyczką; ...`

### Przykład

```bash
curl -X POST "http://localhost:8080/power/mixer?action=on"
```

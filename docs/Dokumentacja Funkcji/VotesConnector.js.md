# getVotesData()

`getVotesData` jest funkcją, która pobiera z API listę piosenek z głosowania i zapisuje ją lokalnie w pliku `mp3/Votes.json` (ścieżka zapisana w zmiennej `votesPath`).

Funkcja przyjmuje dwa opcjonalne argumenty:

- `force` - jeżeli jest ustawione na `true`, to wymusza zapis pobranego jsona do pliku `mp3/Votes.json` i kończy działanie funkcji
- `data` - data w formacie `YYYY-MM-DD`, dla której mają zostać pobrane głosy (jeżeli nie zostanie podana, to funkcja domyślnie sprawdza datę z wczoraj)

Na początku funkcja sprawdza, czy włączone jest DevAPI (`global.devAPIEnabled`). Jeżeli tak, to pobiera dane o głosach z lokalnego endpointu `/dev/api/votes`, a w razie błędu wraca do odpytywania głównego API.
Następnie sprawdza zmienną `messageCounter` z pliku [`ApiConnector.js`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md). Jeżeli jest ona ustawiona na `true` (czyli automat działa w trybie recovery z powodu braku internetu), to funkcja pomija pobieranie i wyświetla w konsoli ostrzeżenie o braku neta.

Gdy połączenie z internetem działa, funkcja wysyła zapytanie do serwera podanego w zmiennej `url` z doklejoną datą i oczekuje na odpowiedź w postaci jsona.
- Jeżeli został podany argument `force`, to funkcja od razu zapisuje pobraną tablicę `playlist` z jsona do pliku `mp3/Votes.json` i kończy działanie.
- Jeżeli zwrócona tablica `playlist` w jsonie jest pusta, to funkcja wyświetla w konsoli loga o braku danych i zwraca stringa `'brak'`.
- W normalnym przypadku funkcja sprawdza, czy plik `mp3/Votes.json` nie istnieje, czy jest pusty, albo czy data `created_at` pierwszego głosu w pliku różni się od sprawdzanej daty. Jeżeli którykolwiek z tych warunków jest spełniony, to zapisuje nowe dane do pliku `mp3/Votes.json` i na koniec zwraca zawartość tego pliku.

## Tryb Debugowania

Response z serwera jest zapisywany przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/VotesConnector/getVotesData/response.json`.

Gdy funkcja zapisuje pobrane głosy do pliku `mp3/Votes.json`, to zapisywane są one również przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/VotesConnector/getVotesData - download/saved_to_file.json`.

W przypadku błędu podczas pobierania głosów z API błąd zostaje zapisany przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/VotesConnector/getVotesData/error.txt`.

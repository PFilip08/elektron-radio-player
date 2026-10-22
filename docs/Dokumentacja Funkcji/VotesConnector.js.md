# getVotesData()

Funkcja `getVotesData()` odpowiada za pobieranie listy piosenek wyłonionych w głosowaniu uczniów z zewnętrznego API i zapisywanie ich do lokalnego pliku JSON (`mp3/Votes.json`).

Funkcja ta przyjmuje dwa argumenty:

- `force` - parametr opcjonalny (boolean), jeśli ustawiony na `true`, wymusza pobranie i nadpisanie pliku niezależnie od stanu lokalnego cache,
- `data` - parametr opcjonalny (string w formacie `YYYY-MM-DD`), data, dla której mają zostać pobrane głosy (domyślnie data wczorajsza).

### Działanie funkcji

1. **Obsługa DevAPI:** Jeśli włączona jest flaga `global.devAPIEnabled`, funkcja próbuje pobrać mockowane dane głosów z lokalnego endpointu `/dev/api/votes`. W razie niepowodzenia wraca do głównego API.
2. **Sprawdzenie połączenia:** Jeśli aktywny jest licznik braku połączenia (`messageCounter` z [`ApiConnector.js`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md)), funkcja pomija pobieranie i loguje ostrzeżenie o braku internetu.
3. **Pobranie danych:** Wysyła zapytanie `GET` do endpointu `${URI}/api/playlist?hostId=1&date=${date}` z nagłówkiem `User-Agent: Radio-Elektron_SAW_MONITORING v1.0`.
4. **Zapis do pliku:** Zapisuje pobraną playlistę do pliku `mp3/Votes.json` (zmienna `votesPath`), jeśli:
   - podano flagę `force`,
   - plik lokalny nie istnieje lub jest pusty,
   - data utworzenia zapisanych głosów różni się od żądanej daty.
5. Jeśli lista utworów w API jest pusta, funkcja zwraca string `'brak'`. W przeciwnym wypadku zwraca sparsowaną zawartość pliku `mp3/Votes.json`.

## Tryb Debugowania

W trybie debugowania funkcja zapisuje dane przy użyciu [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile):
- surową odpowiedź z serwera do lokalizacji `debug/VotesConnector/getVotesData/response.json`,
- zapisaną do pliku listę utworów do lokalizacji `debug/VotesConnector/getVotesData - download/saved_to_file.json`.

# Zmienne modułu

- `votesPath` - ścieżka do lokalnego pliku z danymi głosów (wartość domyślna: `./mp3/Votes.json`).


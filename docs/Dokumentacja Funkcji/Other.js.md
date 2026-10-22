# sterylizatorIP()

Funkcja `sterylizatorIP()` oczyszcza wejściowy adres IP, pozostawiając wyłącznie cyfry i kropki. W praktyce usuwa wszystkie znaki inne niż `0-9` oraz `.`.

Funkcja ta przyjmuje jeden argument:

- `input` - wejściowy adres IP (ciąg znaków).

Jeżeli przekazana wartość nie obsługuje `replace()` albo wystąpi błąd podczas przetwarzania, funkcja zwraca pusty ciąg znaków.

## Tryb debugowania

Przed przetworzeniem wejście jest zapisywane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/Other/sterylizatorIP/source.json`.

Po przetworzeniu wynik jest zapisywany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/Other/sterylizatorIP/result.json`.

W przypadku błędu zapis zostaje wykonany do `debug/Other/sterylizatorIP/catched_error`, a funkcja zwraca pusty wynik.

# sterylizator()

Funkcja `sterylizator()` przekształca wejściowy tekst, zamieniając spacje na podkreślenia i usuwając znaki spoza dozwolonego zestawu. Zostawia litery angielskie, cyfry, podkreślenia, myślniki oraz wybrane znaki z alfabetów japońskich i chińskich.

Funkcja ta przyjmuje jeden argument:

- `input` - wejściowy tekst do przetworzenia (ciąg znaków).

W przypadku gdy funkcji nie uda się przeprowadzić sterylizacji zwraca pusty wynik i zostaje zwrócony log z błędem, który wygląda tak:
!["Jak wygląda log z funkcji sterylizator mówiący o błędzie"](https://i.imgur.com/pMZFqVN.png)

Jeżeli podczas przetwarzania wystąpi błąd, funkcja zwraca pusty ciąg znaków.

## Tryb debugowania

Log informuje o tym, co zostało przekazane do funkcji w celu przesterylizowania:
!["Jak wygląda log z funkcji sterylizator w trybie debugowania"](https://i.imgur.com/kTkLLHR.png)

Przed działaniem funkcji to, co zostało przekazane do niej, zostaje zapisane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/Other/sterylizator/source.json` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu tekstu źródłowego do pliku w trybie debugowania"](https://i.imgur.com/YVIEx2K.png)

Po działaniu funkcji wysterylizowany tekst zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/Other/sterylizator/result.json` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu wyniku sterylizacji do pliku w trybie debugowania"](https://i.imgur.com/pr4RaBw.png)

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/Other/sterylizator/catched_error.txt` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/CY6y06K.png)

# pathSecurityChecker()

Funkcja `pathSecurityChecker()` sprawdza, czy podana ścieżka jest bezpieczna względem wskazanego katalogu bazowego. Domyślnie katalogiem chronionym jest `mp3/`.

Funkcja ta przyjmuje dwa argumenty:

- `filePath` - ścieżka do sprawdzenia,
- `defendingFolder` - opcjonalny katalog który ma być chroniony, Domyślnie jest to `mp3/`.

Funkcja zwraca wartości diagnostyczne opisujące wynik kontroli:

- `INVALID_PATH_ATTEMPT` - jeśli wejście nie jest ciągiem znaków.
- `EMPTY_PATH_ATTEMPT` - jeśli ścieżka jest pusta.
- `NULL_BYTE_ATTEMPT` - jeśli ścieżka zawiera znak `\0`.
- `ABSOLUTE_PATH_ATTEMPT` - jeśli ścieżka jest absolutna albo wygląda jak ścieżka absolutna z Windows lub UNC.
- `ROOT_EXIT_ATTEMPT` - jeśli po normalizacji ścieżka wychodzi poza katalog bazowy.
- `NONE` - jeśli ścieżka jest bezpieczna.

Jeżeli ścieżka zawiera np. `NULL_BYTE` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu NULL_BYTE"](https://i.imgur.com/5je7lTp.png)

Jeżeli ścieżka wiedzie do ucieczki z katalogu `mp3/` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu próby ucieczki z katalogu mp3/"](https://i.imgur.com/M35ItME.png)

Jeżeli ścieżka zawiera "dwukropki" zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu dwukropków"](https://i.imgur.com/mFFUhWT.png)

Jeżeli ścieżka nie narusza żadnego z tych warunków zwraca wartość `NONE`.

## Tryb debugowania

Log informuje o tym, co zostało przekazane do funkcji w celu sprawdzenia:
!["Jak wygląda log z funkcji pathSecurityChecker w trybie debugowania"](https://i.imgur.com/VpFDFnW.png)

Przed sprawdzeniem ścieżki zostaje ona zapisana przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/Other/pathSecurityChecker/source.json` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o zapisaniu tekstu źródłowego do pliku w trybie debugowania"](https://i.imgur.com/qijGCMe.png)

Podczas sprawdzania funkcja loguje kolejne etapy kontroli:

- sprawdzenie typu wejścia,
- sprawdzenie pustej ścieżki,
- sprawdzenie obecności `NULL_BYTE`,
- sprawdzenie ścieżki absolutnej,
- sprawdzenie wyjścia poza katalog bazowy.

Przed sprawdzeniem, czy ścieżka nie zawiera np. `NULL_BYTE` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania, czy ścieżka nie zawiera NULL_BYTE w trybie debugowania"](https://i.imgur.com/6OMy6MJ.png)

Przed sprawdzeniem, czy ścieżka nie wiedzie do ucieczki z katalogu `mp3/` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania, czy ścieżka nie wiedzie do ucieczki z katalogu mp3/ w trybie debugowania"](https://i.imgur.com/DYi2JLy.png)

Przed sprawdzeniem, czy ścieżka nie zawiera "dwukropków" zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania, czy ścieżka nie zawiera dwukropków w trybie debugowania"](https://i.imgur.com/hJRlf6q.png)

W przypadku wykrycia problemu wynik zapisywany jest również do debug logów, a funkcja zwraca odpowiedni znacznik `*_ATTEMPT`.

# killVLCatStartup()

Funkcja `killVLCatStartup()` wyszukuje procesy `vlc` uruchomione w systemie i kończy je komendą `pkill -9 vlc`.

Funkcja nie zwraca wartości. Jej celem jest ubicie VLC podczas startu aplikacji, jeżeli proces jest aktywny.

## Tryb debugowania

Jeżeli funkcja wykryje proces VLC, zapisuje jego dane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) do `debug/Other/killVLCatStartup/process`.

Jeżeli wystąpi błąd podczas wyszukiwania procesu, błąd trafia do `debug/Other/killVLCatStartup/catched_error`.

# checkIfVLCisRunning()

Funkcja `checkIfVLCisRunning()` sprawdza, czy w systemie działa jakiś proces `vlc`.

Zwraca:

- `true` - jeśli znaleziono co najmniej jeden proces VLC,
- `false` - jeśli lista procesów jest pusta.

Jeżeli podczas sprawdzania wystąpi błąd, funkcja nie maskuje go na `false`, tylko rzuca wyjątek dalej.

## Tryb debugowania

W trybie debugowania dane o błędzie zapisywane są przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) do `debug/Other/checkIfVLCisRunning/catched_error`.

# checkIfVLConVotes()

Funkcja `checkIfVLConVotes()` sprawdza, czy VLC odtwarza plik związany z sekcją głosów.

Mechanizm działania:

- próbuje połączyć się z klientem VLC pod `127.0.0.1`,
- używa portu z `process.env.VLC_PORT` albo domyślnie `4212`,
- pobiera nazwę aktualnie odtwarzanego pliku przez `getFileName()`,
- sprawdza, czy plik o takiej nazwie istnieje w `./mp3/7/`.

Funkcja jest ograniczona czasowo. Jeśli operacja nie zakończy się w około 3 sekundy, zwracany jest wynik `false`.

Zwraca:

- `true` - jeśli VLC odtwarza plik, który istnieje w `./mp3/7/`,
- `false` - jeśli nie uda się potwierdzić odtwarzania albo wystąpi błąd.

## Tryb debugowania

W przypadku błędu zapis trafia przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) do `debug/Other/checkIfVLConVotes/catched_error`.

# uint8ArrayToBase64()

Funkcja `uint8ArrayToBase64()` zamienia tablicę `Uint8Array` na ciąg Base64.

Funkcja ta przyjmuje jeden argument:

- `uint8Array` - tablica bajtów `Uint8Array` (np. dane okładki albumu).

Zwraca tekst zakodowany w Base64 utworzony z przekazanej tablicy bajtów.

# truncate()

Funkcja `truncate()` skraca przekazany napis do określonej długości.

Funkcja ta przyjmuje dwa argumenty:

- `str` - tekst wejściowy do ewentualnego skrócenia,
- `n` - maksymalna dozwolona długość tekstu.

Jeżeli długość tekstu przekracza `n`, funkcja ucina go do `n - 1` znaków. Jeżeli tekst mieści się w limicie, zwraca go bez zmian.

## Tryb debugowania

Jeżeli tekst jest skracany, funkcja zapisuje ostrzeżenie do logów z informacją o oryginalnej wartości i docelowej długości.

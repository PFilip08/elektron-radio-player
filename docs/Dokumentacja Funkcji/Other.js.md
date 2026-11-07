# sterylizatorIP()

Funkcja `sterylizatorIP()` działa na bardzo podobnej zasadzie co funkcja [`sterylizator()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Other.js.md#sterylizator), z tą różnicą, że służy do oczyszczania przekazanego adresu IP i zostawia w nim wyłącznie cyfry oraz kropki (usuwa wszystko inne niż `0-9` oraz `.`).

W przypadku gdy funkcji nie uda się przeprowadzić sterylizacji IP, zwraca pusty wynik i wyświetla w konsoli loga z błędem.

## Tryb Debugowania

Przed działaniem funkcji to, co zostało przekazane do niej, zostaje zapisane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizatorIP/source.json``.

Po działaniu funkcji wysterylizowane IP zostaje zapisane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizatorIP/result.json``.

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizatorIP/catched_error.txt``.

# sterylizator()

Funkcja `sterylizator()` jest używana do przekształcania wejściowego ciągu znaków, zamieniając spacje na podkreślenia oraz usuwając wszystkie znaki niealfabetyczne z wyjątkiem podkreśleń, myślników i niektórych znaków z języka japońskiego oraz chińskiego.

W przypadku gdy funkcji nie uda się przeprowadzić sterylizacji zwraca pusty wynik i zostaje zwrócony log z błędem, który wygląda tak:
!["Jak wygląda log z funkcji sterylizator mówiący o błędzie"](https://i.imgur.com/pMZFqVN.png)

## Tryb Debugowania

Log informuje o tym, co zostało przekazane do funkcji w celu przesterylizowania:
!["Jak wygląda log z funkcji sterylizator w trybie debugowania"](https://i.imgur.com/kTkLLHR.png)

Przed działaniem funkcji to, co zostało przekazane do niej, zostaje zapisane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizator/source.json`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu tekstu źródłowego do pliku w trybie debugowania"](https://i.imgur.com/YVIEx2K.png)

Po działaniu funkcji wysterylizowany tekst zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizator/result.json`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu wyniku sterylizacji do pliku w trybie debugowania"](https://i.imgur.com/pr4RaBw.png)

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizator/catched_error.txt`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/CY6y06K.png)

# pathSecurityChecker()

Funkcja `pathSecurityChecker()` jest używana do sprawdzania, czy ścieżka do pliku jest bezpieczna. Sprawdza ona, czy ścieżka nie zawiera znaków specjalnych, które mogą być wykorzystane do ataku na system i pozwolić na ucieczkę z chronionego katalogu (domyślnie ``mp3/``, ale jako drugi opcjonalny argument `defendingFolder` można podać inny katalog np. katalog archiwum).

W zależności od tego, co wykryje funkcja, zwraca ona odpowiedniego stringa:

- ``INVALID_PATH_ATTEMPT`` - gdy podana ścieżka nie jest stringiem
- ``EMPTY_PATH_ATTEMPT`` - gdy podana ścieżka jest pusta
- ``NULL_BYTE_ATTEMPT`` - gdy ścieżka zawiera znak ``\0`` (`NULL_BYTE`), wyświetlając w konsoli komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu NULL_BYTE"](https://i.imgur.com/5je7lTp.png)

- ``ABSOLUTE_PATH_ATTEMPT`` - gdy podana ścieżka jest ścieżką absolutną
- ``TRAVERSAL_SEGMENT_ATTEMPT`` - gdy ścieżka zawiera segment ``..`` próbujący wyjść wyżej w drzewie katalogów
- ``ROOT_EXIT_ATTEMPT`` - gdy ścieżka wiedzie do ucieczki z katalogu ``mp3/`` (lub innego podanego w `defendingFolder`), wyświetlając komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu próby ucieczki z katalogu mp3/"](https://i.imgur.com/M35ItME.png)

Jeżeli ścieżka zawiera "dwukropki" zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu dwukropków"](https://i.imgur.com/mFFUhWT.png)

Jeżeli ścieżka nie narusza żadnego z tych warunków zwraca wartość ``NONE``.

## Tryb Debugowania

Log informuje o tym, co zostało przekazane do funkcji w celu sprawdzenia:
!["Jak wygląda log z funkcji pathSecurityChecker w trybie debugowania"](https://i.imgur.com/VpFDFnW.png)

Przed sprawdzeniem ścieżki zostaje zapisana przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/pathSecurityChecker/source.json`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o zapisaniu tekstu źródłowego do pliku w trybie debugowania"](https://i.imgur.com/qijGCMe.png)

Przed sprawdzeniem, czy ścieżka nie zawiera ``NULL_BYTE`` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania, czy ścieżka nie zawiera NULL_BYTE w trybie debugowania"](https://i.imgur.com/6OMy6MJ.png)

Przed sprawdzeniem, czy ścieżka nie wiedzie do ucieczki z katalogu ``mp3/`` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania, czy ścieżka nie wiedzie do ucieczki z katalogu mp3/ w trybie debugowania"](https://i.imgur.com/DYi2JLy.png)

Przed sprawdzeniem, czy ścieżka nie zawiera "dwukropków" zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania, czy ścieżka nie zawiera dwukropków w trybie debugowania"](https://i.imgur.com/hJRlf6q.png)

# killVLCatStartup()

Funkcja ta nie przyjmuje żadnych argumentów. Służy ona do sprawdzenia podczas startu skryptu, czy w systemie nie wisi już jakiś uruchomiony proces `vlc`, i jeżeli go znajdzie, to ubija go siłowo komendą `pkill -9 vlc` oraz wyświetla loga w konsoli.

## Tryb Debugowania

Jeżeli funkcja znajdzie uruchomiony proces VLC, to jego PID, komenda oraz argumenty są zapisywane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/killVLCatStartup/process.txt``.
W przypadku błędu przy szukaniu procesu VLC błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/killVLCatStartup/catched_error.txt``.

# checkIfVLCisRunning()

Funkcja ta nie przyjmuje żadnych argumentów i sprawdza, czy w systemie jest aktualnie uruchomiony proces `vlc`.
Jeżeli nie znajdzie żadnego procesu, to wyświetla loga, że VLC nie jest uruchomiony i zwraca `false`.
Jeżeli znajdzie działający proces `vlc`, to wyświetla loga, że VLC istnieje i zwraca `true`.

## Tryb Debugowania

W przypadku błędu podczas sprawdzania procesów błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/checkIfVLCisRunning/catched_error.txt``.

# checkIfVLConVotes()

Funkcja ta sprawdza, czy uruchomione VLC odtwarza aktualnie muzykę z playlisty głosów (`./mp3/7/`).
Robi to poprzez połączenie się z klientem VLC, pobranie nazwy aktualnie granego pliku przy pomocy `getFileName()` i sprawdzenie, czy ten plik znajduje się w katalogu `./mp3/7/`.
Funkcja posiada również bramkę czasową na 3 sekundy — jeżeli w tym czasie nie uda się sprawdzić stanu VLC lub wywali błąd, to funkcja kończy działanie i zwraca `false`.

## Tryb Debugowania

W przypadku błędu podczas sprawdzania błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/checkIfVLConVotes/catched_error.txt``.

# uint8ArrayToBase64()

Funkcja przyjmuje jeden argument `uint8Array` i konwertuje tablicę bajtów (np. wyciągniętą okładkę piosenki z metadanych) na stringa w formacie Base64.

# truncate()

Funkcja przyjmuje dwa argumenty:

- `str` - tekst, który ma zostać sprawdzony
- `n` - maksymalna długość tekstu

Jeżeli długość podanego tekstu jest większa niż `n`, to funkcja wyświetla w konsoli ostrzeżenie o ucinaniu tekstu i skraca go do `n - 1` znaków. Jeżeli tekst jest krótszy lub równy `n`, to zwraca go bez żadnych zmian.

# sterylizator()

Funkcja `sterylizator()` jest używana do przekształcania wejściowego ciągu znaków, zamieniając spacje na podkreślenia oraz usuwając wszystkie znaki niealfabetyczne z wyjątkiem podkreśleń, myślników i niektórych znaków z języka japońskiego oraz chińskiego.

W przypadku gdy funkcji nie uda się przeprowadzić sterylizacji zwraca pusty wynik i zostaje zwrócony log z błędem który wygłąda tak:
!["Jak wygląda log z funkcji sterylizator mówiący o błędzie"](https://i.imgur.com/pMZFqVN.png)

## Tryb debugowania

Log informuje o tym, co zostało przekazane do funkcji w celu przesterylizowania:
!["Jak wygląda log z funkcji sterylizator w trybie debugowania"](https://i.imgur.com/kTkLLHR.png)

Przed działaniem funkcji to co zostało przekazane do niej zostaje zapisane przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizator/source.json`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu tekstu źródłowego do pliku w trybie debugowania"](https://i.imgur.com/YVIEx2K.png)

Po działaniu funkcji wysterylizowany tekst zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizator/result.json`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu wyniku sterylizacji do pliku w trybie debugowania"](https://i.imgur.com/pr4RaBw.png)

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/sterylizator/catched_error.txt`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji sterylizator mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/CY6y06K.png)

# pathSecurityChecker()

Funkcja `pathSecurityChecker()` jest używana do sprawdzania czy ścieżka do pliku jest bezpieczna sprawdza ona czy ścieżka nie zawiera znaków specjalnych, które mogą być wykorzystane do ataku na system i pozwolić na ucieczkę z katalogu ``mp3/``.
Jeżeli ścieżka zawiera ``NULL_BYTE`` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu NULL_BYTE"](https://i.imgur.com/5je7lTp.png)

Jeżeli ścieżka wiedzie do ucieczki z katalogu ``mp3/`` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu próby ucieczki z katalogu mp3/"](https://i.imgur.com/M35ItME.png)

Jeżeli ścieżka zawiera "dwukropki" zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o wykryciu dwukropków"](https://i.imgur.com/mFFUhWT.png)

Jeżeli ścieżka nie narusza żadnego z tych warunków zwraca wartość ``NONE``.

## Tryb debugowania

Log informuje o tym, co zostało przekazane do funkcji w celu sprawdzenia:
!["Jak wygląda log z funkcji pathSecurityChecker w trybie debugowania"](https://i.imgur.com/VpFDFnW.png)

Przed sprawdzeniem ścieżki zostaje zapisana przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/Other/pathSecurityChecker/source.json`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o zapisaniu tekstu źródłowego do pliku w trybie debugowania"](https://i.imgur.com/qijGCMe.png)

Przed sprawdzeniem czy ścieżka nie zawiera ``NULL_BYTE`` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania czy ścieżka nie zawiera NULL_BYTE w trybie debugowania"](https://i.imgur.com/6OMy6MJ.png)

Przed sprawdzeniem czy ścieżka nie wiedziecie do ucieczki z katalogu ``mp3/`` zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania czy ścieżka nie wiedzie do ucieczki z katalogu mp3/ w trybie debugowania"](https://i.imgur.com/DYi2JLy.png)

Przed sprawdzeniem czy ścieżka nie zawiera "dwukropków" zwraca komunikat:

!["Jak wygląda log z funkcji pathSecurityChecker mówiący o rozpoczęciu sprawdzania czy ścieżka nie zawiera dwukropków w trybie debugowania"](https://i.imgur.com/hJRlf6q.png)

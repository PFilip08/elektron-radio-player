# taskNumber()
Funkcja ta zwraca liczbę zadań które zrobiły funkcje [`scheduleMusicTask()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulemusictask) oraz [`scheduleKillTask()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulekilltask). 

Wyświetla w formie takiego o to loga:

!["Jak wygląda log z funkcji taskNumber"](https://i.imgur.com/WtiXhBo.png)
# scheduleMusicTask()
Planuje puszczanie muzyki z danej playlisty o danej godzinie ustawiając funkcje [`playPlaylist()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playplaylist). Puszczenie poprzedza takim o to logiem w konsoli:
!["Jak wygląda log z funkcji scheduleMusicTask"](https://i.imgur.com/6WH87AO.png)
# scheduleKillTask()
Planuje zabicie odtwarzacza muzyki o danej godzinie ustawiając funkcje [`killPlayer()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#killplayer).
# checkScheduleTime()
Funkcja ta sprawdza czy czas zakończenia jest późniejszy niż czas rozpoczęcia i odwrotnie. Jeśli nie, zwraca false i pokazuje odpowiedni log w konsoli:
Dla czasu zakończenia wcześniejszego niż czas rozpoczęcia (dla minutach):
!["Jak wygląda log z funkcji checkScheduleTime gdy czas zakończenia jest późniejszy niż czas rozpoczęcia dla minut"](https://i.imgur.com/yJRBjTi.png)
Dla czasu zakończenia późniejszego niż czas rozpoczęci (dla godzin):
!["Jak wygląda log z funkcji checkScheduleTime gdy czas zakończenia jest późniejszy niż czas rozpoczęcia dla godzin"](https://i.imgur.com/KeQiAKC.png)
# massSchedule()
`massSchedule` jest funkcją, która planuje zadania związane z odtwarzaniem muzyki na podstawie harmonogramu pobranego z API. Funkcja ta zarządza zadaniami harmonogramu, usuwa stare pliki, pobiera dane z API, sprawdza poprawność czasów rozpoczęcia i zakończenia oraz tworzy nowe zadania harmonogramu dla odtwarzania muzyki.

### Parametry

Funkcja `massSchedule` nie przyjmuje żadnych argumentów.

### Opis działania

1. **Zakończenie bieżących zadań harmonogramu**:
    - `await schedule.gracefulShutdown();` - Funkcja kończy wszystkie aktualnie zaplanowane zadania.

2. **Planowanie automatycznego usuwania plików**:
    - `schedule.scheduleJob('0 5 * * 1-5', autoRemoveFiles);` - Codziennie o godzinie 5:00 od poniedziałku do piątku uruchamia się zadanie `autoRemoveFiles`.

3. **Pobranie danych z API**:
    - `const data = await`[`getApiData()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#getapidata)`;` - Funkcja pobiera dane z API, które zawierają informacje o harmonogramie odtwarzania muzyki.

4. **Sprawdzanie dostępności danych**:
    - Jeśli dane nie zawierają klucza `isOn` ustawionego na `true`, funkcja loguje błąd i kończy działanie:
    ```javascript
    if (!data.isOn) {
        taskNumber();
        return logger('error','Brakuje danych!!!', 'massSchedule');
    }
    ```

5. **Przetwarzanie danych harmonogramu**:
    - Funkcja pobiera harmonogramy czasowe (`timeRules`) oraz dni tygodnia, dla których mają być zastosowane (`applyRule`).
    - Tworzy mapowanie dni tygodnia na liczby (poniedziałek = 1, wtorek = 2, itd.).

6. **Tworzenie zadań harmonogramu**:
    - Dla każdego dnia tygodnia, dla którego harmonogram ma być zastosowany, funkcja iteruje przez wszystkie zaplanowane czasy odtwarzania muzyki.
    - Sprawdza, czy czas zakończenia jest późniejszy niż czas rozpoczęcia, wykorzystując funkcję [`checkScheduleTime()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#checkscheduletime).

7. **Planowanie zadań**:
    - Funkcja tworzy zadania harmonogramu dla odtwarzania playlisty ([`playPlaylist()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playplaylist)).
    - Jeśli zdefiniowane jest odtwarzanie na żądanie (`OnDemand`), pobiera pliki i planuje zadanie odtwarzania tych plików ([`playOnDemand()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playondemand)).
    - Planowanie zadań do zatrzymania odtwarzacza muzyki ([`killPlayer()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#killplayer)) po zakończeniu odtwarzania.

8. **Logowanie liczby zaplanowanych zadań**:
    - [`taskNumber()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#tasknumber) - Funkcja loguje liczbę wszystkich zaplanowanych zadań.
### Ważne funkcje pomocnicze
 - [`taskNumber()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#tasknumber): Loguje liczbę wszystkich zaplanowanych zadań.
 - [`scheduleMusicTask(time, id)`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulemusictask): Planowanie zadania odtwarzania playlisty.
 - [`scheduleKillTask(time)`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulekilltask): Planowanie zadania zatrzymania odtwarzacza muzyki.
 - [`checkScheduleTime(timeEnd, timeStart, rule, breakNumber)`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#checkscheduletime): Sprawdza poprawność czasów rozpoczęcia i zakończenia odtwarzania.
### Przykłady logów
 - `logger('log', 'Granie playlisty nr: '+id.id,'scheduleMusicTask')` - Logowanie odtwarzania playlisty.
 - `logger('error', 'Brakuje danych!!!', 'massSchedule')` - Logowanie błędu braku danych.
 - `logger('log', 'ONDEMAND OMAJGAH!!!1!111!!1!1!!!', 'massSchedule')` - Logowanie odtwarzania na żądanie.
 Obsługa błędów
 Jeśli czas zakończenia jest wcześniejszy niż czas rozpoczęcia, funkcja [`checkScheduleTime()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#checkscheduletime) loguje odpowiedni błąd i zwraca false.
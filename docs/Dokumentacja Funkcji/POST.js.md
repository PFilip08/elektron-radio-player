# POST()
Funkcja `POST()` służy do uruchomienia całego Automatu skrypt wykonuje instrukcje w następującej kolejności:
- Wyświetla log powitalny z informacją o twórcy skryptu i jak projekt się nazywa.

    ![Jak wygląda log powitalny?](https://i.imgur.com/n98C6uS.png)
- Uruchamia funkcję [`DebugStarter()`]() która sprawdza czy skrypt uruchomiony jest w trybie debugowania
    - Jeżeli skrypt uruchomiony jest w trybie debugowania to wyświetli komunikat informujący na jakim systemie pracuje i pokazuje log o treści:

        ![Komunikat o z trybu debugowania informujący o tym na jakim systemie działa skrypt](https://i.imgur.com/9PQRZlu.png)
- Sprawdza na jakim systemie uruchamiany jest skrypt. 
    - Jeżeli skrypt uruchomiony zostanie na komputerze z systemem Windows, to skrypt zakończy swoje działanie z kodem błędu 2 i pokaże komunikat o błędzie:

        ![Komunikat o błędzie dla systemu okno](https://i.imgur.com/yP5dJze.png)
        - W przypadku gdy skrypt jest uruchomiony w trybie debugowania to wyświetli następujący komunikat dalej postępując zgodnie z pierwszym punktem:
        
            ![Komunikat o błędzie dla systemu okno w trybie debugowania](https://i.imgur.com/2H5Be1q.png)
- Sprawdza czy istnieje zmienna środowiskowa o nazwie `WWW`
    - Jeżeli zmienna istnieje to skrypt aktywuje lokalne api (funkcja wewnętrzna `www()`) i wyświetli komunikat:

        ![Komunikat o aktywacji lokalnego api](https://i.imgur.com/7FItcZu.png)
    - Jeżeli zmienna nie istnieje to ustawia ``false`` i nic nie pokazuje
- Uruchamia funkcję [`massSchedule()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#massschedule) która ustawia zadania w playerze, o której ma grać muzyka w harmonogramie i wyświetla komunikat informujący o ustawieniu funkcji:

    ![Komunikat o ustawieniu harmonogramu](https://i.imgur.com/UnezZCp.png)
- Uruchamia funkcję [`checkUpdate()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#checkupdate) która pobiera pierwsze dane z serwera a potem ustawia funkcje [`scheduleUpdate()`]() która uruchamia się co sekundę a po tym wyświetla komunikat:

    ![Komunikat o ustawieniu sprawdzania aktualizacji](https://i.imgur.com/Akm8cAd.png)
- Pod koniec funkcja `POST()` wyświetli komunikat o treści:
    
    ![Komunikat końcowy](https://i.imgur.com/O9PX2wy.png)
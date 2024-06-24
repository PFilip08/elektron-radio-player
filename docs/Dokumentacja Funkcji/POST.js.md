# POST()
Funkcja POST() służy do uruchomienia całego Automatu skrypt wykonuje instrukcje w następującej kolejności:
- Wyświetla log powitalny z informacją o twórcy skryptu i jak projekt się nazywa.

    ![Jak wygląda log powitalny?](https://i.imgur.com/n98C6uS.png)
- Sprawdza na jakim systemie uruchamiany jest skrypt. 
    - Jeżeli skrypt uruchomiony zostanie na komputerze z systemem Windows, to skrypt zakończy swoje działanie z kodem błędu 2 i pokaże komunikat o błędzie:

        ![Komunikat o błędzie dla systemu okno](https://i.imgur.com/yP5dJze.png)
- Sprawdza czy istnieje zmienna środowiskowa o nazwie `WWW`
    - Jeżeli zmienna istnieje to skrypt aktywuje lokalne api (funkcja `www()`) i wyświetli komunikat:

        ![Komunikat o aktywacji lokalnego api](https://i.imgur.com/7FItcZu.png)
- Uruchamia funkcję `massSchedule()` która ustawia zadania w playerze, o której ma grać muzyka w harmonogramie i wyświetla komunikat informujący o ustawieniu funkcji:

    ![Komunikat o ustawieniu harmonogramu](https://i.imgur.com/UnezZCp.png)
- Uruchamia funkcję `checkUpdate()` która sprawdza co 10s czy JSON pobrany z serwera jest aktualny i wyświetla komunikat informujący o ustawieniu funkcji:

    ![Komunikat o ustawieniu sprawdzania aktualizacji](https://i.imgur.com/Akm8cAd.png)
- Pod koniec funkcja POST() wyświetli komunikat o treści:
    
    ![Komunikat końcowy](https://i.imgur.com/O9PX2wy.png)
# taskNumber()
Funkcja ta zwraca liczbę zadań które zrobiły funkcje [`scheduleMusicTask()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulemusictask) oraz [`scheduleKillTask()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulekilltask). 

Wyświetla w formie takiego o to loga:

!["Jak wygląda log z funkcji taskNumber"](https://i.imgur.com/WtiXhBo.png)
## Tryb Debugowania
Wyświetla informacje o uruchomieniu tej funkcji który wygląda tak:

!["Jak wygląda log z funkcji taskNumber w trybie debugowania"](https://i.imgur.com/VpmxwA9.png)
# scheduleMusicTask()
Planuje puszczanie muzyki z danej playlisty o danej godzinie ustawiając funkcje [`playPlaylist()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playplaylist). 
Puszczenie poprzedza takim o to logiem w konsoli:

!["Jak wygląda log z funkcji scheduleMusicTask"](https://i.imgur.com/6WH87AO.png)
## Tryb Debugowania
Log informuje na kiedy została zaplanowana funkcja [`playPlaylist()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playplaylist) oraz jaka playlista została jej podana:

!["Jak wygląda log z funkcji scheduleMusicTask w trybie debugowania"](https://i.imgur.com/90GjKjS.png)
# scheduleKillTask()
Planuje zabicie odtwarzacza muzyki o danej godzinie ustawiając funkcje [`killPlayer()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#killplayer).
## Tryb Debugowania
Log informuje na kiedy zostało zaplanowane zadanie uruchomienia funkcji [`killPlayer()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#killplayer):
!["Jak wygląda log z funkcji scheduleKillTask w trybie debugowania"](https://i.imgur.com/kn3AFHO.png)
# checkScheduleTime()
Funkcja ta sprawdza czy czas zakończenia jest późniejszy niż czas rozpoczęcia i odwrotnie. Jeśli nie, zwraca false i pokazuje odpowiedni log w konsoli:
Dla czasu zakończenia wcześniejszego niż czas rozpoczęcia (dla minutach):
!["Jak wygląda log z funkcji checkScheduleTime gdy czas zakończenia jest późniejszy niż czas rozpoczęcia dla minut"](https://i.imgur.com/yJRBjTi.png)
Dla czasu zakończenia późniejszego niż czas rozpoczęci (dla godzin):
!["Jak wygląda log z funkcji checkScheduleTime gdy czas zakończenia jest późniejszy niż czas rozpoczęcia dla godzin"](https://i.imgur.com/KeQiAKC.png)
## Tryb Debugowania
Log informuje jaka zasada i numer przerwy został podany do funkcji w celu sprawdzenia:

!["Jak wygląda log z funkcji checkScheduleTime w trybie debugowania informujący o tym co jest aktualnie do sprawdzenia przez funkcje"](https://i.imgur.com/fwvDB1b.png)

Jeżeli godzina przerwy danej zasady jest prawidłowa zwracany log wygląda tak:

!["Jak wygląda log z funkcji checkScheduleTime w trybie debugowania informujący o tym że godzina przerwy jest prawidłowa"](https://i.imgur.com/bwQNYhR.png)

W przypadku gdy sprawdzenie wyszło że czas w minutach jest na minusie (czas zakończenia jest wcześniejszy niż czas rozpoczęcia) log wygląda tak:

!["Jak wygląda log z funkcji checkScheduleTime w trybie debugowania informujący o tym że czas zakończenia jest wcześniejszy niż czas rozpoczęcia (sprawdzenie minut)"](https://i.imgur.com/LkOiUa5.png)

W przypadku gdy sprawdzenie wyszło że czas w godzinie jest na minusie (czas zakończenia jest wcześniejszy niż czas rozpoczęcia) log wygląda tak:

!["Jak wygląda log z funkcji checkScheduleTime w trybie debugowania informujący o tym że czas zakończenia jest wcześniejszy niż czas rozpoczęcia (sprawdzenie godzin)"](https://i.imgur.com/kbzgflM.png)

# massSchedule()
`massSchedule` jest funkcją, która planuje zadania związane z odtwarzaniem muzyki na podstawie harmonogramu pobranego z API.
Na początku funkcja anuluje zaplanowane w poprzedniej sesji zadania i planuje zadanie uruchamiające funkcję automatycznego usuwania plików [`autoRemoveFiles()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#autoremovefiles) codziennie o godzinie 5:00 od poniedziałku do piątku. 
Następnie wysyła zapytanie do funkcji [`getApiData()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#getapidata) która zwróci dane z API po tym sprawdza czy zmienna w jsonie `isOn` jest ustawiona na `true` jeżeli zmienna jest przełączona na `false` to funkcja zwróci błąd który wygłąda tak:
!["Jak wygląda log z funkcji massSchedule gdy zmienna isOn jest na false"](https://i.imgur.com/HJ1s8pE.png)
Po tym sprawdzeniu rozpoczyna się pętla która iteruje dni tygodnia z jsona i przypisuje im zasadę która ma być zastosowana dla tego dnia. 
Potem zaczyna się cykl pętli:
1. Pierwsza pętla iteruje tyle razy ile istnieje dni tygodnia w jsonie.
2. Druga pętla która jest w środku pierwszej pętli iteruje tyle ile jest godzin w danej zasadzie przydzielonej do danego dnia tygodnia.
Działa główne funkcji znajduję się wewnątrz pętli drugiej i zostanie ona opisana poniżej bo pętla pierwsza nie służy do niczego innego jak wykonania pętli drugiej tyle razy ile trzeba.
Ale warto wspomnieć że w pętli pierwszej jest sprawdzane jczy zasada dla danego dnia tygodnia jest nie jest równa `0` jeżeli jest równa to wykonywanie dla tej iteracji jest pomijane i pętla kontynuuje z wykonywaniem następnej iteracji.
Na początku funkcja przypisuje do zmiennej `id` numer playlisty głównej z jsona (`currentPlaylistId`)
Po tym jest sprawdzane czy w jsonie pod daną zasadą jest zdefiniowana zmienna `playlist` jeżeli jest to zmienna `id` przyjmuje wartość zapisaną z tej zmiennej jeżeli nie to zmienna `id` przyjmuje wartość domyślną ze zmiennej json `currentPlaylistId`.
Następnie funkcja sprawdza czy w jsonie pod daną zasadą `playlist` nie równa się `0` jeżeli równa się to iteracja jest pomijana i funkcja przechodzi do następnej iteracji.
Jeżeli pod zasadą zdefiniowana jest zmienna `OnDemand` to funkcja wyświetli log:
!["Jak wygląda log z funkcji massSchedule gdy jest zdefiniowana zmienna OnDemand"](https://i.imgur.com/IvEVtBg.png)
I dzwoni do funkcji [`downloader()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloader) z podanym linkiem oraz do zmiennej `trackInfo` przypisuje funkcję [`getTrackInfo()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#gettrackinfo) z podanym linkiem i wydobywa z jsona zasadę i z niej czas `start` rozłącza go na przy użyciu `split` szukając `:` obraca go przy użyciu `reverse` i łączy przy pomocy `join` która elementy tablicy "spawa" przy pomocy spacji i po tym tworzy zadanie które wykonuje funkcję [`playOnDemand`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#playondemand) i jako argument umieszcza wysterylizowaną przez funkcję [`sterylizator()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Other.js.md#sterylizator) nazwę pliku i pod koniec tworzy zadanie ubicia pjeyera przy użyciu tej samej metody co opisanej wcześniej i następna iteracja pętli jest kontynuowana.
Przed uruchomieniem sprawdzenia czy czas jest prawidłowy funkcja do zmiennej `scheduleKey` przypisuje czas `start` i `end` z zasady która znajduje się w jsonie.
Po tym funkcja sprawdza czy czas jest prawidłowy przy użyciu funkcji [`checkScheduleTime()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#checkscheduletime) jeżeli czas jest prawidłowy to funkcja przypisuje do zmiennej `checkedSchedules` dodaje zmienną `scheduleKey` a jeżeli czas jest nieprawidłowy to funkcja zwraca błąd który wygląda tak i kontynuuje wykonywanie następnej iteracji:
!["Jak wygląda log z funkcji massSchedule gdy czas jest nieprawidłowy"](https://i.imgur.com/C741mZA.png)
Jeżeli żaden z powyższych sprawdzeń nie wyłapał nic to funkcja tworzy zadania a tworzy je przez funkcję [`scheduleMusicTask()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulemusictask) i jako argument podaje czas we zmiennej `time` a id playlisty we zmiennej `id`a tworzy zadanie przy pomocy funkcji [`scheduleKillTask()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#schedulekilltask) do której podaje czas w tej samej zmiennej `time`.

# downloader()

Funkcja ta rozpoznaje, jaki rodzaj linku został podany i wywołuje odpowiednią funkcję do pobrania muzyki.
Funkcje wyświetlić może 3 rodzaje komunikatów:

- Jeżeli podany link jest trackiem, to wyświetli się komunikat i przekieruje do funkcji [`downloadSong()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloadsong):
!["Jak wygląda komunikat o tracku z funkcji downloader"](https://imgur.com/gOA3mB7.png)
- Jeżeli podany link jest playlistą, to wyświetli się komunikat i przekieruje do funkcji [`downloadPlaylist()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloadplaylist):
!["Jak wygląda komunikat o playliście z funkcji downloader"](https://i.imgur.com/Hhnni2t.png)
- Jeżeli podany link jest albumem, to wyświetli się komunikat i przekieruje do funkcji [`downloadAlbum()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloadalbum):

    !["Jak wygląda komunikat o albumie z funkcji downloader"](https://i.imgur.com/8MvZ6c4.png)
- Jeżeli podany link jest nieprawidłowy i nie można go rozpoznać, to wyświetli się komunikat:
!["Jak wygląda komunikat o nieprawidłowym linku z funkcji downloader"](https://i.imgur.com/5tE6vA5.png)

A funkcja zwróci stringa: ``Nie wykryto typu``.
## Tryb Debugowania
Przed rozpoznaniem linku funkcja zwraca log z informacją o wyniku splita i co z tego wynika:
!["Jak wygląda log z funkcji downloader, który mówi o wyniku splita i co wykrył w trybie debugowania"](https://i.imgur.com/rLVq1Fr.png)

W przypadku gdy nie wykryje linku, to link jest zapisywany przez funkcje [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/MusicDownloader/downloader/catched_link.txt` i zwraca log z informacją o tym:

!["Jak wygląda log z funkcji downloader mówiący o zapisaniu linku do pliku w trybie debugowania"](https://i.imgur.com/YTqajCQ.png)

# downloadSong()

Funkcja ta pobiera pojedynczy utwór muzyczny.
Na początku tworzy klienta, który potrzebuje `SPOTIFY_CLIENT_ID` oraz `SPOTIFY_CLIENT_SECRET` a bierze go z pliku `.env`. Następnie pobiera informacje o utworze ze serwera Spotify, po tym nazwa przelatuje przez funkcję [`sterylizator()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Other.js.md#sterylizator), która usuwa z nazwy znaki specjalne i po tym funkcja sprawdza, czy plik istnieje, jeżeli istnieje, to wyświetla komunikat:

!["Jak wygląda komunikat o istnieniu pliku z funkcji downloadSong"](https://i.imgur.com/y2KtjH0.png)

Po wykryciu plik rozpoczyna się pobieranie pliku i wyświetla się następujący log:
!["Jak wygląda log z funkcji downloadSong"](https://i.imgur.com/lkknRR7.png)

Po pobraniu pliku w konsoli wyświetli się poniższy komunikat:

!["Jak wygląda komunikat końcowy o pobraniu pliku z funkcji downloadSong"](https://i.imgur.com/3PYBkvD.png)

# downloadPlaylist()

Funkcja ta pobiera playlistę muzyczną. Działa na takiej samej zasadzie co funkcja [`downloadSong()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloadsong).

# getTrackInfo()

Funkcja ta rozpoznaje, jaki rodzaj linku został podany i wywołuje odpowiednią funkcję, która sprawdza informacje o podanym tracku, playliście lub albumie.

## Tryb Debugowania

Przed rozpoznaniem linku funkcja zwraca log z informacją o wyniku splita i co z tego wynika:
!["Jak wygląda log z funkcji getTrackInfo, który mówi o wyniku splita i co wykrył w trybie debugowania"](https://i.imgur.com/NRNhpOs.png)

# autoRemoveFiles()

Funkcja ta usuwa pliki z folderu `onDemand`.

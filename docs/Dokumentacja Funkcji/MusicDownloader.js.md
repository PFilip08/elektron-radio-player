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

# downloadAlbum()

Funkcja ta pobiera cały album muzyczny ze Spotify. Działa na takiej samej zasadzie co funkcja [`downloadPlaylist()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloadplaylist) oraz [`downloadSong()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#downloadsong), tworząc podfolder o wysterylizowanej przez [`sterylizator()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Other.js.md#sterylizator) nazwie albumu, sprawdzając czy utwory nie istnieją już na dysku lub w archiwum, a po pobraniu normalizując każdy utwór przy pomocy `mp3gain` i kopiując go do archiwum.

# getTrackInfo()

Funkcja ta rozpoznaje, jaki rodzaj linku został podany i wywołuje odpowiednią funkcję, która sprawdza informacje o podanym tracku, playliście, albumie lub filmie z YouTube.

## Tryb Debugowania

Przed rozpoznaniem linku funkcja zwraca log z informacją o wyniku splita i co z tego wynika:
!["Jak wygląda log z funkcji getTrackInfo, który mówi o wyniku splita i co wykrył w trybie debugowania"](https://i.imgur.com/NRNhpOs.png)

# getYTInfo()

Funkcja przyjmuje jeden argument, którym jest `url` i pobiera podstawowe informacje o filmie z YouTube przy pomocy `yt-dlp`.
Jeżeli `url` nie zostanie podany, to funkcja zwraca stringa `Brak URL!!11`.
W normalnym działaniu wyciąga informacje o filmie, zamienia tytuł i opis na małe litery oraz tworzy nazwę pliku przepuszczoną przez funkcje [`sterylizator()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Other.js.md#sterylizator) i [`truncate()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Other.js.md#truncate), po czym zwraca je w formacie object:

```object
{
  song: /* pełne dane z ytdlp.getBasicInfo */,
  description: 'opis filmu z youtube',
  title: 'tytuł filmu z youtube',
  file: 'Autor_-_Tytul_piosenki'
}
```

# downloadYT()

Funkcja ta pobiera piosenkę z YouTube przy użyciu `yt-dlp`.
Przyjmuje ona cztery argumenty:

- `url` - link do filmu na YouTube
- `votes` - jeżeli jest ustawione na `true`, to piosenka zostanie pobrana do folderu z głosami `./mp3/7/`
- `path2` - ścieżka docelowa zapisu (domyślnie `./mp3/onDemand/`)
- `override` - jeżeli jest ustawione na `true`, to pomija sprawdzanie kategorii filmu i słów kluczowych

Na początku funkcja pobiera dane o filmie przez funkcję [`getYTInfo()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicDownloader.js.md#getytinfo).
Jeżeli nie został włączony `override`, a kategoria filmu na YouTube jest inna niż `Music`, to funkcja sprawdza, czy kategoria to `Entertainment` lub `Gaming`. Jeżeli jest to inna kategoria, to funkcja przerywa pobieranie i zwraca komunikat o złej kategorii. Natomiast dla kategorii `Entertainment` i `Gaming` funkcja sprawdza jeszcze, czy w tytule lub opisie znajdują się słowa kluczowe związane z muzyką oraz czy film nie trwa dłużej niż 600 sekund (10 minut).
Następnie funkcja sprawdza, czy plik nie istnieje już w folderze docelowym albo w archiwum (jeżeli jest w archiwum, to kopiuje go przez [`copyFromArchive()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ArchiveModule.js.md#copyfromarchive)).
Gdy pliku nie ma, pobiera strumień audio do pliku tymczasowego, dociąga miniaturkę z YouTube i przy użyciu `Ffmpeg` konwertuje plik do `.mp3` razem z metadanymi i okładką. Po zapisaniu pliku normalizuje głośność przy pomocy `mp3gain` i kopiuje gotowy plik do archiwum funkcją [`copyToArchive()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ArchiveModule.js.md#copytoarchive).

## Tryb Debugowania

Po normalizacji dźwięku output z `mp3gain` jest zapisywany przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/MusicDownloader/downloadYT/mp3gain_output.txt`.
W przypadku błędu na którymś z etapów (zapis pliku tymczasowego, dodawanie metadanych, działanie `mp3gain` lub błąd główny funkcji) błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w folderze `debug/MusicDownloader/downloadYT/`.

# autoRemoveFiles()

Funkcja ta usuwa pliki oraz podfoldery z folderu `mp3/onDemand` oraz `mp3/7`.

# removeFiles()

Funkcja przyjmuje jeden argument, którym jest `pathDir`, czyli ścieżka do folderu, z którego mają zostać usunięte pliki.
Na początku funkcja sprawdza, czy podana ścieżka nie próbuje usunąć głównych folderów playlist od `1` do `7` (jeżeli tak, to zwraca stringa `dupa`), a w przeciwnym wypadku usuwa wszystkie pliki i podfoldery ze wskazanej ścieżki.

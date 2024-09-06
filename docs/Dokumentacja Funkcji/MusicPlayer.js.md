# getPlaylistName()

Funkcja zwraca nazwę aktualnej playlisty. Jeżeli nie ma aktualnej playlisty, zwraca podane `id` zamiast nazwy.
W trybie debugowania przed sprawdzeniem nazwy zwraca log z co zostało przekazane do funkcji:

!["Jak wygląda log z funkcji getPlaylistName w trybie debugowania"](https://i.imgur.com/abxQpcn.png)

# getPlayingSong()

Funkcja zwraca nazwę aktualnie odtwarzanej piosenki, czas odtwarzania oraz czas trwania piosenki.
Zwraca go w formacie object:

```object
{
  isPlaying: true,
  title: 'Nazwa piosenki',
  played: 1,
  toPlayed: 2137'
}
```

W przypadku gdy nic nie gra zwraca object:

```object
{
  isPlaying: false,
  title: 'Nic aktualnie nie gra',
  played: null,
  toPlayed: null
}
```

Funkcja ta ma mechanizm bramki czasowej czyli jeżeli nie wykona się w ciągu 4 sekund to funkcja jest zakończona i zwracany w tym przypadku jest object:

```object
{
  isPlaying: false,
  title: 'Nic aktualnie nie gra',
}
```

W przypadku gdy funkcja wywali błąd to zwraca log z informacją o tym który wygląda tak:
!["Jak wygląda log z funkcji getPlayingSong gdy funkcja wywali błąd"](https://i.imgur.com/6jIL9Xt.png)

W trybie debugowania jeżeli funkcja przekroczy czas bramki to zwraca log z informacją o tym który wygląda tak:

!["Jak wygląda log z funkcji getPlayingSong gdy funkcja przekroczy limit czasowy w trybie debugowania"](https://i.imgur.com/lof8Ku0.png)

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/MusicPlayer/getPlayingSong/catched_error.txt`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji getPlayingSong mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/Wsf9M6I.png)

# playlistSongQuery()

Funkcja przyjmuje jeden argument. którym jest `playlistID` jak sama nazwa wskazuje jest to id playlisty z której chcemy odczytać jakie piosenki się znajdują na podanej playliście.
Na początku funkcja mapuje wszystkie przefiltrowane pliki mp3 z podanej ścieżki i potem zakłada na nie obietnice które zwracają następujące dane w formacie object:

```object
{
  title: 'Nazwa piosenki',
  artist: 'Nazwa artysty',
  coverData: 'Dane okładki'
}
W przypadku gdy nie znajdzie tytułu to object wygląda tak:
```object
{
  title: 'Nazwa Pliku',
  artist: 'Brak artysty',
  coverData: 'Brak okładki'
}
```

W przypadku gdy nie znajdzie autora to object wygląda tak:

```object
{
  title: 'Nazwa Piosenki',
  artist: 'Nieznany Artysta',
  coverData: 'Dane okładki'
}
```

W przypadku gdy nie znajdzie okładki to object wygląda tak:

```object
{
  title: 'Nazwa Piosenki',
  artist: 'Nazwa Artysty',
  coverData: 'taboret'
}
```

W przypadku gdy wywali błąd to zwraca log z informacją o tym który wygląda tak:
!["Jak wygląda log z funkcji playlistSongQuery gdy funkcja wywali błąd"](https://i.imgur.com/xrhKfhi.png)
I zwraca object:

```object
{
  title: 'Nazwa Pliku',
  artist: 'Nieznany Artysta',
}
```

## Tryb Debugowania

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/MusicPlayer/playlistSongQuery/catched_error.txt`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji playlistSongQuery mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/ct5esYk.png)

# playlistListQuery()

Funkcja zwraca listę playlist w formacie array:

```array
[
  '1',
  '2',
  '3',
  '4',
  '5',
  '6'
]
```

Robi to poprzez zwykłe wylistowanie całego katalogu `mp3/` i sprawdzeniu co jest folderem i sprawdzeniu czy folder nie nazywa się `onDemand` i zwraca object z nazwą pliku oraz jego id.
W przypadku gdy wywali błąd to zwraca log z informacją o tym który wygląda tak:
!["Jak wygląda log z funkcji playlistListQuery gdy funkcja wywali błąd"](https://i.imgur.com/JlKv7XK.png)

## Tryb Debugowania

W przypadku błędu błąd zostaje zapisany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/MusicPlayer/playlistListQuery/catched_error.txt`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji playlistListQuery mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/KHoPmU0.png)

# playMusic()

Funkcja przyjmuje jeden argument, którym jest `filename` jak sama nazwa wskazuje jest to nazwa pliku który, ma być odtworzony. Funkcja na początku sprawdza, czy plik istnieje, jeżeli nie, to zwraca błąd który wygląda tak:

!["Jak wygląda błąd z funkcji playMusic w przypadku braku pliku"](https://i.imgur.com/ziy24gy.png)

Jeżeli plik istnieje, to funkcja wywołuje `cvlc` z odpowiednimi argumentami i odtwarza plik. Funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playMusic"](https://i.imgur.com/KQI9WqM.png)

## Tryb Debugowania

Przed odtworzeniem pliku funkcja zwraca log z informacją o tym co ma odtworzyć i informuje że będzie sprawdzać czy plik istnieje:

!["Jak wygląda log z funkcji playMusic w trybie debugowania"](https://i.imgur.com/w51gJam.png)

Jeżeli plik istnieje to funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playMusic który informuje że plik istnieje w trybie debugowania"](https://i.imgur.com/wBxJaMZ.png)

# playOnDemand()

Funkcja przyjmuje jeden argument, którym jest `filename` jak sama nazwa wskazuje jest to nazwa pliku który ma być odtworzony. Funkcja na początku sprawdza czy plik istnieje, jeżeli nie to zwraca błąd który wygląda tak:

!["Jak wygląda błąd z funkcji playOnDemand w przypadku braku pliku"](https://i.imgur.com/y7n8tOr.png)

Funkcja sprawdza jeszcze czy podana nazwa pliku nie jest katalogiem aby można było puszczać nie tylko pojedyńcze piosenki a także całe playlisty pobrane ze Spotify!

I jeżeli plik lub playlista istnieje to funkcja wywołuje `cvlc` z odpowiednimi argumentami i odtwarza plik lub playlistę. Funkcja zwraca log o wykonaniu tego zadania który wygląda tak:
!["Jak wygląda log z funkcji playOnDemand"](https://i.imgur.com/Vq8T9pg.png)

## Tryb Debugowania

Przed odtworzeniem pliku funkcja zwraca log z informacją o tym co ma odtworzyć i informuje że będzie sprawdzać czy plik istnieje:

!["Jak wygląda log z funkcji playOnDemand informujący co ma ta funkcja otworzyć w trybie debugowania"](https://i.imgur.com/y7n8tOr.png)

Jeżeli plik istnieje to funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playOnDemand który informuje że plik istnieje w trybie debugowania"](https://i.imgur.com/n0dvyMS.png)

Po tym odbywa się sprawdzenie czy podana nazwa pliku nie jest katalogiem aby można było puszczać nie tylko pojedyńcze piosenki a także całe playlisty pobrane ze Spotify! Przed sprawdzeniem funcja zwraca log z informacją o tym że zaczyna sprawdzenie:

!["Jak wygląda log z funkcji playOnDemand informujący o sprawdzaniu czy podana nazwa pliku nie jest katalogiem w trybie debugowania"](https://i.imgur.com/2i1GITZ.png)
~~Jeżeli podana nazwa pliku jest katalogiem to funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playOnDemand który informuje że podana nazwa pliku jest katalogiem w trybie debugowania"]()~~
Na dzień pisania tej dokumentacji 31.08.2024 ta funkcja nie działa

Jeżeli podana nazwa pliku nie jest katalogiem to funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playOnDemand który informuje że podana nazwa pliku nie jest katalogiem w trybie debugowania"](https://i.imgur.com/oOs69dK.png)

Błąd z tego sprawdzenia w razie czegoś zawsze jest zapisywany przez [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji ``debug/MusicPlayer/playOnDemand/catched_error.txt`` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji playOnDemand mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/dpApOGB.png)

# playPlaylist()

Funkcja przyjmuje jeden argument, którym jest `playlistID` jak sama nazwa wskazuje jest to id playlisty która ma być odtworzona. Funkcja na początku sprawdza czy playlista istnieje, jeżeli nie to zwraca błąd który wygląda tak:
!["Jak wygląda błąd z funkcji playPlaylist w przypadku braku playlisty"](https://i.imgur.com/zgwZSsu.png)

Jeżeli playlista będzie istnieć to funkcja wywołuje `cvlc` z odpowiednimi argumentami i odtwarza playlistę. Funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playPlaylist dla playlisty ROCK"](https://i.imgur.com/LEMe2Xk.png)

## Tryb Debugowania

Przed odtworzeniem playlisty funkcja zwraca log z informacją o tym co zostało jej podane do odtworzenia i informuje że będzie sprawdzać czy playlista istnieje:

!["Jak wygląda log z funkcji playPlaylist informujący co ma ta funkcja otworzyć w trybie debugowania"](https://i.imgur.com/R13Ud4H.png)

Jeżeli playlista istnieje to funkcja zwraca log o wykonaniu tego zadania który wygląda tak:

!["Jak wygląda log z funkcji playPlaylist który informuje że playlista istnieje w trybie debugowania"](https://i.imgur.com/zjp9lbx.png)

# killPlayer()

Funkcja zatrzymuje odtwarzacz muzyki przy użyciu interfejsu programu `cvlc`.

Wykonanie tej funkcji jest logowane w konsoli takim oto logiem:
!["Jak wygląda log z funkcji killPlayer"](https://i.imgur.com/7eqTKBa.png)

## Tryb Debugowania

Przed zatrzymaniem odtwarzacza funkcja zwraca log z informacją o tym że rozpoczyna ubijanie plejera:

!["Jak wygląda log z funkcji killPlayer w trybie debugowania"](https://i.imgur.com/f8GeqNt.png)

# killPlayerForce()

Funkcja działa tak samo jak [`killPlayer()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/MusicPlayer.js.md#killplayer) z tą różnicą że zatrzymuje odtwarzacz muzyki siłą poprzez ubicie procesu `vlc`.

Wykonanie tej funkcji jest logowane w konsoli takim oto logiem:

!["Jak wygląda log z funkcji killPlayerForce"](https://i.imgur.com/6VT4FHm.png)

## Tryb Debugowania

Przed zatrzymaniem odtwarzacza funkcja zwraca log z informacją o tym że rozpoczyna ubijanie plejera:
!["Jak wygląda log z funkcji killPlayerForce w trybie debugowania"](https://i.imgur.com/lnouCDo.png)

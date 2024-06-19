# getPlaylistName()
Funkcja zwraca nazwę aktualnej playlisty. Jeżeli nie ma aktualnej playlisty, zwraca podane `id` zamiast nazwy.
# playMusic()
Funkcja przyjmuje jeden argument, którym jest `filename` jak sama nazwa wskazuje jest to nazwa pliku który ma być odtworzony. Funkcja na początku sprawdza czy plik istnieje, jeżeli nie to zwraca błąd który wygląda tak:

!["Jak wygląda błąd z funkcji playMusic w przypadku braku pliku"](https://i.imgur.com/ziy24gy.png)

Jeżeli plik istnieje to funkcja wywołuje `cvlc` z odpowiednimi argumentami i odtwarza plik. Funkcja zwraca log o wykonaniu tego zadania który wygląda tak:
!["Jak wygląda log z funkcji playMusic"](https://i.imgur.com/KQI9WqM.png)
# playOnDemand()
Funkcja przyjmuje jeden argument, którym jest `filename` jak sama nazwa wskazuje jest to nazwa pliku który ma być odtworzony. Funkcja na początku sprawdza czy plik istnieje, jeżeli nie to zwraca błąd który wygląda tak:

!["Jak wygląda błąd z funkcji playOnDemand w przypadku braku pliku"](https://i.imgur.com/oz1Yx5S.png)

Funkcja sprawdza jeszcze czy podana nazwa pliku nie jest katalogiem aby można było puszczać nie tylko pojedyńcze piosenki a także całe playlisty pobrane ze Spotify!

I jeżeli plik lub playlista istnieje to funkcja wywołuje `cvlc` z odpowiednimi argumentami i odtwarza plik lub playlistę. Funkcja zwraca log o wykonaniu tego zadania który wygląda tak:
!["Jak wygląda log z funkcji playOnDemand"](https://i.imgur.com/Vq8T9pg.png)
# playPlaylist()
Funkcja przyjmuje jeden argument, którym jest `playlistID` jak sama nazwa wskazuje jest to id playlisty która ma być odtworzona. Funkcja na początku sprawdza czy playlista istnieje, jeżeli nie to zwraca błąd który wygląda tak:
!["Jak wygląda błąd z funkcji playPlaylist w przypadku braku playlisty"](https://i.imgur.com/zgwZSsu.png)

Jeżeli playlista będzie istnieć to funkcja wywołuje `cvlc` z odpowiednimi argumentami i odtwarza playlistę. Funkcja zwraca log o wykonaniu tego zadania który wygląda tak:
!["Jak wygląda log z funkcji playPlaylist dla playlisty ROCK"](https://i.imgur.com/LEMe2Xk.png)
# killPlayer()
Funkcja zatrzymuje odtwarzacz muzyki przy użyciu interfejsu programu `cvlc`.
Wykonanie tej funkcji jest logowane w konsoli takim oto logiem:
!["Jak wygląda log z funkcji killPlayer"](https://i.imgur.com/7eqTKBa.png)

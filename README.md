# ELEKTRON-RADIO-PLAYER
## Co to? Jak to? Do czego to?
Jest to automatyczny player do szkolnego radia, który odtwarza odpowiednie playlisty na przerwach.  
Pobiera dane o przerwach i playlistach z API, automatycznie planuje zadania puszczania muzyki na cały tydzień.  
Jeżeli Internet zawiedzie, to korzysta z lokalnej kopii reguł.

### A skąd się to wzięło?
Pewnego dnia w szkole chcieli zautomatyzować Radiowęzeł i tak wyszło.
### Dlaczego takie rozbudowane?
Pewien typek ciągle rozmyślał, "a co gdyby?" :zenon:  
No i why not?

## Dokumentacja
[Tu](https://github.com/PFilip08/elektron-radio-player/tree/master/docs/)

## Wymagania systemowe:
- Linux, Android
- git, ffmpeg, vlc
- Node v20 lub większe

## Instalacja
Debianopodobne linuchy:
1. `sudo apt update && sudo apt install git ffmpeg vlc`
2. `git clone https://github.com/PFilip08/elektron-radio-player`
3. `cd elektron-radio-player`
4. `cp .env.example .env` i skonfigurować enva
5. `npm i`
6. `npm run start`

## Kopirajty
By PFilip,  
Zaptyp się potem dołączył
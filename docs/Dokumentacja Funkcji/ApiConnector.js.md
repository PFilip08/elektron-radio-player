# getApiData()
getApiData jest funkcją na którą inne funkcję będą czekały aby się wykonała.
Funkcja getApiData nie przyjmuje żadnych argumentów.

Funkcja wysyła zapytanie do serwera podanego w zmiennej `url` i oczekuje na odpowiedź z serwera w postaci json.

Funkcja kiedy za pierwszym razem dostanie odpowiedź z serwera gdzie json będzie zawierał wartość `isOn` a ona będzie równa `false` to funkcja wyśle do konsoli loga który wygląda tak:

!["Jak wygląda log z funkcji getApiData w temacie startu z blokadą"](https://i.imgur.com/mlQdMhs.png)

Zmienna messageCounter w funkcji odpowiada za informowanie funkcji o stanie czy połączenie z serwerem zostało przywrócone czy nie. Jeżeli połączenie z serwerem zostanie przywrócone to funkcja wyśle do konsoli loga który wygląda tak:
!["Jak wygląda log z funkcji getApiData w temacie loga na temat braku połączenia z internetem"](https://i.imgur.com/f26O7pA.png)
i ustawia messageCounter na `false`.

W przypadku gdy skrypt w trakcie swojego działania wykryje że serwer zwrócił wartość `isOn` równą `false` to funkcja zwróci jsona w takim formacie
```json
{"isOn": false}
```
W działaniu zasadniczym funkcja ustawi zmienną `messageCounter` na `true` oraz zwraca jsona w formacie obiektów js: 
```js
{
  id: 'e0cc7295-cc34-4fe9-a4c9-33de31f4464b',
  created_at: 'YYYY-MM-DDTHH:MM:SS.598501+00:03',
  hostid: 1,
  isOn: true,
  currentPlaylistId: 2,
  timeRules: {
    rules: { '1': [Array], '2': [Array] },
    applyRule: { Fri: 1, Mon: 0, Sat: 0, Sun: 0, Thu: 1, Tue: 1, Wed: 1 }
  }
}
```
### Tryb Recovery
W przypadku gdy funkcja nie będzie mogła połączyć się z serwerem to uruchomi tryb recovery wyświetlając taki log w konsoli:
!["Jak wygląda log odpowiedzialny za tryb recovery"](https://i.imgur.com/1GUyAJx.png)

W zależności jeżeli zmienna `previousData` nie będzie pusta to w konsoli pojawi się następujący log:
!["Jak wygląda log odpowiedzialny za tryb recovery z danymi z poprzedniej sesji"](https://i.imgur.com/qvHpCNm.png)
i funkcja wtedy zwróci poprzednie dane które były już zapisane w zmiennej `previousData`.

Tryb Recovery może uruchomić się też przy starcie gdy skrypt nie będzie mógł połączyć się pierwszy raz z serwerem wtedy funkcja weźmie dane zapisane w skrypcie w zmiennej `res` i je zwróci informując o tym w konsoli takim logiem:
!["Jak wygląda log informujący o starcie z danymi zapisanymi w skrypcie"](https://i.imgur.com/BMNHyjC.png)
# checkUpdate()
checkUpdate jest funkcją która sprawdza czy jest dostępny json z informacji o godzinach puszczania muzyki.

Funkcja checkUpdate nie przyjmuje żadnych argumentów.

W przypadku gdy tryb recovery uruchomi się w trybie w którym pobiera dane ze skryptu to funkcja nic nie zaloguje i po prostu zwróci tego samego jsona co funkcja getApiData.

W stanie zasadniczym funkcja gdy dane poprzednie będą różniły się od danych pobranych z api to funkcja uruchomi następujące funkcje:
- `massSchedule()`
- `logChanges()`
- `logChanges()`

A po uruchomieniu funkcji `massSchedule` w konsoli pojawi się log: 
!["Jak wyglądają logi po wykonaniu funkcji checkUpdate?"](https://i.imgur.com/zbaKQkv.png)

Potem uruchamiana jest funkcja `findChanges` której opis jest tu:

Która zwraca dane do zmiennej `changes` i następnie dla tej zmiennej jest wykonywana funkcja `logChanges` której opis znajduję się tu:

~~W przypadku gdy odpowiedz będzie błędna to w konsoli pojawi się log z błędem:~~ Nie działa na dzień 19.06.2024

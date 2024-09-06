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
## Tryb Debugowania
Przed pierwszym uruchomieniem funkcji i sprawdzania czy zmienna `isOn` jest równa `false` zwracany jest log:
!["Jak wygląda log z funkcji getApiData przed uruchomieniem pierwszego sprawdzenia w trybie debugowania"](https://i.imgur.com/JNgJhok.png)

Przed uruchomieniem sprawdzane jest czy zmienna w jsonie `isOn` jest równa `false` zwracany jest log:
!["Jak wygląda log z funckji getApiData przed sprawdzeniem w trybie debugowania"](https://i.imgur.com/VyRoHks.png)

Jeżeli sprawdzenie zakończy się sukcesem to zwracany jest log:

!["Jak wygląda log z funkcji getApiData po sprawdzeniu w trybie debugowania"](https://i.imgur.com/o5geNaw.png)

Jeżeli funkcja wyszła z trybu recovery to zwracany jest log:

!["Jak wygląda log z funkcji getApiData po wyjściu z trybu recovery w trybie debugowania"](https://i.imgur.com/0xSm4SE.png)

Jeżeli zmienna `isOn` jest równa `false` to zwracany jest log:

!["Jak wygląda log z funkcji getApiData po sprawdzeniu czy zmienna isOn jest równa false w trybie debugowania"](https://i.imgur.com/GCM9cxu.png)

Response z serwera jest zapisywany przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ApiConnector/getApiData/response.json` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji getApiData mówiący o zapisaniu response do pliku w trybie debugowania"](https://i.imgur.com/8JXp7mR.png)

Kiedy funkcja wchodzi w tryb recovery to zwracany jest log z informacją o tym i wyświetlany jest złapany błąd:
!["Jak wygląda log z funkcji getApiData mówiący o wejściu w tryb recovery i pokazujący błąd w trybie debugowania"](https://i.imgur.com/zNb7EWk.png)

Błąd przez który funkcja weszła w tryb recovery jest zapisywany przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ApiConnector/getApiData/catched_error.txt` i potwierdzone to zostaje następującym logiem:
!["Jak wygląda log z funkcji getApiData mówiący o zapisaniu błędu do pliku w trybie debugowania"](https://i.imgur.com/RhQ3Xfb.png)

Jeżeli funkcja wejdzie w tryb recovery w trakcie działania to zwracany jest log z informacją że będzie on używał danych zapisanych poprzednio w skrypcie:

!["Jak wygląda log z funkcji getApiData mówiący o użyciu danych zapisanych w skrypcie w trybie debugowania"](https://i.imgur.com/yt132PU.png)

Dane ze zmiennej `previousData` są zapisywane przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ApiConnector/getApiData/previousData.json` i potwierdzone to zostaje następującym logiem:
!["Jak wygląda log z funkcji getApiData mówiący o zapisaniu previousData do pliku w trybie debugowania"](https://i.imgur.com/p9fZzjN.png)

Jeżeli funkcja wejdzie w tryb recovery przy starcie to zwracany jest log z informacją o tym że będzie używał danych zapisanych w skrypcie:
!["Jak wygląda log z funkcji getApiData mówiący o użyciu danych zapisanych w skrypcie w trybie debugowania"](https://i.imgur.com/7utr2W2.png)

Dane zapisane w skrypcie są zapisywane przez funkcję [`DebugSaveToFile()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/DebugMode.js.md#debugsavetofile) w lokalizacji `debug/ApiConnector/getApiData/static_data.json` i potwierdzone to zostaje następującym logiem:

!["Jak wygląda log z funkcji getApiData mówiący o zapisaniu static_data do pliku w trybie debugowania"](https://i.imgur.com/qcToM0V.png)

# checkUpdate()

checkUpdate jest funkcją która sprawdza czy jest dostępny json z informacji o godzinach puszczania muzyki.

Funkcja checkUpdate nie przyjmuje żadnych argumentów.

W przypadku gdy tryb recovery uruchomi się w trybie w którym pobiera dane ze skryptu to funkcja nic nie zaloguje i po prostu zwróci tego samego jsona co funkcja getApiData.

W stanie zasadniczym funkcja gdy dane poprzednie będą różniły się od danych pobranych z api to funkcja uruchomi następujące funkcje:

- [`massSchedule()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#massschedule)
- [`findChanges()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#findchanges)
- [`logChanges()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#logchanges)

A po uruchomieniu funkcji [`massSchedule()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/TaskScheduler.js.md#massschedule) w konsoli pojawi się log:

!["Jak wyglądają logi po wykonaniu funkcji checkUpdate?"](https://i.imgur.com/zbaKQkv.png)

Potem uruchamiana jest funkcja [`findChanges()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#findchanges) której opis jest tu:

Która zwraca dane do zmiennej `changes` i następnie dla tej zmiennej jest wykonywana funkcja [`logChanges()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#logchanges) której opis znajduję się tu: [TUTAJ](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#logchanges)

~~W przypadku gdy odpowiedz będzie błędna to w konsoli pojawi się log z błędem:~~ Nie działa na dzień 19.06.2024

## Tryb Debugowania

Przed sprawdzeniem czy podane dane są statyczne wyświetlany jest log:
!["Jak wygląda log z funkcji checkUpdate przed sprawdzeniem czy dane są statyczne w trybie debugowania"](https://i.imgur.com/BNXWanM.png)

Jeżeli dane są statyczne to zwracany jest log:

!["Jak wygląda log z funkcji checkUpdate po sprawdzeniu czy dane są statyczne w trybie debugowania"](https://i.imgur.com/5GMS4rX.png)

Przed sprawdzeniem czy dane są różne wyświetlany jest log:

!["Jak wygląda log z funkcji checkUpdate przed sprawdzeniem czy dane są różne w trybie debugowania"](https://i.imgur.com/VmEg8K5.png)

Jeżeli dane są różne to zwracany jest log:

!["Jak wygląda log z funkcji checkUpdate po sprawdzeniu czy dane są różne w trybie debugowania"](https://imgur.com/0KV8z2A.png)

Przed przekazaniem danych do funkcji [`findChanges()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#findchanges) wyświetlany jest log:
!["Jak wygląda log z funkcji checkUpdate przed przekazaniem danych do findChanges w trybie debugowania"](https://i.imgur.com/E3yVIVX.png)

Przed przekazaniem danych do funkcji [`logChanges()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/Logger.js.md#logchanges) wyświetlany jest log:
!["Jak wygląda log z funkcji checkUpdate przed przekazaniem danych do logChanges w trybie debugowania"](https://imgur.com/9DctMT5.png)

Przed zapisaniem danych do zmiennej `previousData` wyświetlany jest log:
!["Jak wygląda log z funkcji checkUpdate przed zapisaniem danych do previousData w trybie debugowania"](https://i.imgur.com/udiyF1s.png)

# startInterval()

Jest funkcją która uruchamia funkcję [`checkUpdate()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#checkupdate) w podany przez funkcję [`scheduleUpdate()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#scheduleupdate) czasie.

# scheduleUpdate()

Funkcja w sobie posiada zapisane cztery ustawienia czasu w różnych zmiennych:

- `intervalOnAir` - czas który jest ustawiony podczas pracy radiowęzła (Domyślnie 3 sekundy)
- `intervalOffAir` - czas który jest ustawiony po tym gdy radiowęzł już nie pracuje (Domyślnie 10 sekundy)
- `intervalWeekend` - czas który jest ustawiony w weekend (Domyślnie 30 sekund)
- `intervalVacation` - czas który jest ustawiony w czasie wakacji (Domyślnie 60 sekund)

Funkcja dokonuje sprawdzenia w następujący sposób:

- Jeżeli czas jest równy lub większy godzinie 7 i jest mniejszy lub równy godzinie 15 to funkcja ustawi zmienną `interval` na czas `intervalOnAir`
- W innym przypadku funkcja ustawi zmienną `interval` na czas `intervalOffAir`
- Jeżeli dzień tygodnia jest równy 6 (Sobota) lub 7 (Niedziela) to funkcja ustawi zmienną `interval` na czas `intervalWeekend`
- Jeżeli miesiąc jest równy 7 (Lipiec) lub 8 (Sierpień) to funkcja ustawi zmienną `interval` na czas `intervalVacation`

Jeżeli funkcja nigdy nie ustawiała czasu to przy pierwszym uruchomieni funkcję [`startInterval()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#startinterval) wysyłając do niej zmienną `interval` po uruchomieniu tej funkcji przechodzi dalej i zaczyna wyświetlać następujące logi w konsoli:

- Jeżeli zmienna `interval` jest równa `intervalOnAir` to w konsoli pojawi się log:

  !["Jak wygląda log z funkcji scheduleUpdate w przypadku gdy interval jest równy intervalOnAir"](https://i.imgur.com/tO9kocE.png)

- Jeżeli zmienna `interval` jest równa `intervalVacation` to w konsoli pojawi się log:

  !["Jak wygląda log z funkcji scheduleUpdate w przypadku gdy interval jest równy intervalVacation"](https://i.imgur.com/qE4ZHJF.png)

- Jeżeli zmienna `interval` jest równa `intervalWeekend` to w konsoli pojawi się log:

  !["Jak wygląda log z funkcji scheduleUpdate w przypadku gdy interval jest równy intervalWeekend"](https://i.imgur.com/MPenlIw.png)

- Jeżeli zmienna `interval` jest równa `intervalOffAir` to w konsoli pojawi się log:

  !["Jak wygląda log z funkcji scheduleUpdate w przypadku gdy interval jest równy intervalOffAir"](https://i.imgur.com/o1jm9oX.png)

- Po tym wszystkim funkcja zwróci loga:

    !["Jak wygląda log z funkcji scheduleUpdate przed czyszczeniem i startowaniem nowego interwału"](https://i.imgur.com/VOJZrpH.png)

I wyczyści interwał i uruchomi nowy interwał przy użyciu funkcji [`startInterval()`](https://github.com/PFilip08/elektron-radio-player/blob/master/docs/Dokumentacja%20Funkcji/ApiConnector.js.md#startinterval).

## Tryb Debugowania

Po uruchomieniu funkcji log pokaże jakie ustawienia czasu są ustawione:
!["Jak wygląda log z funkcji scheduleUpdate który pokazuje ustawienia czasu w trybie debugowania"](https://i.imgur.com/vvIn0A4.png)

# DebugStarter()
Funkcja ta nie przyjmuje żadnych argumentów służy ona do przełączenia zmiennej globalnej `debugMode` oraz tworzy folder `debug/` gdzie funkcja `DebugSaveToFile()` zapisuje pliki.

Kiedy w pliku `.env` zmienna `VERBOSE` jest ustawiona na `true` to funkcja `DebugStarter()` ustawia zmienną globalną `debugMode` na wartość `true`.
I infomuje o tym logiem że tryb debugowaniua został uruchomiony:

![Log z funkcji DebugStarter informujący o uruchomieniu trybu debugowania](https://i.imgur.com/0N6Ml4o.png)

Po tym infomuje jakie ustawienia są załadowane:

![Log z funkcji DebugStarter informujący o załadowanych ustawieniach](https://i.imgur.com/GFFF7L1.png)

Jeżeli nie istnieje zmienna w pliku `.env`o nazwie `SPOTIFY_CLIENT_ID` to funkcja `DebugStarter()` wyświetla log o braku tej zmiennej:
![Log z funkcji DebugStarter informujący o braku zmiennej SPOTIFY_CLIENT_ID](https://i.imgur.com/Zwi82ym.png)

Jeżeli nie istnieje zmienna w pliku `.env`o nazwie `SPOTIFY_CLIENT_SECRET` to funkcja `DebugStarter()` wyświetla log o braku tej zmiennej:
![Log z funkcji DebugStarter informujący o braku zmiennej SPOTIFY_CLIENT_SECRET](https://i.imgur.com/vmAAsAv.png)

i tworzy folder `debug/` w którym funkcja `DebugSaveToFile()` zapisuje pliki.

W przypadku gdy zmienna `VERBOSE` jest ustawiona na `false` to funkcja `DebugStarter()` ustawia zmienną globalną `debugMode` na wartość `false` 
I jeżeli istnieje folder `debug/` po poprzedniej pracy w tym trybie to go usuwa i informuje o tym logiem:
![Log z funkcji DebugStarter informujący o usunięciu folderu debug/](https://i.imgur.com/Nu27j9I.png)

# DebugSaveToFile()
Funkcja ta przyjmuje cztery argumenty:
- `moduleName` - nazwa modułu z którego jest wywoływana funkcja
- `functionName` - nazwa funkcji z której jest wywoływana funkcja
- `fileName` - nazwa pliku do którego ma zostać zapisany log
- `data` - dane które mają zostać zapisane w pliku
Jeżeli funkcja zostanie wywołana a tryb debugowania nie jest włączony to funkcja wywali player z błędem i logiem:
![Błąd który zostanie wywołany jeżeli tryb debugowania nie jest włączony](https://i.imgur.com/9hmVuCt.png)
![Log z funkcji DebugSaveToFile informujący o braku włączonego trybu debugowania](https://i.imgur.com/GQa69Vq.png)

Jeżeli tryb debugowania jest włączony to funkcja zapisuje dane do pliku w folderze `debug/`.
Jeżeli zmienna `data` będzie pusta to funkcja nie zapisze do pliku a wyświetli log z informacją że nie ma danych do zapisania i skąd nastąpiło wywołanie:
![Log z funkcji DebugSaveToFile informujący o braku danych do zapisania](https://i.imgur.com/E68Av8I.png)

Funkcja potrafi sama wykryć typ danych jakie do niej trawiły i zapisuje je w odpowiednim formacie:
- Jeżeli dane to stack trace to ustawia zmienną `dataType` na `STACK` i wyświetla log z informacją o tym oraz z skąd dane pochodzą:
![Log z funkcji DebugSaveToFile informujący o tym że dane to stack trace](https://i.imgur.com/GEhLmWE.png)

- Jeżeli dane to JSON to ustawia zmienną `dataType` na `JSON` i wyświetla log z informacją o tym oraz z skąd dane pochodzą:
![Log z funkcji DebugSaveToFile informujący o tym że dane to JSON](https://i.imgur.com/FSkCleR.png)

Po rozpoznaniu typu danych funkcja zaczyna tworzyć folder w formacie `debug/P{Nazwa Modułu}/{Nazwa Funkcji}/`
Po utworzeniu folderu funkcja tworzy plik zależny od tego co zostało przekazane do zmiennej dataType:
- Jeżeli `dataType` to `JSON` to funkcja tworzy plik w formacie `.json`:
    - W przypadku gdy dane pochodzą z funkcji [`logChanges()`]() to nie jest tworzony nowy plik tylko dane są dopisywane do tego pliku
    - W normalnym przypadku funkcja tworzy plik w formacie `.json` i zapisuje do niego dane w formacie JSON tworząc nowy plik lub nadpisując stary
- Jeżeli `dataType` to `STACK` to funkcja tworzy plik w formacie `.txt`.
- A w przypadku gdy funkcja nie będzie w stanie wykryć typu danych to wywali się z błędem i wywali program z kodem błędu 1:
![Błąd który zostanie wywołany jeżeli funkcja nie będzie w stanie rozpoznać typu danych](https://i.imgur.com/tiuXlcT.png)

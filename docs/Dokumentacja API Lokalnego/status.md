# Endpoint query/playing
### Opis
Ten endpoint zwraca informacje o aktualnie odtwarzanej piosence.
### Request
- **Metoda:** GET
- **Endpoint:** `/status/query/playing`
### Response
W przypadku powodzenia ale gdy nic nie jest odtwarzane zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** 
```json
{
    "isPlaying":false, //boolean <true,false>
    "playingSongName":"Nic aktualnie nie gra", //string <Nazwa piosenki>
    "time":{} //object
}
```
W przypadku powodzenia ale jest coś odtwarzane zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** 
```json
{
    "isPlaying":true, //boolean <true,false>
    "playingSongName":"Nic aktualnie nie gra", //string <Nazwa piosenki>
    "time":{ //object
        "current":0, //number <czas w sekundach>
        "duration":0 //number <czas w sekundach>
    }
}
```
W przypadku powodzenia ale jest coś odtwarzane zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** 
```json
{   
    "isPlaying":true, //boolean <true,false>
    "playingSongName":"Never_Gonna_Give_You_Up", //string <Nazwa piosenki>
    "time":{ //object
        "played":16, //number <czas w sekundach>
        "toPlay":212 //number <czas w sekundach>
    }
}
```
Przykład:
```bash
curl -X GET http://localhost:8080/status/query/playing
```
# Endpoint query/playlist/list
### Opis
Ten endpoint zwraca listę playlist z folderu ./mp3 wraz z ich nazwami zapisanymi w funkcji getPlaylistName().
### Request
- **Metoda:** GET
- **Endpoint:** `/status/query/playlist/list`
### Response
W przypadku powodzenia i gdy wszyskie playlisty są prawidłowe oraz nazwa została znaleziona zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** 
```json
{
    "playlistNames": { //object <id playlisty: nazwa playlisty>
        "1": "Klasyczna", //string <Nazwa playlisty>
        "2": "POP", //string <Nazwa playlisty>
        "3": "RAP", //string <Nazwa playlisty>
        "4": "ROCK", //string <Nazwa playlisty> 
        "5": "Soundtracki" //string <Nazwa playlisty>
    },
    "playlistList": [ //array <Nazwa folderów playlist>
        "1", //string <Nazwa folderu playlisty>
        "2", //string <Nazwa folderu playlisty>
        "3", //string <Nazwa folderu playlisty>
        "4", //string <Nazwa folderu playlisty>
        "5" //string <Nazwa folderu playlisty>
    ]
}
```
W przypadku powodzenia ale gdy jednej z playlist nazwa nie została znaleziona zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** 
```json
{   "playlistNames": { //object <id playlisty: nazwa playlisty>
        "1":"Klasyczna", //string <Nazwa playlisty>
        "2":"POP", //string <Nazwa playlisty>
        "3":"RAP", //string <Nazwa playlisty>
        "4":"ROCK", //string <Nazwa playlisty>
        "5":"Soundtracki", //string <Nazwa playlisty>
        "6":"Nieznana playlista" //string <Nazwa playlisty>
    },
    "playlistList": [ //array <Nazwa folderów playlist>
        "1", //string <Nazwa folderu playlisty>
        "2", //string <Nazwa folderu playlisty>
        "3", //string <Nazwa folderu playlisty>
        "4", //string <Nazwa folderu playlisty>
        "5", //string <Nazwa folderu playlisty>
        "6" //string <Nazwa folderu playlisty>
    ]
}
```
W przypadku powodzenia ale gdy jedna z playlist jest nieprawidłowa zwracany jest
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:** 
```json
{   
    "playlistNames": { //object <id playlisty: nazwa playlisty>
        "1":"Klasyczna", //string <Nazwa playlisty>
        "2":"POP", //string <Nazwa playlisty>
        "3":"RAP", //string <Nazwa playlisty>
        "4":"ROCK", //string <Nazwa playlisty>
        "5":"Soundtracki", //string <Nazwa playlisty>
        "6":"Playlista NIEPRAWIDŁOWA!!!" //string <Nazwa playlisty>
    },
    "playlistList": [ //array <Nazwa folderów playlist>
        "1", //string <Nazwa folderu playlisty>
        "2", //string <Nazwa folderu playlisty>
        "3", //string <Nazwa folderu playlisty>
        "4", //string <Nazwa folderu playlisty>
        "5", //string <Nazwa folderu playlisty>
        "Jestem_Nieprawidłowa_Playlista!" //string <Nazwa folderu playlisty>
    ]
}
```
Przykład:
```bash
curl -X GET http://localhost:8080/status/query/playlist/list
```
# Endpoint query/playlist/songs
### Opis
Ten endpoint zwraca listę piosenek z playlisty o podanym id.
### Request
- **Metoda:** GET
- **Endpoint:** `/status/query/playlist/songs`
- **Parametry:** 
    - **id** - id playlisty
### Response
W przypadku powodzenia i gdy wszystkie piosenki posiadają metadane zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:**
```json
{   
    "playlistName":"Klasyczna", //string <Nazwa playlisty>
    "playlistSongsName": [ //array <Nazwa piosenek>
        { //object
            "title":"The Avengers", //string <Nazwa piosenki>
            "artist":"Alan Silvestri" //string <Nazwa artysty>
        }, 
        { //object
            "title":"Sweden", //string <Nazwa piosenki>
            "artist":"C418" //string <Nazwa artysty>
        },
        { //object
            "title":"Nocturne No. 2 in E-Flat Major, Op. 9 No. 2", //string <Nazwa piosenki>
            "artist":"Frédéric Chopin" //string <Nazwa artysty>
        },
        { //object
            "title":"Fontaine", //string <Nazwa piosenki>
            "artist":"HOYO-MiX" //string <Nazwa artysty>
        },
        { //object
            "title":"Howl's Moving Castle - The Flower Garden", //string <Nazwa piosenki>
            "artist":"Layi" //string <Nazwa artysty>
        },
        { //object
            "title":"Dragonborn", //string <Nazwa piosenki>
            "artist":"Jeremy Soule" //string <Nazwa artysty>
        },
        { //object
            "title":"Cello Suite No. 1 in G Major, BWV 1007: I. Prélude", //string <Nazwa piosenki>
            "artist":"Johann Sebastian Bach" //string <Nazwa artysty>
        },
        { //object
            "title":"Duel of the Fates", //string <Nazwa piosenki>
            "artist":"John Williams" //string <Nazwa artysty>
        },
        { //object
            "title":"Star Wars (Main Theme)", //string <Nazwa piosenki>
            "artist":"John Williams" //string <Nazwa artysty>
        },
        { //object
            "title":"He's a Pirate", //string <Nazwa piosenki>
            "artist":"Klaus Badelt" //string <Nazwa artysty>
        },
        { //object
            "title":"Can You Hear The Music", //string <Nazwa piosenki>
            "artist":"Ludwig Göransson" //string <Nazwa artysty>
        },
        { //object
            "title":"Bagatelle No. 25 in A Minor, WoO 59 \"Für Elise\"", //string <Nazwa piosenki>
            "artist":"Ludwig van Beethoven" //string <Nazwa artysty>
        },
        { //object
            "title":"Memory Is A Voyager", //string <Nazwa piosenki>
            "artist":"Max Richter" //string <Nazwa artysty>
        },
        { //object
            "title":"Overture: Lore", //string <Nazwa piosenki>
            "artist":"Takeshi Furukawa" //string <Nazwa artysty>
        }
    ]
}
```
W przypadku powodzenia ale gdy jedna z piosenek nie posiada autora w metadanych zwracany jest:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:**
```json
{
    "playlistName":"Ruskie Techno dla niesłyszących", //string <Nazwa playlisty>
    "playlistSongsName": [ //array <Nazwa piosenek>
        { //object
            "title":"Basshunter DotA (Offical Video)", //string <Nazwa piosenki>
            "artist":"BASSHUNTER" //string <Nazwa artysty>
        },
        {
            "title":"Basshunter DotA", //string <Nazwa piosenki>
            "artist":"Nieznany artysta" //string <Nazwa artysty>
        }
    ]
}
```
W przypadku powodzenia ale gdy jedna z piosenek nie posiada tytułu w metadanych zwracana wtedy jest nazwa z pliku:
- **Kod statusu:** 201
- **Typ:** application/json
- **Treść:**
```json
{
    "playlistName":"Ruskie Techno dla niesłyszących", //string <Nazwa playlisty>
    "playlistSongsName": [ //array <Nazwa piosenek>
        { //object
            "title":"Basshunter DotA (Offical Video)", //string <Nazwa piosenki>
            "artist":"BASSHUNTER" //string <Nazwa artysty>
        },
        {
            "title":"Tytuł piosenki", //string <Nazwa piosenki>
            "artist":"BASSHUNTER" //string <Nazwa artysty>
        }
    ]
}
```
W przypadku gdy playlista nie istnieje zwracany jest:
- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Nie znaleziono playlisty o podanym ID!`

Przykład:
```bash
curl -X GET http://localhost:8080/status/query/playlist/songs?id=1
```

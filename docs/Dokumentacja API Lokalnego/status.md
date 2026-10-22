> [!CAUTION]
> Dokumentacja od API NIEAKTUALNA!!! Może kiedyś ktoś ją zaaktualizuje
# Endpoint query/playing

### Opis

Ten endpoint zwraca informacje o aktualnie odtwarzanej piosence.
### Request

- **Metoda:** GET
- **Endpoint:** `/status/query/playing`

### Response

W przypadku powodzenia, ale gdy nic nie jest odtwarzane zwracany jest:

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

W przypadku powodzenia, ale jest coś odtwarzane zwracany jest:

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

W przypadku powodzenia, ale jest coś odtwarzane zwracany jest:

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

W przypadku powodzenia, ale gdy jednej z playlist nazwa nie została znaleziona zwracany jest:

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

W przypadku powodzenia, ale gdy jedna z playlist jest nieprawidłowa zwracany jest

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
  - **nocache** - parametr opcjonalny, jeżeli podany to odpowiedź nie będzie korzystać z cache i ten cache zostanie odświeżony, jeżeli nie to odpowiedź będzie korzystać z cache.

- **Metoda:** POST
- **Endpoint:** `/status/query/playlist/songs`
- **Parametry:**
    - **forceall** - parametr wymagany, jeżeli podany to cache playlist zostanie wyczyszczony i będzie pusty

### Response
#### W przypadku GET
W przypadku powodzenia i gdy playlista została zwrócona z cache zwracany jest:
- **Kod statusu:** 200 (kod zwracany tylko w przypadku gdy playlista została zwrócona z cache reszta przypadków zwraca 201)
- **Typ:** text/html
- **Treść:** Taka sama w zależności od przypadków poniżej dla metody GET
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

W przypadku powodzenia, ale gdy jedna z piosenek nie posiada autora w metadanych zwracany jest:

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

W przypadku powodzenia, ale gdy jedna z piosenek nie posiada tytułu w metadanych zwracana wtedy jest nazwa z pliku:

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
W przypadku gdy parametr `id` próbował podać ścieżkę, która by uciekła poza folder mp3:
- **Kod statusu:** 403
- **Typ:** text/html
- **Treść:** `Niebezpieczna ścieżka!`
W przypadku gdy parametr `id` nie został podany bądź będzie pusty:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Nie podano nazwy lub ID playlisty!`
W przypadku gdy playlista nie istnieje zwracany jest:

- **Kod statusu:** 500
- **Typ:** text/html
- **Treść:** `Nie znaleziono playlisty o podanym ID!`
#### W przypadku POST
w przypadku powodzenia i podania parametru `forceall` zwracany jest:
- **Kod statusu:** 200
- **Typ:** text/html
- **Treść:** `Wyczyszczono cache playlist!`
w przypadku powodzenia i podania parametru `forceall` ale cache jest pusty zwracany jest:
- **Kod statusu:** 400
- **Typ:** text/html
- **Treść:** `Cache playlist jest pusty!`

### Przykład:

```bash
curl -X GET http://localhost:8080/status/query/playlist/songs?id=1&nocache=true
```

# Endpoint query/recoveryMode

### Opis
Ten endpoint zwraca informacje o tym czy tryb recovery jest włączony oraz w jakim trybie działa.

### Request

- **Metoda:** GET
- **Endpoint:** `/status/query/recoveryMode`
- **Parametry:**
    - **normal** - Parametr opcjonalny, jeżeli podany to zwracany response jest w formacie JSON, jeżeli nie to zwracany jest w formacie text/event-stream.

### Response

W przypadku gdy nie podano parametru `normal` zwracany jest:
- **Kod statusu:** 200
- **Typ:** text/event-stream
- **Treść:**
```json
{
    "status":true, //boolean <true,false> oznacza że tryb recovery jest włączone
    "staticPlaylist":true, //boolean <true,false> (pole opcjonalne nie zawsze jest) oznacza że tryb recovery pobiera schedule zapisany w skrypcie a nie ze zmiennej previousData 
    "previousDataPlaylistUse":true //boolean <true,false> oznacza że tryb recovery pobiera schedule zapisany w zmiennej previousData a nie ze skryptu
}
```

W przypadku gdy podano parametr `normal` zwracany jest:
- **Kod statusu:** 200
- **Typ:** application/json
- **Treść:**
```json
{
    "status":true, //boolean <true,false> oznacza że tryb recovery jest włączone
    "staticPlaylist":true, //boolean <true,false> (pole opcjonalne nie zawsze jest) oznacza że tryb recovery pobiera schedule zapisany w skrypcie a nie ze zmiennej previousData
    "previousDataPlaylistUse":true //boolean <true,false> oznacza że tryb recovery pobiera schedule zapisany w zmiennej previousData a nie ze skryptu
}
```

### Przykład:

```bash
curl -X GET http://localhost:8080/status/query/recoveryMode?normal=true
```
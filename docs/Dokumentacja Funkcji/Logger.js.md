# logger()
Funkcja została opisana tutaj: 

# findChanges()
findChanges jest funkcją, która porównuje dwa obiekty (obj1 i obj2) i zwraca listę zmian między nimi. Funkcja jest wywoływana rekursywnie, aby porównać zagnieżdżone struktury obiektów.

Funkcja findChanges przyjmuje trzy argumenty:

- `obj1` (Object): Pierwszy obiekt do porównania.
- `obj2` (Object): Drugi obiekt do porównania.
- `path` (String, opcjonalnie): Ścieżka do bieżącego klucza w strukturze obiektu, używana do śledzenia pełnej ścieżki do zmienionych kluczy.
### Opis działania
1. Funkcja tworzy pustą tablicę `changes`, która będzie zawierała wszystkie zmiany między `obj1` i `obj2`.
2. Funkcja tworzy zbiór keys, który zawiera wszystkie unikalne klucze z `obj1` i `obj2`.
3. Iteruje przez każdy klucz w zbiorze `keys`.
4. Dla każdego klucza:
 - Tworzy pełną ścieżkę do klucza, łącząc bieżącą ścieżkę (`path`) i klucz (`key`).
 - Porównuje wartości `obj1[key]` i `obj2[key]` przy użyciu JSON.stringify:
 - Jeśli wartości są różne, sprawdza, czy obie wartości są obiektami.
   - Jeśli tak, wywołuje findChanges rekursywnie, przekazując pod-objekty i pełną ścieżkę.
   - Jeśli nie, dodaje zmianę do tablicy changes, zawierając pełną ścieżkę oraz stare i nowe wartości.
5. Funkcja zwraca tablicę `changes`.
### Zwraca
- `changes` (Array): Tablica obiektów, gdzie każdy obiekt reprezentuje jedną zmianę. Struktura obiektu zmiany:
 - `key` (String): Ścieżka do zmienionego klucza.
 - `oldValue` (Any): Wartość klucza w `obj1`.
 - `newValue` (Any): Wartość klucza w `obj2`.
# logChanges()
logChanges jest funkcją, która ogarnia wyświetlanie zmian które wykryła funkcja findChanges w czytelnej formie. Wykonuje się ona w pętli for i wykona się tyle razy ile findChanges wykrył zmian.

Log w domyślnej formie wyświetla się tak:
!["Jak wygląda log domyślny z funkcji logChanges"](https://i.imgur.com/9y6FaPV.png)
### Dla klucza `start` i `end`
Gdy zmieni się wartość godziny która jest określona przez klucze `start` lub `end` w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy zmieni się godzina"](https://i.imgur.com/yC9EYZI.png)

### Dla klucza `playlist`
Gdy klucz playlist zostanie usunięty z dowolnego klucza w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy usunięty zostanie klucz playlist"](https://i.imgur.com/8YxXf4R.png)
Gdy klucz playlist zostanie dodany do dowolnego klucza w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy dodany zostanie klucz playlist"](https://i.imgur.com/vCBV2gg.png)
Gdy klucz playlist wartość klucza zostanie zmieniona w dowolnym kluczu w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy zmieni się wartość klucza playlist"](https://i.imgur.com/Sr5LEby.png)
### Dla klucza `OnDemand`
Gdy klucz OnDemand zostanie usunięty z dowolnego klucza w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy usunięty zostanie klucz OnDemand"](https://i.imgur.com/0lHEohZ.png)
Gdy klucz OnDemand zostanie dodany do dowolnego klucza w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy dodany zostanie klucz OnDemand"](https://i.imgur.com/sug4Wfv.png)
Gdy klucz OnDemand wartość klucza zostanie zmieniona w dowolnym kluczu w JSONie to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy zmieni się wartość klucza OnDemand"](https://i.imgur.com/1Q4AktC.png)
### Dla klucza `applyRule`
Funkcja dla klucza `applyRule` na początku rodziela klucz usuwając z niego znak `.` i zwraca ostatni obiekt w kluczu i obiekt jest następnie mapowany przez switcha który ustawia zmienną `day` w zależności na co on trafił następnie zwraca loga z informacją jaki dzień się zmienił oraz jaka zasada ma dla niej zastosowanie a wygląda ten log tak:
!["Jak wygląda log z funkcji logChanges gdy zmieni się nr zasady dla dnia Poniedziałek"](https://i.imgur.com/BwzEwsb.png)
Bardzo rzadki przypadek ale jeżeli switch nie wyłapie dla jakiego dnia klucz się zmienił to wyświetli taki komunikat:
!["Jak wygląda log z funkcji logChanges gdy zmieni się nr zasady dla dnia który nie jest zdefiniowany"](https://i.imgur.com/CCyWD2A.png)
### Gdy pojawi się nowa zasada w kluczu `timeRules.rules`
Gdy pojawi się nowa zasada w kluczu `timeRules.rules` to funkcja wyświetli taki o to ładny log który informuje jakie godziny wprowadza oraz dla ilu przerw:
!["Jak wygląda log z funkcji logChanges gdy pojawi się nowa zasada"](https://i.imgur.com/9YYfkzc.png)
Gdy natomiast zasada zostanie usunięta to pojawi się taki o to log:
!["Jak wygląda log z funkcji logChanges gdy usunięta zostanie zasada"](https://i.imgur.com/rq3wKJa.png)
### Dla klucza `currentPlaylistId`
Gdy klucz `currentPlaylistId` zostanie zmieniony to funkcja wyświetli log w konsoli:
!["Jak wygląda log z funkcji logChanges gdy zmieni się wartość klucza currentPlaylistId"](https://i.imgur.com/sXBWxHG.png)
### Dla kluczy `id` i `created_at`
Dla tych klucza funkcja nie wyświetla logów.
### Dla pozostałych kluczy
Funkcja będzie wyświetlała tylko to że klucz został zmieniony ale nie wyświetla że został usunięty lub dodany.
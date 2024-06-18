Logger w elektron radio playerze służy do logowania. 
Funkcja odpowiedzialna za logi wygląda następująco:
```javascript
logger(type, content, name)
```
Gdzie:
- type - typ logu
- content - treść logu
- name - nazwa funkcji z której log pochodzi(nie będzie pokazywana dla logów typu POST i READY)
# Wygląd Logów w Konsoli
Logi w konsoli prezentują się w następujący sposób:
!["Z czego składa się log?"](https://i.imgur.com/mfQadDt.png)
# Typ Logów
Logger posiada w sobie 7 typów logów pokazanych poniżej:
!["Jak wyglądają te typy logów?"](https://i.imgur.com/TfLhC0I.png)
- LOG - oznacza się nim logi które zawierają informacje z funkcji np. że pobrano dane z api przyjmuje on też parametr 'name'
- WARN - oznacza się nim logi które zawierają ostrzeżenie na temat działania playera np że nie mógł się połączyć z api i używa trybu recovery przyjmuje on też parametr 'name'
- ERROR - oznacza się nim logi które zawierają błędy krtyczne które wpłyneły na działanie playera np. błąd w funkcji lub niespodziewana odpowiedź z api albo oznacza się nimi błędy właśnościowe jak np. funkcja walidacji prawidłowości zapisu czasu przyjmuje on też parametr 'name'
- DEBUG - oznacza się nim logi które zawierają informacje pomocne w debugowaniu np. informacje o tym jakie dane zaaktualizowały się w jsonie który został pobrany z API przyjmuje on też parametr 'name'
- TASK - oznacza się nim logi które zawierają informacje o związane z zadaniami np. informacje o liczbie zadań lub uruchomienie konkretnego zadania przyjmuje on też parametr 'name'
- POST - oznacza się nim logi głownie logi związane z plikiem POST.js i NIE przyjmuje on parametru 'name'
- READY - nie powinno się go używać w kodzie ale jest on używany jako log specjalny informujący o gotowości automatu do działania i NIE przyjmuje on parametru 'name'
# Przykład użycia
```javascript
import {logger} from "./Logger.js";
logger('log', 'Jestem logiem!', 'Nazwa Funkcji')
logger('warn', 'Jestem ostrzeżeniem!', 'Nazwa Funkcji')
logger('error', 'Jestem błędem!', 'Nazwa Funkcji')
logger('debug', 'Jestem debugowaniem!', 'Nazwa Funkcji')
logger('task', 'Jestem zadaniem!', 'Nazwa Funkcji')
logger('POST', 'Jestem POSTem!')
logger('ready', 'Jestem gotowy!')
```
W przypadku gdy podamy zły typ loga w polu 'type' zostanie wyświetlony błąd w konsoli:
```javascript
TypeError: Logger type must be either warn, debug, log, ready, POST, task or error.
```
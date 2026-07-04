const whitespace = "-\/|.,!:;'\" \t\n\r{}[]()";
const stack = [];
let curNIndex = 0;
let curNode = null;
let curIndex = -1;
let state = 1;
let lastword = '';

function performAction(url, params = {}) {
    let metoda = 'POST';
    const queryString = new URLSearchParams(params).toString();
    const iframe = document.getElementById('res');
    if (url.startsWith('/dev/api')) {
        metoda = 'GET';
    } else if (url.startsWith('/dev/schedules/removeTask') || url.startsWith('/votes/delmp3')) {
        metoda = 'DELETE';
    }
    fetch(`${url}?${queryString}`, { method: metoda })
        .then(response => response.text())
        .then(data => {
            console.log('Akcja wykonana:', data);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(data);
            iframe.contentWindow.document.close();
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas wykonywania akcji.\nSkontaktuj się z Działem Taboretów.');
        });
}

function nextLetter() {
    if (curNode == null) return null;
    if (curIndex >= curNode.data.length) {
        curNode = stack[++curNIndex];
        curIndex = -1;
        if (curNode == null) return null;
    }

    curIndex++;
    if (curIndex >= curNode.data.length) {
        return ' ';
    }
    return curNode.data[curIndex];
}

function nextAfterWord() {
    let lett;
    dupa:while (true) {
        do {
            lett = nextLetter();
            if (lett == null) return false;
        } while (whitespace.indexOf(lett) !== -1);

        if (state === 1) {
            /* byliszmy na poczatku, teraz kurwa bedziemy szukac konca wyrazu */
            state = 2;
            return true;
        }

        state = 3;

        const starting = curIndex;
        do {
            lett = nextLetter();
            if (lett == null) return false;
            if (state === 1) continue dupa;
        } while (whitespace.indexOf(lett) === -1);

        lastword = curNode.data.substr(starting, curIndex - starting).toLowerCase();
        return true;
    }
}

function putHere(text) {
    if (curNode == null) return;
    curNode.data = curNode.data.substr(0, curIndex) + (state !== 2 ? ' ' : '') + text + (state === 2 ? ' ' : '') + curNode.data.substr(curIndex);
    curIndex += text.length + 2;
}

function replaceLast(text) {
    const s2 = curNode.data.substr(curIndex);
    curIndex -= lastword.length;
    const s1 = curNode.data.substr(0, curIndex);
    curIndex += text.length;
    curNode.data = s1 + text + s2;
}


function przelec(node) {
    if (typeof node != "object" || typeof node.childNodes != "object") return;
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === 1 && child.tagName !== "SCRIPT" && child.tagName !== "IFRAME" /*&& child.tagName!="PRE"*/) {
            przelec(child);
        }
        if (child.nodeType === 3) {
            stack.push(child);
        }
    }
}

function kurwa() {
    przelec(document.body);
    curNode = stack[0];
    let i = Math.floor(Math.random() * 9);
    while (nextAfterWord()) {
        if (i-- <= 0) {
            if (lastword === 'na') continue;
            if (lastword === 'do') continue;
            if (lastword === 'jak') continue;
            if (lastword === 'nie') continue;
            if (lastword === 'kurwa') continue;
            putHere('kurwa');
            i = 2 + Math.floor(Math.random() * 8);
        }
    }
}

let LAST_KEY = null;
document.addEventListener("keydown", (ev) => {
    if (['TEXTAREA', 'INPUT', 'textarea', 'input'].includes(ev.target.tagName)) return;
    if (ev.key === "k") LAST_KEY = "k"; else if (ev.key === "u" && LAST_KEY === "k") LAST_KEY = "u"; else if (ev.key === "r" && LAST_KEY === "u") LAST_KEY = "r"; else if (ev.key === "w" && LAST_KEY === "r") LAST_KEY = "w"; else if (ev.key === "a" && LAST_KEY === "w") {
        kurwa()
        LAST_KEY = null;
    } else LAST_KEY = null;
});

window.DONT_KURWA = true;
// dzieki ciach
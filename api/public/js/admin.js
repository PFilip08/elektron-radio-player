function performAction(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const iframe = document.getElementById('res');
    fetch(`${url}?${queryString}`, { method: 'GET' })
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

function toggleSafeguard() {
    let safeguardOverride;
    if (localStorage.getItem("safeguardOverride") === null) {
        localStorage.setItem("safeguardOverride", false);
    }
    safeguardOverride = localStorage.getItem("safeguardOverride") === "false";
    console.log(safeguardOverride);
    localStorage.setItem("safeguardOverride", safeguardOverride);
    console.log('Zabezpieczenie:', safeguardOverride ? 'włączone' : 'wyłączone');
    panelSafeguard();
}
async function panelSafeguard(endpoint, params = {}) {
    let tocos2 = await todayData();
    const safeguardWarn = document.getElementById('safeguard');
    if (localStorage.getItem("safeguardOverride") === "false") {
        console.warn('OSTRZEŻENIE! OSTRZEŻENIE!\nZabezpieczenie panelu jest wyłączone!!!');
        if (!endpoint) {
            if (!safeguardWarn.querySelector('p')) {
                const p = document.createElement('p');
                p.innerHTML = `OSTRZEŻENIE! OSTRZEŻENIE!<br>Zabezpieczenie panelu jest wyłączone!!!`;
                safeguardWarn.appendChild(p);
                fetch('/stats/confident?type=safeguardd', { method: 'POST' });
                return;
            }
        }
        performAction(endpoint, params);
        return;
    }
    if (!endpoint) {
        return;
    }
    if (localStorage.getItem("safeguardOverride") === "true") {
        if (safeguardWarn.querySelector('p')) {
            safeguardWarn.removeChild(safeguardWarn.querySelector('p'));
            fetch('/stats/confident?type=safeguarde', { method: 'POST' });
            return;
        }
    }
    const warningText = `<div class="blink" style="color: red; font-size: xx-large;">OSTRZEŻENIE! OSTRZEŻENIE!</div>`
    if (tocos2.data.today === 'Sat' || tocos2.data.today === 'Sun') {
        showCustomAlert(
            `${warningText}\nDziś jest weekend!\n Puszczenie muzyki w weekend może spowodować problemy i masowe skargi do Opiekuna SU!!!\nPRÓBA I TAK ZOSTAŁA JUŻ ZAREJESTROWANA!\n PUSZCZENIE MUZYKI WYKONUJESZ TO WŁASNĄ ODPOWIEDZIALNOŚĆ!!!\n Czy na pewno chcesz kontynuować?`,
            "OK",
            "Anuluj",
        () => {
            performAction(endpoint, params)
            fetch('/stats/confident?type=weekend', { method: 'POST' });
        },
        () => fetch('/stats/confident?type=weekenda', { method: 'POST' }),
        );
        return;
    }
    if ((tocos2.data.today === 'Mon' || tocos2.data.today === 'Tue' || tocos2.data.today === 'Wed' || tocos2.data.today === 'Thu' || tocos2.data.today === 'Fri')) {
        if (tocos2.timeToNextRule.includes("Przerwa")) {
            showCustomAlert(
                `${warningText}\nAKTUALNIE TRWA LEKCJA!!!\nPuszczenie muzyki w tym momencie może spowodować problemy u Dyrekcji Szkoły i skargi do Opiekuna SU!!!\n PRÓBA ZOSTAŁA JUŻ ZAREJESTROWANA!\nPUSZCZENIE MUZYKI WYKONUJESZ NA WŁASNĄ ODPOWIEDZIALNOŚĆ!!!\n Czy na pewno chcesz kontynuować?`,
                "OK",
                "Anuluj",
            () => {
                performAction(endpoint, params)
                fetch('/stats/confident?type=lesson', { method: 'POST' });
            },
            () => fetch('/stats/confident?type=lessona', { method: 'POST' }),
            );
            return;
        } if (tocos2.timeToNextRule === 'taboret') {
            showCustomAlert(
                `${warningText}\nPRÓBA PUSZCZENIA MUZYKI W RADIU PO GODZINACH PRACY RADIA!!!\n BLOKADA PANELU ZOSTAŁA ZAINICJOWANA!!!\nA PRÓBA ZOSTAŁA ZAREJESTROWANA!`,
                "OK",
                null,
                () => fetch('/stats/confident?type=after', { method: 'POST' }),
                null,
            );
            return;
        }
    }
    if (tocos2.data === 'taboret' && tocos2.today === undefined) {
        showCustomAlert(
            `${warningText}\nMOŻLIWE ZARZĄDZENIE ZAKAZUJĄCE PUSZCZANIA MUZYKI W RADIU!!!\n BLOKADA PANELU ZOSTAŁA ZAINICJOWANA!!!\nA PRÓBA ZOSTAŁA JUŻ ZAREJESTROWANA!`,
            "OK",
            null,
            () => fetch('/stats/confident?type=hebel', { method: 'POST' }),
            null,
        );
        return;
    }
    else {
        showCustomAlert(
            "Logika się zjebała. Trzeba zagonić dział taboretów do naprawy.",
            "OK",
            null,
            () => fetch('/stats/confident?type=logicfail', { method: 'POST' }),
            null,
            0,
        )
        return;
    }
}

if(document.getElementById('shuffleOn')) {
    document.addEventListener("DOMContentLoaded", function () {
        panelSafeguard()
        fetch('/action/vlcSzuffle?state=check', {method: 'GET'})
            .then(response => response.text())
            .then(data => {
                const shuffleOn = document.getElementById('shuffleOn');
                const shuffleOff = document.getElementById('shuffleOff');
                if (data === 'true') {
                    shuffleOn.checked = true;
                } else {
                    shuffleOff.checked = true;
                }
            })
            .catch(error => {
                console.error('Błąd odczytu statusu:', error);
            });
    });
}

async function showCustomAlert(message, btn1Text, btn2Text, btn1Callback, btn2Callback, timeout = 5) {
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");

    let alertBox = document.createElement("div");
    alertBox.classList.add("alert-box");

    let msg = document.createElement("p");
    msg.innerHTML = message.replace(/\n/g, "<br>")

    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    let btn1 = null;
    let btn2 = null;

    btn1 = document.createElement("button");
    if (btn2Text) {
        btn2 = document.createElement("button");
        if (btn2Text === "Anuluj") {
            btn2.textContent = `${btn2Text}`;
        } else {
            btn2.textContent = `${btn2Text} (${timeout})`;
        }
        if (btn2Text != "Anuluj") {
            btn2.disabled = true;
        }
    }

    btn1.textContent = `${btn1Text} (${timeout})`;
    btn1.disabled = true;

    buttonsDiv.appendChild(btn1);
    if (btn2Text) {
        buttonsDiv.appendChild(btn2);
    }
    alertBox.appendChild(msg);
    alertBox.appendChild(buttonsDiv);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    if (timeout !== 0) {
        let countdown = setInterval(() => {
            timeout--;
            btn1.textContent = timeout > 0 ? `${btn1Text} (${timeout})` : btn1Text;
            if (btn2Text) {
                if (btn2Text != "Anuluj") {
                    btn2.textContent = timeout > 0 ? `${btn2Text} (${timeout})` : btn2Text;
                }
            }
            if (timeout === 0) {
                clearInterval(countdown);
                btn1.disabled = false;
                if (btn2Text) {
                    btn2.disabled = false;
                }
            }
        }, 1000);
    }
    btn1.addEventListener("click", () => {
        if (btn1Callback) btn1Callback();
        document.body.removeChild(overlay);
    });

    if (btn2Text) {
        btn2.addEventListener("click", () => {
            if (btn2Callback) btn2Callback();
            document.body.removeChild(overlay);
        });
    }
}
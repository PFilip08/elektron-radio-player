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

async function panelSafeguard() {
    //TODO: Do dokończenia bo to narazie POF i do poprawy bo counter jest WIP
    //const day = await getCounterData();
    //const tocos = await sortData();
    const tocos2 = await todayData();
    //console.log(tocos);
    console.log(tocos2);
    if (tocos2.data.today === 'Sat' || tocos2.data.today === 'Sun') {
        showCustomAlert(
            "OSTRZEŻENIE! OSTRZEŻENIE!\nDziś jest weekend!\n Puszczenie muzyki w weekend może spowodować problemy i masowe skargi do Opiekuna SU!!!\n PUSZCZENIE MUZYKI WYKONUJESZ TO WŁASNĄ ODPOWIEDZIALNOŚĆ!!!\n Czy na pewno chcesz kontynuować?",
            "OK",
            "Anuluj",
        () => console.log("Puszczono muzykę"),
        () => console.log("Kliknięto Anuluj"),
        );
    }
    if ((tocos2.data.today === 'Mon' || tocos2.data.today === 'Tue' || tocos2.data.today === 'Wed' || tocos2.data.today === 'Thu' || tocos2.data.today === 'Fri')) {
        if (tocos2.timeToNextRule.includes("Przerwa")) {
            showCustomAlert(
                "OSTRZEŻENIE! OSTRZEŻENIE!\nAKTUALNIE TRWA LEKCJA!!!\nPuszczenie muzyki w tym momemcie może spowodować problemy u Dyrekcji Szkoły i skargi do Opiekuna SU!!!\n PUSZCZENIE MUZYKI WYKONUJESZ NA WŁASNĄ ODPOWIEDZIALNOŚĆ!!!\n Czy na pewno chcesz kontynuować?",
                "OK",
                "Anuluj",
            () => console.log("Puszczono muzykę"),
            () => console.log("Kliknięto Anuluj"),
            );
        }
    }
    if (tocos2.data === 'taboret') {
        showCustomAlert(
            "OSTRZEŻENIE! OSTRZEŻENIE!\nMOŻLIWE ZARZĄDZENIE ZAKAZUJĄCE PUSZCZANIA MUZYKI W RADIU!!!\n BLOKADA PANELU ZOSTAŁA ZAINICJOWANA!!!\n",
            "OK",
            null,
        () => console.log("Zablokowano panel"),
        () => console.log("Kliknięto Anuluj"),
        );
    }
}

if(document.getElementById('shuffleOn')) {
    document.addEventListener("DOMContentLoaded", function () {
        panelSafeguard();
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
    //btn2.textContent = `${btn2Text} (${timeout})`;
    btn1.disabled = true;
    //btn2.disabled = true;

    buttonsDiv.appendChild(btn1);
    if (btn2Text) {
        buttonsDiv.appendChild(btn2);
    }
    // buttonsDiv.appendChild(btn2);
    alertBox.appendChild(msg);
    alertBox.appendChild(buttonsDiv);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);

    let countdown = setInterval(() => {
        timeout--;
        btn1.textContent = timeout > 0 ? `${btn1Text} (${timeout})` : btn1Text;
        if (btn2Text != "Anuluj") {
            btn2.textContent = timeout > 0 ? `${btn2Text} (${timeout})` : btn2Text;
        }
        // btn2.textContent = timeout > 0 ? `${btn2Text} (${timeout})` : btn2Text;
        if (timeout === 0) {
            clearInterval(countdown);
            btn1.disabled = false;
            if (btn2Text) {
                btn2.disabled = false;
            }
        }
    }, 1000);

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
    // btn2.addEventListener("click", () => {
    //     if (btn2Callback) btn2Callback();
    //     document.body.removeChild(overlay);
    // });
}
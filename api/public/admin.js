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

document.addEventListener("DOMContentLoaded", function() {
    fetch('/action/vlcSzuffle?state=check', { method: 'GET' })
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
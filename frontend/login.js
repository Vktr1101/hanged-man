const loginAccount = document.querySelector('#loginBtn');

function afiseazaWarning(text) {
    document.querySelector('#message').textContent = text;
    document.querySelector('#message').classList.remove('animate');
    void document.querySelector('#message').offsetWidth;
    document.querySelector('#message').classList.add('animate');
}

loginAccount.addEventListener('click', async () => {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (!username || !password) {
        afiseazaWarning('Completati campurile goale!');
        return;
    }

    const raspuns = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const date = await raspuns.json();

    if (date.success) {
        window.location.href = 'index.html';
    } else {
        afiseazaWarning(date.error);
    }
});
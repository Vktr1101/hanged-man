const createAccount = document.querySelector('#registerBtn');

function afiseazaWarning(text) {
    document.querySelector('#message').textContent = text;
    document.querySelector('#message').classList.remove('animate');
    void document.querySelector('#message').offsetWidth;
    document.querySelector('#message').classList.add('animate');
}

createAccount.addEventListener('click', async () => {
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirm = document.querySelector('#confirm').value;

    if (!username || !email || !password || !confirm) {
        afiseazaWarning('Toate campurile sunt obligatorii!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        afiseazaWarning('Email invalid!');
        return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    if (!passRegex.test(password)) {
        afiseazaWarning('Parola trebuie sa contina minim 6 caractere, o majuscula si o cifra!');
        return;
    }

    if (password !== confirm) {
        afiseazaWarning('Parolele nu coincid!');
        return;
    }

    const raspuns = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const date = await raspuns.json();

    if (date.success) {
        window.location.href = 'index.html';
    } else {
        afiseazaWarning(date.error);
    }
});
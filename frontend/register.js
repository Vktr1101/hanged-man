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
        afiseazaWarning('All fields are mandatory!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        afiseazaWarning('Email is invalid!');
        return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    if (!passRegex.test(password)) {
        afiseazaWarning('The password must contain at least 6 characters, one capital letter and a number!');
        return;
    }

    if (password !== confirm) {
        afiseazaWarning('The passwords do not match!');
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
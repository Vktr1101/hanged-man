const createAccount = document.querySelector('#registerBtn');

createAccount.addEventListener('click', async () => {
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const raspuns = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const date = await raspuns.json();

    if (date.success) {
        window.location.href = 'login.html';
    } else {
        console.log(date.error);
    }
});
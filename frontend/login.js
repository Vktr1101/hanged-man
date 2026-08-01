const loginAccount = document.querySelector('#registerBtn');

loginAccount.addEventListener('click', async () => {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const raspuns = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const date = await raspuns.json();

    if (date.success) {
        window.location.href = 'index.html';
    } else {
        console.log(date.error);
    }
});
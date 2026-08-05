const play = document.querySelector('#play');
const history = document.querySelector('#history');
const newGame = document.querySelector('#restart');
const backHome = document.querySelector('#backHome');
const word = document.querySelector('#word');

const keyboard = document.querySelector('#keyboard');
const litere = 'qwertyuiopasdfghjklzxcvbnm';

for (const litera of litere) {
    const btn = document.createElement('button');
    btn.textContent = litera.toUpperCase();
    btn.className = 'key';
    btn.addEventListener('click', () => proceseazaLitera(litera));
    keyboard.appendChild(btn);
}

let cuvant, jocTerminat, litereGhicite, litereGresite, jocActiv = false, esteLogat = false;

function afiseazaCuvant() {
    const afisat = cuvant
        .split('')
        .map(l => litereGhicite.includes(l) ? l : '_')
        .join('')
        .toUpperCase();
    word.textContent = afisat;
}

function afiseazaGresite() {
    document.querySelector('#wrong').textContent = 'Wrong guesses: ' + litereGresite.join(', ').toUpperCase();
}

function afiseazaDesen() {
    const nrGreseli = litereGresite.length;
    if (nrGreseli > 0) {
        const parte = document.querySelector('#p' + nrGreseli);
        parte.style.visibility = 'visible';
    }
}

function fadeTranzitie(elemente, actiune) {
    elemente.forEach(el => el.classList.add('hidden'));

    setTimeout(() => {
        actiune();
        elemente.forEach(el => el.classList.remove('hidden'));
    }, 400);
}

async function verificaLogin() {
    const raspuns = await fetch('/api/me');
    const date = await raspuns.json();

    esteLogat = date.loggedIn;
    const login = document.querySelector('#login');

    if (esteLogat) {
        login.innerHTML = `<i class="fa-solid fa-circle-user"></i>&nbsp;${date.user.username}`;
        login.removeAttribute('href');
        login.style.cursor = 'default';
        document.querySelector('#userHeader').classList.add('logged-in');

        const userHeader = document.querySelector('#userHeader');
        const dropdown = document.querySelector('#dropdown');

        userHeader.addEventListener('mouseenter', () => {
            dropdown.classList.add('visible');
        });

        userHeader.addEventListener('mouseleave', () => {
            dropdown.classList.remove('visible');
        });

        document.querySelector('#logoutBtn').addEventListener('click', () => {
            document.querySelector('#modalLogout').classList.add('visible');
        });

        document.querySelector('#confirmLogout').addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.reload();
        });

        document.querySelector('#cancelLogout').addEventListener('click', () => {
            document.querySelector('#modalLogout').classList.remove('visible');
        });

        document.querySelector('#modalLogout').addEventListener('click', (e) => {
            if (e.target.id === 'modalLogout') {
                document.querySelector('#modalLogout').classList.remove('visible');
            }
        });

        document.querySelector('#deleteBtn').addEventListener('click', () => {
            document.querySelector('#modalDelete').classList.add('visible');
        });

        document.querySelector('#confirmDelete').addEventListener('click', async () => {
            await fetch('/api/delete-account', { method: 'POST' });
            window.location.reload();
        });

        document.querySelector('#cancelDelete').addEventListener('click', () => {
            document.querySelector('#modalDelete').classList.remove('visible');
        });

        document.querySelector('#modalDelete').addEventListener('click', (e) => {
            if (e.target.id === 'modalDelete') {
                document.querySelector('#modalDelete').classList.remove('visible');
            }
        });
    }
}

async function salveazaJoc(rezultat) {
    await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            word: cuvant,
            result: rezultat,
            mistakes: litereGresite.length
        })
    });
}

async function startGame() {
    const raspuns = await fetch('/api/cuvant');
    const date = await raspuns.json();
    cuvant = date.cuvant;

    litereGhicite = [];
    litereGresite = [];
    jocTerminat = false;

    afiseazaCuvant();
    afiseazaGresite();
    document.querySelector('#win-message').textContent = '';
    document.querySelector('#lose-message').textContent = '';
    document.querySelector('#sln').textContent = '';
    for (let i = 1; i <= 10; i++) {
        document.querySelector('#p' + i).style.visibility = 'hidden';
    }

    document.querySelector('#win-message').classList.remove('animate');
    document.querySelector('#lose-message').classList.remove('animate');
    document.querySelector('#sln').classList.remove('animate');
}

play.addEventListener('click', () => {
    document.querySelectorAll('.fade-out-home').forEach(el => el.classList.add('hidden'));
    document.querySelector('#title').classList.add('moved-up');

    setTimeout(() => {
        document.querySelector('#home').style.display = 'none';
        document.querySelector('#game').style.display = 'flex';
        jocActiv = true;
        startGame();

        document.querySelectorAll('.fade-out-game').forEach(el => el.classList.add('hidden'));
        requestAnimationFrame(() => {
            document.querySelectorAll('.fade-out-game').forEach(el => el.classList.remove('hidden'));
        });
    }, 500);

    document.querySelector('#homeMessage').textContent = '';
});

history.addEventListener('click', (e) => {
    if (!esteLogat) {
        e.preventDefault();
        document.querySelector('#homeMessage').textContent = 'You must be logged in to see your history!';
        document.querySelector('#homeMessage').classList.remove('animate');
        document.querySelector('#homeMessage').offsetWidth;
        document.querySelector('#homeMessage').classList.add('animate');
    }
});

newGame.addEventListener('click', () => {
    const el = document.querySelectorAll('#draw, #word, #wrong, #win-message, #lose-message, #sln');
    fadeTranzitie(el, startGame);
});

backHome.addEventListener('click', () => {
    document.querySelectorAll('.fade-out-game').forEach(el => el.classList.add('hidden'));
    document.querySelector('#title').classList.remove('moved-up');

    setTimeout(() => {
        document.querySelector('#game').style.display = 'none';
        document.querySelector('#home').style.display = 'flex';
        jocActiv = false;

        document.querySelectorAll('.fade-out-home').forEach(el => el.classList.add('hidden'));
        requestAnimationFrame(() => {
            document.querySelectorAll('.fade-out-home').forEach(el => el.classList.remove('hidden'));
        });
    }, 500);
});

function proceseazaLitera(litera) {
    if (jocTerminat || !jocActiv) return;
    if (litera < 'a' || litera > 'z' || litera.length !== 1) return;
    if (litereGhicite.includes(litera) || litereGresite.includes(litera)) return;

    if (cuvant.includes(litera)) {
        litereGhicite.push(litera);
    } else {
        litereGresite.push(litera);
    }

    afiseazaCuvant();
    afiseazaGresite();
    afiseazaDesen();

    if (litereGresite.length >= 10) {
        const lose = document.querySelector('#lose-message');
        const sln = document.querySelector('#sln');
        lose.textContent = 'You lost! The word was:';
        lose.classList.add('animate');
        sln.textContent = cuvant.toUpperCase();
        sln.classList.add('animate');
        jocTerminat = true;
        salveazaJoc('lose');
    }

    if (cuvant.split('').every(l => litereGhicite.includes(l))) {
        const win = document.querySelector('#win-message');
        win.textContent = 'Congratulations! You won!';
        win.classList.add('animate');
        jocTerminat = true;
        salveazaJoc('win');
    }
}

document.addEventListener('keydown', (e) => {
    proceseazaLitera(e.key.toLowerCase());
});

verificaLogin();
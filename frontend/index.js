const play = document.querySelector('#play');
const newGame = document.querySelector('#restart');
const backHome = document.querySelector('#backHome');
const word = document.querySelector('#word');

const cuvinte = ['javascript', 'programare', 'monitor', 'dreptunghi', 'elefant'];
let cuvant, jocTerminat, litereGhicite, litereGresite, jocActiv = false;

function afiseazaCuvant() {
    const afisat = cuvant
        .split('')
        .map(l => litereGhicite.includes(l) ? l : '_')
        .join('')
        .toUpperCase();
    word.textContent = afisat;
}

function afiseazaGresite() {
    document.querySelector('#wrong').textContent = 'Litere Gresite: ' + litereGresite.join(', ').toUpperCase();
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

function startGame() {
    cuvant = cuvinte[Math.floor(Math.random() * cuvinte.length)];
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

document.addEventListener('keydown', (e) => {
    if (jocTerminat || !jocActiv) return;
    const litera = e.key.toLowerCase();
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

        lose.textContent = 'Ai pierdut! Cuvantul era:';
        lose.classList.add('animate');

        sln.textContent = cuvant.toUpperCase();
        sln.classList.add('animate');

        jocTerminat = true;
    }

    if (cuvant.split('').every(l => litereGhicite.includes(l))) {
        const win = document.querySelector('#win-message');
        win.textContent = 'Felicitari! Ai castigat!';
        win.classList.add('animate');
    }
});
const historyBody = document.querySelector('#historyBody');
const scrollTop = document.querySelector('#scrollTop');
const message = document.querySelector('#homeMessage');
const total = document.querySelector('#total');
const filterBy = document.querySelector('#filterBy');

let emoji, toateJocurile = [];

function afiseazaJocuri(jocuri) {
    historyBody.innerHTML = '';

    jocuri.forEach(joc => {
        const rand = document.createElement('tr');
        const data = new Date(joc.date).toLocaleString('ro-RO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        if (joc.result === 'win') {
            emoji = '&#127881;';
        } else {
            emoji = '&#10060';
        }

        rand.innerHTML = `
            <td>${joc.word.toUpperCase()}</td>
            <td>${emoji}&nbsp;<b>${joc.result.toUpperCase()}</b>&nbsp;${emoji}</td>
            <td>${joc.mistakes}/10</td>
            <td>${data}</td>
        `;

        historyBody.appendChild(rand);
    });
}

async function incarcaIstoric() {
    const raspuns = await fetch('/api/games');
    const date = await raspuns.json();

    if (date.games.length === 0) {
        message.textContent = 'Play at least one game to start your history!';
        return;
    }

    toateJocurile = date.games;
    total.textContent = `Game total: ${date.games.length}`;
    filterBy.textContent = 'Filter by:';

    afiseazaJocuri(toateJocurile);
}

scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    const btn = document.querySelector('#scrollTop');
    if (window.scrollY > 200) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

function aplicaFiltre() {
    const dataAleasa = document.querySelector('#filterDate').value;
    const rezultatTip = document.querySelector('#filterResult').value;

    const filtrate = toateJocurile.filter(joc => {
        const trecRezultat = rezultatTip === 'any' || joc.result === rezultatTip;

        const ziuaJocului = joc.date.slice(0, 10);
        const trecData = dataAleasa === '' || ziuaJocului === dataAleasa;

        return trecRezultat && trecData;
    });

    afiseazaJocuri(filtrate);

    if (filtrate.length === 0) {
        total.textContent = '';
        return;
    }

    total.textContent = `Game total: ${filtrate.length}`;
}

document.querySelector('#filterDate').addEventListener('change', aplicaFiltre);
document.querySelector('#filterResult').addEventListener('change', aplicaFiltre);
incarcaIstoric();
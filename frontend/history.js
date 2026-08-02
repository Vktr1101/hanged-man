const historyList = document.querySelector('#historyList');
const scrollTop = document.querySelector('#scrollTop');

async function incarcaIstoric() {
    const raspuns = await fetch('/api/games');
    const date = await raspuns.json();

    if (!date.success) {
        historyList.textContent = date.error;
        return;
    }

    if (date.games.length === 0) {
        historyList.textContent = 'Nu ai jucat niciun joc pana acum!';
        return;
    }

    date.games.forEach(joc => {
        const div = document.createElement('div');
        div.textContent = `${joc.word.toUpperCase()} - ${joc.result} - ${joc.mistakes}/10 greseli`;
        historyList.appendChild(div);
    });
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

incarcaIstoric();
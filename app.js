const explanations = {
  email: {
    correct: 'legitimate',
    clues: ['La confirmation précise une activité et un horaire attendus.', 'Aucun paiement ni code secret n’est demandé.']
  },
  sms: {
    correct: 'fraud',
    clues: ['Le délai « avant ce soir » pousse à agir vite.', 'Le SMS demande un paiement par un lien douteux.']
  },
  account: {
    correct: 'legitimate',
    clues: ['Le message ne contient aucun lien : il conseille d’ouvrir soi-même l’application officielle.', 'Il ne demande ni mot de passe ni code.']
  },
  incident: {
    correct: 'fraud',
    clues: ['Un code reçu par SMS ne doit jamais être communiqué.', 'Le délai très court et l’appel imposé sont des signes de pression.']
  }
};

const cards = Array.from(document.querySelectorAll('[data-exercise]'));
const progress = document.getElementById('progress');
let currentIndex = 0;

document.addEventListener('click', (event) => {
  const answer = event.target.closest('[data-answer]');
  if (answer) {
    const card = answer.closest('[data-exercise]');
    const result = explanations[card.dataset.exercise];
    const correct = answer.dataset.answer === result.correct;
    const feedback = card.querySelector('.answer-feedback');

    card.querySelectorAll('[data-answer]').forEach((button) => {
      button.disabled = true;
      if (button === answer) button.classList.add('answer-selected');
    });

    feedback.className = `answer-feedback ${correct ? 'is-correct' : 'is-incorrect'}`;
    feedback.innerHTML = `
      <strong>${correct ? 'Bonne réponse !' : `Pas tout à fait. La bonne réponse est : ${result.correct === 'legitimate' ? 'légitime' : 'frauduleux'}.`}</strong>
      <ul>${result.clues.map((clue) => `<li>${clue}</li>`).join('')}</ul>
      ${currentIndex < cards.length - 1
        ? '<button class="retry-button" type="button" data-next>Exemple suivant →</button>'
        : '<p>Fin des exemples.</p><button class="retry-button" type="button" data-restart>Recommencer</button>'}
    `;
    feedback.hidden = false;
    return;
  }

  if (event.target.closest('[data-next]')) {
    cards[currentIndex].hidden = true;
    currentIndex += 1;
    cards[currentIndex].hidden = false;
    progress.textContent = `Exemple ${currentIndex + 1} sur ${cards.length}`;
    window.scrollTo({top: 0, behavior: 'smooth'});
    cards[currentIndex].querySelector('[data-answer]').focus();
    return;
  }

  if (event.target.closest('[data-restart]')) {
    cards.forEach((card, index) => {
      card.hidden = index !== 0;
      card.querySelectorAll('[data-answer]').forEach((button) => {
        button.disabled = false;
        button.classList.remove('answer-selected');
      });
      const feedback = card.querySelector('.answer-feedback');
      feedback.hidden = true;
      feedback.replaceChildren();
    });
    currentIndex = 0;
    progress.textContent = `Exemple 1 sur ${cards.length}`;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('Service worker non enregistré :', error));
  });
}

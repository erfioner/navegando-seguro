const explanations = {
  email: {
    correct: 'legitimate',
    clues: ['La confirmation précise une activité et un horaire attendus.', 'Aucun paiement ni code secret n’est demandé.', 'reception@atelierparis.fr correspond au nom de l’atelier affiché. C’est un indice, pas une preuve.']
  },
  sms: {
    correct: 'fraud',
    clues: ['Le délai et les frais demandés poussent à agir vite.', 'Le lien raccourci bit.do ne permet pas d’identifier le transporteur.']
  },
  account: {
    correct: 'fraud',
    clues: ['Une banque ne doit pas vous demander de transmettre un code reçu par SMS.', 'Le domaine boursorama.fr est associé à la banque, mais une adresse peut être usurpée.']
  },
  incident: {
    correct: 'legitimate',
    clues: ['Le message fait suite à une demande que vous avez réellement faite.', 'Il n’y a ni lien à cliquer ni demande de code ou de mot de passe.']
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

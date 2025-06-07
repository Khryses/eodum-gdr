const defaultDocumentation = {
  caratteristiche: `\n### Caratteristiche\nDefiniscono le doti innate del personaggio.`,
  abilita: `\n### Abilit\u00e0\nRappresentano l'esperienza e l'addestramento.`,
  creazione: `\n### Creazione del Personaggio\nDistribuisci 9 punti tra le caratteristiche di base, con un massimo di 3 per caratteristica.`,
  regole: `\n### Regole Generali\nUtilizza un dado a 10 facce. Ogni risultato di 7 o pi\u00f9 è un successo.`
};

export function loadDocumentation() {
  const stored = localStorage.getItem('documentationData');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Errore parsing documentazione:', e);
    }
  }
  return { ...defaultDocumentation };
}

export function saveDocumentation(data) {
  localStorage.setItem('documentationData', JSON.stringify(data));
}

export default defaultDocumentation;

import { createContext, useContext, useState } from 'react';

const DocumentationContext = createContext();

export const DocumentationProvider = ({ children }) => {
  const [docs, setDocs] = useState({
    caratteristiche: 'Descrizione delle caratteristiche del personaggio.',
    abilita: 'Elenco delle abilità disponibili.',
    creazione: 'Linee guida per la creazione del personaggio.'
  });

  const updateSection = (section, content) => {
    setDocs(prev => ({ ...prev, [section]: content }));
  };

  return (
    <DocumentationContext.Provider value={{ docs, updateSection }}>
      {children}
    </DocumentationContext.Provider>
  );
};

export const useDocumentation = () => useContext(DocumentationContext);

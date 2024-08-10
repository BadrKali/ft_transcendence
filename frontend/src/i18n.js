import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


const resources = {
  en: {
    translation: {
      "Welcome back": "Welcome back",
      "Add Friend": "Add Friend",
      "Dashboard": "Dashboard",
      "Game": "Game",
      "Chat": "Chat",
      "Tournament": "Tournament",
      "Leaderboard": "Leaderboard",
      "Setting": "Setting",
      "Rank": "Rank",
      "User XP": "User XP",
      "Total Games": "Total Games",
      "Win": "Win",
      "Loss": "Loss"
    }
  },
  fr: {
    translation: {
      "Welcome back": "Re-bienvenue",
      "Add Friend": "Ajouter un ami",
      "Dashboard": "Tableau de Bord",
      "Game": "Jeu",
      "Chat": "Chat",
      "Tournament": "Tournoi",
      "Leaderboard": "Classement",
      "Setting": "Paramètres",
      "Rank": "Rang",
      "User XP": "XP Utilisateur",
      "Total Games": "Jeux Totals",
      "Win": "Victoires",
      "Loss": "Défaites"
    }
  },
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: 'en', 
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;

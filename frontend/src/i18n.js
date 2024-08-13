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
      "Loss": "Loss",
      "GOLD": "GOLD",
      "SILVER": "SILVER",
      "BRONZE": "BRONZE",
      "Match History": "Match History",
      "No match history available.": "No match history available."
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
      "Loss": "Défaites",
      "GOLD": "OR",
      "SILVER": "ARGENT",
      "BRONZE": "BRONZE",
      "Match History": "Historique des matchs",
      "No match history available.": "Aucun historique de match disponible.",
    
    }
  },
  ar: {
    translation: {
      "Welcome back": "مرحباً بعودتك",
      "Add Friend": "إضافة صديق",
      "Dashboard": "لوحة القيادة",
      "Game": "لعبة",
      "Chat": "دردشة",
      "Tournament": "بطولة",
      "Leaderboard": "قائمة المتصدرين",
      "Setting": "الإعدادات",
      "Rank": "الرتبة",
      "User XP": "نقاط الخبرة",
      "Total Games": "إجمالي الألعاب",
      "Win": "فوز",
      "Loss": "خسارة",
      "GOLD": "ذهب",
      "SILVER": "فضة",
      "BRONZE": "برونز",

    }
  },
};


const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: savedLanguage, 
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;

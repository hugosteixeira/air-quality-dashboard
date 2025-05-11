import en from './en.json';
import pt from './pt.json';

const resources: Record<string, Record<string, string>> = { en, pt };

export const getTranslation = (key: string, fallbackLanguage: string = 'en'): string => {
    const language = typeof window !== 'undefined'
        ? navigator.language.startsWith('pt') ? 'pt' : 'en'
        : fallbackLanguage; // Use fallback language during SSR
    return resources[language]?.[key] ?? key;
};

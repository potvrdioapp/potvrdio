/**
 * Unified Registration & Onboarding Form Schema
 * Single source of truth for all registration inputs across:
 * - landing-web (OnboardingModal.tsx)
 * - merchant-dashboard (LoginView.tsx)
 */

export type SupportedLanguage = 'sr' | 'mk' | 'en';

export interface RegistrationFieldLabels {
  storeUrlLabel: string;
  storeUrlPlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
}

export const REGISTRATION_FIELDS: Record<SupportedLanguage, RegistrationFieldLabels> = {
  sr: {
    storeUrlLabel: 'Web prodavnica (WooCommerce)',
    storeUrlPlaceholder: 'mojaprodavnica.rs',
    nameLabel: 'Ime i prezime / Naziv firme',
    namePlaceholder: 'Petar Petrović',
    emailLabel: 'Poslovna e-pošta',
    emailPlaceholder: 'petar@mojaradnja.rs',
    phoneLabel: 'Broj telefona / Viber',
    phonePlaceholder: '+381 64 123 4567',
  },
  mk: {
    storeUrlLabel: 'Веб продавница (WooCommerce)',
    storeUrlPlaceholder: 'mojaprodavnica.mk',
    nameLabel: 'Име и презиме / Фирма',
    namePlaceholder: 'Петар Петровски',
    emailLabel: 'Деловна е-пошта',
    emailPlaceholder: 'petar@mojaradnja.mk',
    phoneLabel: 'Телефонски број / Viber',
    phonePlaceholder: '+389 70 123 456',
  },
  en: {
    storeUrlLabel: 'Store Domain / URL (WooCommerce)',
    storeUrlPlaceholder: 'mystore.com',
    nameLabel: 'Contact Name / Company',
    namePlaceholder: 'Peter Smith',
    emailLabel: 'Business Email',
    emailPlaceholder: 'owner@mystore.com',
    phoneLabel: 'Phone Number / Viber',
    phonePlaceholder: '+381 64 123 4567',
  },
};

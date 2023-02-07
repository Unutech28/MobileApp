import LocalizedStrings from 'react-native-localization';
import { en } from '@/localization/en';
import { es } from '@/localization/es';
import { de } from '@/localization/de';
import { hi } from '@/localization/hi';
export const strings = new LocalizedStrings({ en, es, de, hi });
strings.setLanguage('en');

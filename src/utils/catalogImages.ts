import catBrassThali from '../assets/images/cat_brass_thali_1790590678582.jpg';
import catTempleBell from '../assets/images/cat_temple_bell_1790590695607.jpg';
import catSamaiLamp from '../assets/images/cat_samai_lamp_1790590716978.jpg';
import catPanchAarti from '../assets/images/cat_panch_aarti_1790590733666.jpg';
import catKamakshiDeep from '../assets/images/cat_kamakshi_deep_1790590749863.jpg';
import catKansaThali from '../assets/images/cat_kansa_thali_1790590769681.jpg';
import catHavanKund from '../assets/images/cat_havan_kund_1790590787496.jpg';
import catBrassUrli from '../assets/images/cat_brass_urli_1790590803674.jpg';
import catDivineIdols from '../assets/images/cat_divine_idols_1790590824536.jpg';
import catSacredTrishul from '../assets/images/cat_sacred_trishul_1790590839466.jpg';
import catCopperKalash from '../assets/images/category_copper_kalasha_1790402543268.jpg';
import productBrassDiya from '../assets/images/product_brass_diya_1790401709970.jpg';
import productDhoop from '../assets/images/product_incense_dhoop_1790401736882.jpg';
import divineDeityLogo from '../assets/images/divine_deity_logo_1790403832742.jpg';
import { RMSCatalogItem } from '../types';

export const CATALOG_CATEGORY_IMAGES = {
  plates: catBrassThali,
  bells: catTempleBell,
  samai: catSamaiLamp,
  aarti: catPanchAarti,
  deepams: catKamakshiDeep,
  kalash_utensils: catCopperKalash,
  kund_patra: catHavanKund,
  idols: catDivineIdols,
  kansa: catKansaThali,
  bajot_jhula: catBrassUrli,
  trishul_symbols: catSacredTrishul,
  all: catBrassThali
};

export function getCatalogItemImage(item: RMSCatalogItem): string {
  if (item.image) return item.image;

  // Specific keyword matching for ultra-accurate visuals
  const name = (item.nameEn + ' ' + item.code).toLowerCase();

  if (name.includes('kansa') || name.includes('bronze')) {
    return catKansaThali;
  }
  if (name.includes('bell') || name.includes('ghanti') || name.includes('taal') || name.includes('gong')) {
    return catTempleBell;
  }
  if (name.includes('samai') || name.includes('vilakku') || name.includes('kuthu') || name.includes('standing lamp')) {
    return catSamaiLamp;
  }
  if (name.includes('loban') || name.includes('dhoop') || name.includes('incense') || name.includes('sambrani')) {
    return productDhoop;
  }
  if (name.includes('aarti') || name.includes('kapoor') || name.includes('pancharati') || name.includes('step aarti')) {
    return catPanchAarti;
  }
  if (name.includes('kamakshi') || name.includes('kuber') || name.includes('akhand') || name.includes('niranjan') || name.includes('deep')) {
    return catKamakshiDeep;
  }
  if (name.includes('havan') || name.includes('kund') || name.includes('jaldari') || name.includes('patra')) {
    return catHavanKund;
  }
  if (name.includes('urli') || name.includes('planter') || name.includes('basket') || name.includes('bajot') || name.includes('jhula') || name.includes('singhasan')) {
    return catBrassUrli;
  }
  if (name.includes('kalash') || name.includes('lota') || name.includes('kindi') || name.includes('gangajali') || name.includes('handa') || name.includes('copper')) {
    return catCopperKalash;
  }
  if (name.includes('idol') || name.includes('murthi') || name.includes('ganesh') || name.includes('laxmi') || name.includes('krishna') || name.includes('balaji') || name.includes('basavanna') || name.includes('hanuman') || name.includes('shiva') || name.includes('silver') || name.includes('gold')) {
    return catDivineIdols;
  }
  if (name.includes('trishul') || name.includes('vel') || name.includes('shastra') || name.includes('gada') || name.includes('talvar') || name.includes('arrow') || name.includes('yantra')) {
    return catSacredTrishul;
  }

  // Fallback to category default image
  return CATALOG_CATEGORY_IMAGES[item.category] || catBrassThali;
}

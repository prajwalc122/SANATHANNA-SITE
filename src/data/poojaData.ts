import { MaterialCategory, MaterialItem, PoojaService } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_sacred_altar_1790401695456.jpg';
export const POOJA_MATERIALS_BANNER = '/src/assets/images/pooja_materials_kit_1790748675502.jpg';
export const RANGANATHA_TEMPLE_BG = '/src/assets/images/ranganatha_temple_bg_1790403908355.jpg';
export const SOUTH_INDIAN_CULTURE_BG = RANGANATHA_TEMPLE_BG;
export const INDIAN_CULTURE_BG = RANGANATHA_TEMPLE_BG;
export const DEITY_LOGO = '/src/assets/images/final_divine_deity_logo.svg';

export const CATEGORY_IMAGES: Record<MaterialCategory, string> = {
  all: '/src/assets/images/pooja_materials_kit_1790748675502.jpg',
  mangala: '/src/assets/images/product_thali_kit_1790401723652.jpg',
  herbs: '/src/assets/images/product_incense_dhoop_1790401736882.jpg',
  samithu: '/src/assets/images/category_copper_kalasha_1790402543268.jpg',
  panchagavya: '/src/assets/images/product_brass_diya_1790401709970.jpg',
  navadhanya: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg',
  dryfruits: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg',
  fruits: '/src/assets/images/category_copper_kalasha_1790402543268.jpg',
  flowers: '/src/assets/images/category_divine_flowers_1790402514635.jpg',
  others: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
};

export const CATEGORY_INFO: Record<MaterialCategory, { kn: string; en: string; icon: string; image: string }> = {
  all: { kn: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು', en: 'All Categories', icon: '✨', image: '/src/assets/images/pooja_materials_kit_1790748675502.jpg' },
  mangala: { kn: 'ಮಂಗಳ ದ್ರವ್ಯಗಳು', en: 'Mangala Items', icon: '🪔', image: '/src/assets/images/product_thali_kit_1790401723652.jpg' },
  herbs: { kn: 'ಗಿಡಮೂಲಿಕೆಗಳು & ಬೇರುಗಳು', en: 'Herbs & Roots', icon: '🌿', image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg' },
  samithu: { kn: 'ಸಮಿತ್ತುಗಳು', en: 'Samithu Woods', icon: '🪵', image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg' },
  panchagavya: { kn: 'ಪಂಚಗವ್ಯ & ಅಭಿಷೇಕ', en: 'Panchagavya & Liquids', icon: '🥛', image: '/src/assets/images/product_brass_diya_1790401709970.jpg' },
  navadhanya: { kn: 'ನವಧಾನ್ಯಗಳು', en: 'Navadhanya Grains', icon: '🌾', image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg' },
  dryfruits: { kn: 'ಒಣ ಫಲಗಳು & ನೈವೇದ್ಯ', en: 'Dry Fruits', icon: '🥭', image: '/src/assets/images/dry_coconut_kobbari_1790403403401.jpg' },
  fruits: { kn: 'ಹಣ್ಣುಗಳು & ಎಲೆಗಳು', en: 'Fruits & Veg', icon: '🍌', image: '/src/assets/images/puja_tambula_leaves_1790403387392.jpg' },
  flowers: { kn: 'ದೈವಿಕ ಪುಷ್ಪಗಳು', en: 'Divine Flowers', icon: '🌸', image: '/src/assets/images/category_divine_flowers_1790402514635.jpg' },
  others: { kn: 'ಧಾತು & ಇತರೆ ಪರಿಕರಗಳು', en: 'Other Tools', icon: '🔔', image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg' }
};

export const POOJA_SERVICES: PoojaService[] = [
  {
    id: 'srv-ganesha',
    nameKn: 'ಗಣೇಶ ಪೂಜೆ',
    nameEn: 'Ganesha Pooja',
    descKn: 'ಶುಭ ಕಾರ್ಯಗಳ ಆರಂಭಕ್ಕಾಗಿ, ವಿಘ್ನ ನಿವಾರಣೆಗಾಗಿ ವಿಶೇಷ ಗಣೇಶ ಪೂಜೆ ಮತ್ತು ಸಂಕಲ್ಪ.',
    descEn: 'Special Ganesha pooja for a prosperous, obstacle-free beginning of any auspicious work.',
    price: 2100,
    includedMaterials: ['ಮಂಗಳ ದ್ರವ್ಯ ಕಿಟ್', 'ಮೋದಕ ನೈವೇದ್ಯ ಸಾಮಗ್ರಿ', 'ದೂರ್ವ ಹುಲ್ಲು', 'ಪಂಚಾಮೃತ'],
    iconType: 'ganesha',
    image: '/src/assets/images/service_ganesha_pooja_1790406697035.jpg'
  },
  {
    id: 'srv-lakshmi',
    nameKn: 'ಲಕ್ಷ್ಮೀ ಪೂಜೆ',
    nameEn: 'Lakshmi Pooja',
    descKn: 'ಮನೆ ಮತ್ತು ವ್ಯಾಪಾರದಲ್ಲಿ ಶುಭ, ಸಿರಿದನ ಹಾಗೂ ಅಷ್ಟೈಶ್ವರ್ಯ ಸಮೃದ್ಧಿಗಾಗಿ ವಿಶೇಷ ಪೂಜೆ.',
    descEn: 'For auspiciousness, wealth, and abundant prosperity in home, commerce, and business.',
    price: 3500,
    includedMaterials: ['ಕಮಲ ಪುಷ್ಪಗಳು', 'ಅಷ್ಟಲಕ್ಷ್ಮೀ ದ್ರವ್ಯ', 'ಕುಂಕುಮಾರ್ಚನೆ ಸಾಮಗ್ರಿ', 'ತಾಮ್ರದ ನಾಣ್ಯ'],
    iconType: 'lakshmi',
    image: '/src/assets/images/service_lakshmi_pooja_1790406714669.jpg'
  },
  {
    id: 'srv-shiva',
    nameKn: 'ಶಿವ ಪೂಜೆ & ರುದ್ರಾಭಿಷೇಕ',
    nameEn: 'Shiva Pooja & Rudrabhisheka',
    descKn: 'ಶಿವನಿಗೆ ವಿಶೇಷ ಪಂಚಾಮೃತ ಮಹಾಭಿಷೇಕ, ಬಿಲ್ವಾರ್ಚನೆ ಮತ್ತು ಶಾಂತಿ ಪ್ರಾರ್ಥನಾ ಸೇವೆ.',
    descEn: 'Special pooja and sacred panchamruta abhisheka for Lord Shiva with Bilva leaves and peace prayers.',
    price: 2800,
    includedMaterials: ['ಶುದ್ಧ ಬಿಲ್ವಪತ್ರೆ', 'ಪಂಚಾಮೃತ ದ್ರವ್ಯ', 'ಭಸ್ಮ & ಚಂದನ', 'ಗಂಗಾಜಲ'],
    iconType: 'shiva',
    image: '/src/assets/images/service_shiva_pooja_1790406731323.jpg'
  },
  {
    id: 'srv-gruhapravesha',
    nameKn: 'ಗೃಹಪ್ರವೇಶ ಮಹಾಪೂಜೆ',
    nameEn: 'Gruhapravesha Ceremony',
    descKn: 'ಹೊಸ ಮನೆಯ ಶುಭಾರಂಭಕ್ಕಾಗಿ ಗೋಪೂಜೆ, ವಾಸ್ತು ಶಾಂತಿ, ನವಗ್ರಹ ಹೋಮ ಮತ್ತು ಗೃಹಪ್ರವೇಶ ವಿಧಿ.',
    descEn: 'Auspicious complete pooja, Go-puja, Vastu Shanti, and Navagraha Homa for your new home ceremony.',
    price: 5500,
    includedMaterials: ['ಸಂಪೂರ್ಣ ವಾಸ್ತು ಕಿಟ್', 'ನವಗ್ರಹ ಸಮಿತ್ತು', 'ಕಳಸ ಸ್ಥಾಪನೆ ದ್ರವ್ಯ', 'ಹೋಮ ಸಾಮಗ್ರಿ'],
    iconType: 'home',
    image: '/src/assets/images/service_gruhapravesha_1790406747393.jpg'
  },
  {
    id: 'srv-satyanarayana',
    nameKn: 'ಸತ್ಯನಾರಾಯಣ ವ್ರತ ಪೂಜೆ',
    nameEn: 'Satyanarayana Vrata Pooja',
    descKn: 'ಕುಟುಂಬದ ಆಯುರಾರೋಗ್ಯ, ಶಾಂತಿ ಮತ್ತು ಶುಭ ಫಲಗಳಿಗಾಗಿ ಶಾಸ್ತ್ರೋಕ್ತ ಸತ್ಯನಾರಾಯಣ ಕಥಾ ಪೂಜೆ.',
    descEn: 'Traditional Satyanarayana Vrata with five chapter sacred katha for family health and prosperity.',
    price: 3200,
    includedMaterials: ['ಸಪಾದ ಭಕ್ಷ್ಯ ಸಾಮಗ್ರಿ', 'ತುಳಸಿ ಮಾಲೆ', 'ಕಳಸ ವಸ್ತ್ರ', 'ಪಂಚಾಮೃತ'],
    iconType: 'narayana',
    image: '/src/assets/images/service_satyanarayana_1790406768280.jpg'
  },
  {
    id: 'srv-navagraha',
    nameKn: 'ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮ',
    nameEn: 'Navagraha Shanti Homa',
    descKn: 'ಗ್ರಹ ದೋಷಗಳ ಪರಿಹಾರಕ್ಕೆ ಮತ್ತು ಸಕಲ ಕಾರ್ಯಗಳಲ್ಲಿ ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿ ಹಾಗೂ ವಿಜಯಕ್ಕಾಗಿ ಹೋಮ.',
    descEn: 'Sacred homa ritual to pacify planetary afflictions and invoke cosmic positive energies.',
    price: 4500,
    includedMaterials: ['9 ಗ್ರಹ ಧಾನ್ಯಗಳು', '9 ಗ್ರಹ ಸಮಿತ್ತು ಕಟ್ಟುಗಳು', 'ಹವಿಷ್ಯ ದ್ರವ್ಯ', 'ತುಪ್ಪ'],
    iconType: 'homa',
    image: '/src/assets/images/service_navagraha_1790406784680.jpg'
  },
  {
    id: 'srv-ganapathi-homa',
    nameKn: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ',
    nameEn: 'Maha Ganapathi Homa',
    descKn: 'ಸಕಲ ವಿಘ್ನ ನಿವಾರಣೆ, ನೂತನ ಕಾರ್ಯಸಿದ್ಧಿ ಮತ್ತು ಶಾಸ್ತ್ರೋಕ್ತ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಪವಿತ್ರ ಗಣಪತಿ ಹವನ.',
    descEn: 'Sacred Maha Ganapathi fire ritual for obstacle removal, new beginnings, and prosperity.',
    price: 3500,
    includedMaterials: ['ಮೋದಕ ಹವಿಸ್ಸು', 'ಅಷ್ಟದ್ರವ್ಯ ಕಿಟ್', 'ದೂರ್ವ ಸಮಿತ್ತು', 'ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ'],
    iconType: 'homa',
    image: '/src/assets/images/sacred_homa_fire.svg'
  },
  {
    id: 'srv-rudra-homa',
    nameKn: 'ಮಹಾರುದ್ರ ಹೋಮ & ಲಘು ರುದ್ರ',
    nameEn: 'Maha Rudra Homa & Laghu Rudra',
    descKn: 'ಆಯುರಾರೋಗ್ಯ ವೃದ್ಧಿ, ಶಿವಾನುಗ್ರಹ ಮತ್ತು ಶಾಂತಿ ಪ್ರಾರ್ಥನೆಗಾಗಿ ಏಕಾದಶ ರುದ್ರ ಪಾರಾಯಣ ಸಹಿತ ಹೋಮ.',
    descEn: 'Vedic Rudra chanting and powerful fire sacrifice invoking Lord Shiva for health and protection.',
    price: 6500,
    includedMaterials: ['ಬಿಲ್ವ ಸಮಿತ್ತು', 'ಕಮಲ ಪುಷ್ಪಗಳು', 'ರುದ್ರಾಭಿಷೇಕ ದ್ರವ್ಯ', 'ಹವಿಷ್ಯ ನೈವೇದ್ಯ'],
    iconType: 'homa',
    image: '/src/assets/images/sacred_homa_fire.svg'
  },
  {
    id: 'srv-chandi-homa',
    nameKn: 'ಚಂಡಿಕಾ ಹೋಮ & ದುರ್ಗಾ ಶಾಂತಿ',
    nameEn: 'Chandi Homa & Durga Shanti',
    descKn: 'ಸರ್ವ ಸಂಕಷ್ಟ ನಿವಾರಣೆ, ಶತ್ರು ಬಾಧಾ ಮುಕ್ತಿ ಹಾಗೂ ನವದುರ್ಗೆಯರ ಕೃಪಾಕಟಾಕ್ಷಕ್ಕಾಗಿ ಮಹಾ ಚಂಡಿಕಾ ಹವನ.',
    descEn: 'Grand sacred Chandi Homa dedicated to Divine Mother Durga for spiritual strength and peace.',
    price: 8500,
    includedMaterials: ['ಕುಂಕುಮ & ಪಟ್ಟು ವಸ್ತ್ರ', 'ಪಾಯಸ ಹವಿಸ್ಸು', 'ಸಂಪೂರ್ಣ ಪೂರ್ಣಾಹುತಿ ಕಿಟ್', 'ವಿಶೇಷ ಸಮಿತ್ತು'],
    iconType: 'homa',
    image: '/src/assets/images/sacred_homa_fire.svg'
  },
  {
    id: 'srv-sudarshana-homa',
    nameKn: 'ಶ್ರೀ ಸುದರ್ಶನ & ಆಯುಷ್ಯ ಹೋಮ',
    nameEn: 'Sudarshana & Ayushya Homa',
    descKn: 'ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳ ನಿವಾರಣೆ, ದೀರ್ಘಾಯುಷ್ಯ, ದೃಷ್ಟಿ ದೋಷ ಶಮನ ಮತ್ತು ಧೈರ್ಯಕ್ಕಾಗಿ ಸುದರ್ಶನ ಹವನ.',
    descEn: 'Auspicious fire ritual invoking Lord Sudarshana for longevity, vitality, and removing negative energies.',
    price: 4800,
    includedMaterials: ['ಸುದರ್ಶನ ಸಮಿತ್ತು', 'ತುಳಸಿ ಮಾಲೆ & ದಳ', 'ಹವನ ದ್ರವ್ಯ', 'ಪೂರ್ಣಾಹುತಿ ತೆಂಗಿನಕಾಯಿ'],
    iconType: 'homa',
    image: '/src/assets/images/sacred_homa_fire.svg'
  }
];

export const POOJA_MATERIALS: MaterialItem[] = [
  // 1. ಮಂಗಳ ದ್ರವ್ಯಗಳು / Mangala Items
  {
    id: 'm1',
    nameKn: 'ಅರಿಶಿನ',
    nameEn: 'Pure Turmeric (Haldi)',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 45,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: true,
    descriptionKn: 'ಶುದ್ಧ ನೈಸರ್ಗಿಕ ಅರಿಶಿನ ಪುಡಿ, ದೇವತಾ ಮಂಗಳ ಪೂಜೆಗೆ ಪ್ರಶಸ್ತ.',
    descriptionEn: 'Pure natural aromatic turmeric powder for auspicious rituals.',
    image: '/src/assets/images/product_thali_kit_1790401723652.jpg'
  },
  {
    id: 'm2',
    nameKn: 'ಕುಂಕುಮ',
    nameEn: 'Sacred Temple Kumkum',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 45,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: true,
    descriptionKn: 'ಸಾಂಪ್ರದಾಯಿಕ ದೇವಿ ಕುಂಕುಮ, ಶುಭ ಸಂಕಲ್ಪಕ್ಕೆ ಅನಿವಾರ್ಯ.',
    descriptionEn: 'Traditional temple red kumkuma made from turmeric and lime.',
    image: '/src/assets/images/product_thali_kit_1790401723652.jpg'
  },
  {
    id: 'm3',
    nameKn: 'ವಿಭೂತಿ (ಭಸ್ಮ)',
    nameEn: 'Sacred Vibhuti (Bhasma)',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 50,
    unitKn: '1 ಪ್ಯಾಕೆಟ್',
    unitEn: '1 pack',
    essential: false,
    descriptionKn: 'ದೇಸಿ ಗೋಮಯದಿಂದ ತಯಾರಿಸಿದ ಸಾತ್ವಿಕ ಭಸ್ಮ.',
    descriptionEn: 'Pure desi cow dung bhasma for Shiva pooja and tilak.',
    image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg'
  },
  {
    id: 'm4',
    nameKn: 'ಶ್ರೀಗಂಧ ಪುಡಿ',
    nameEn: 'Mysore Sandalwood Powder',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 120,
    unitKn: '50 ಗ್ರಾಂ',
    unitEn: '50g',
    essential: false,
    descriptionKn: 'ಸುಗಂಧಭರಿತ ಶುದ್ಧ ಮೈಸೂರು ಗಂಧ.',
    descriptionEn: 'Pure authentic Mysore sandalwood paste powder.',
    image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg'
  },
  {
    id: 'm5',
    nameKn: 'ಅಕ್ಷತೆ (ಮಂತ್ರಿತ ಅಕ್ಷತೆ)',
    nameEn: 'Sacred Akshata',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 35,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: true,
    descriptionKn: 'ತುಪ್ಪ ಮತ್ತು ಅರಿಶಿನದಿಂದ ಸಂಸ್ಕಾರಗೊಂಡ ಅಖಂಡ ಅಕ್ಕಿ ಕಾಳುಗಳು.',
    descriptionEn: 'Whole unbroken sacred rice energized with ghee and turmeric.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm6',
    nameKn: 'ಬಿಳಿ ಎಳ್ಳು',
    nameEn: 'White Sesame Seeds',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 40,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: false,
    descriptionKn: 'ದೇವಕಾರ್ಯ ಮತ್ತು ತರ್ಪಣಕ್ಕೆ ಬಳಸುವ ಶುದ್ಧ ಬಿಳಿ ಎಳ್ಳು.',
    descriptionEn: 'Clean white sesame seeds for devata pooja and homa.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm7',
    nameKn: 'ಹರಳೆಣ್ಣೆ (ದೀಪಕ್ಕೆ)',
    nameEn: 'Pure Castor Oil',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 90,
    unitKn: '250 ಮಿಲಿ',
    unitEn: '250ml',
    essential: false,
    descriptionKn: 'ಅಖಂಡ ದೀಪಾರಾಧನೆಗೆ ದೀರ್ಘಕಾಲ ಶಾಂತವಾಗಿ ಉರಿಯುವ ತೈಲ.',
    descriptionEn: 'Cold pressed castor oil for long steady deeparadhana.',
    image: '/src/assets/images/product_brass_diya_1790401709970.jpg'
  },
  {
    id: 'm8',
    nameKn: 'ಶುದ್ಧ ಆಕಳ ತುಪ್ಪ',
    nameEn: 'Pure Desi Cow Ghee',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 180,
    unitKn: '200 ಮಿಲಿ',
    unitEn: '200ml',
    essential: true,
    descriptionKn: 'ದೀಪ ಮತ್ತು ಹೋಮಕ್ಕೆ ಯೋಗ್ಯವಾದ ಶುದ್ಧ ಗೋಘೃತ.',
    descriptionEn: 'Traditional Bilona desi cow ghee for deepa and sacred ahuti.',
    image: '/src/assets/images/product_brass_diya_1790401709970.jpg'
  },
  {
    id: 'm9',
    nameKn: 'ಭೀಮಸೇನಿ ಕರ್ಪೂರ',
    nameEn: 'Pure Bhimseni Camphor',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 85,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: true,
    descriptionKn: 'ಹೊಗೆ ರಹಿತ ಶುದ್ಧ ನೈಸರ್ಗಿಕ ಹರಳು ಕರ್ಪೂರ.',
    descriptionEn: '100% natural edible-grade crystalline camphor without soot.',
    image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg'
  },
  {
    id: 'm10',
    nameKn: 'ಊದಿನಕಡ್ಡಿ (ಸುಗಂಧಿ ಅಗರಬತ್ತಿ)',
    nameEn: 'Hand-Rolled Incense Sticks',
    category: 'mangala',
    categoryLabelKn: 'ಮುಖ್ಯ ಮಂಗಳ ದ್ರವ್ಯ',
    categoryLabelEn: 'Main Mangala Items',
    price: 60,
    unitKn: '1 ಬಾಕ್ಸ್ (30 ಕಡ್ಡಿ)',
    unitEn: '1 box (30 sticks)',
    essential: true,
    descriptionKn: 'ಇದ್ದಿಲು ರಹಿತ ಶುದ್ಧ ಚಂದನ ಮತ್ತು ಗಿಡಮೂಲಿಕೆ ಧೂಪ.',
    descriptionEn: 'Natural charcoal-free flora incense with therapeutic fragrance.',
    image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg'
  },

  // 2. ಗಿಡಮೂಲಿಕೆಗಳು / Herbs & Roots
  {
    id: 'm11',
    nameKn: 'ದರ್ಬೆ ಹುಲ್ಲು (ಕುಶ)',
    nameEn: 'Sacred Darbha Grass (Kusha)',
    category: 'herbs',
    categoryLabelKn: 'ಹೋಮ & ಗಿಡಮೂಲಿಕೆ',
    categoryLabelEn: 'Herbs & Roots',
    price: 25,
    unitKn: '1 ಕಟ್ಟು',
    unitEn: '1 bunch',
    essential: true,
    descriptionKn: 'ಪವಿತ್ರ ಉಂಗುರ ಮತ್ತು ಆಸನ ಶುದ್ಧೀಕರಣಕ್ಕಾಗಿ ದರ್ಬೆ.',
    descriptionEn: 'Holy kusha grass for pavitra rings, asana purification.',
    image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg'
  },
  {
    id: 'm12',
    nameKn: 'ತುಳಸಿ ಎಲೆ & ಮಂಜರಿ',
    nameEn: 'Fresh Sacred Tulasi Leaves',
    category: 'herbs',
    categoryLabelKn: 'ಹೋಮ & ಗಿಡಮೂಲಿಕೆ',
    categoryLabelEn: 'Herbs & Roots',
    price: 30,
    unitKn: '1 ಕಟ್ಟು',
    unitEn: '1 bunch',
    essential: true,
    descriptionKn: 'ವಿಷ್ಣು ಮತ್ತು ಕೃಷ್ಣ ಪೂಜೆಗೆ ಪರಮ ಪ್ರಿಯವಾದ ತಾಜಾ ತುಳಸಿ.',
    descriptionEn: 'Fresh aromatic Tulasi leaves and seeds sacred to Lord Vishnu.',
    image: '/src/assets/images/category_divine_flowers_1790402514635.jpg'
  },
  {
    id: 'm13',
    nameKn: 'ಹಸಿರು ಮಾವಿನ ಎಲೆಗಳು',
    nameEn: 'Fresh Mango Leaves (Torana)',
    category: 'herbs',
    categoryLabelKn: 'ಹೋಮ & ಗಿಡಮೂಲಿಕೆ',
    categoryLabelEn: 'Herbs & Roots',
    price: 25,
    unitKn: '1 ಕಟ್ಟು (11 ಎಲೆ)',
    unitEn: '1 bunch (11 leaves)',
    essential: true,
    descriptionKn: 'ಕಳಸ ಸ್ಥಾಪನೆ ಮತ್ತು ಮನೆಯ ಮುಖ್ಯದ್ವಾರದ ತೋರಣಕ್ಕೆ.',
    descriptionEn: 'Fresh mango leaves for Kalasha sthapana and doorway torana.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },
  {
    id: 'm14',
    nameKn: 'ಔದುಂಬರ ಕಡ್ಡಿ (ಅತ್ತಿ)',
    nameEn: 'Audumbara Wood Sticks',
    category: 'herbs',
    categoryLabelKn: 'ಹೋಮ & ಗಿಡಮೂಲಿಕೆ',
    categoryLabelEn: 'Herbs & Roots',
    price: 45,
    unitKn: '1 ಕಟ್ಟು',
    unitEn: '1 bunch',
    essential: false,
    descriptionKn: 'ದತ್ತಾತ್ರೇಯ ಹಾಗೂ ಸೂರ್ಯ ಹೋಮಗಳಿಗೆ ಪ್ರಶಸ್ತವಾದ ಕಡ್ಡಿ.',
    descriptionEn: 'Sacred fig wood sticks for Guru Dattatreya rituals.',
    image: '/src/assets/images/product_incense_dhoop_1790401736882.jpg'
  },
  {
    id: 'm15',
    nameKn: 'ಶುದ್ಧ ಲವಂಗ',
    nameEn: 'Whole Aromatic Cloves',
    category: 'herbs',
    categoryLabelKn: 'ಹೋಮ & ಗಿಡಮೂಲಿಕೆ',
    categoryLabelEn: 'Herbs & Roots',
    price: 50,
    unitKn: '50 ಗ್ರಾಂ',
    unitEn: '50g',
    essential: false,
    descriptionKn: 'ತಾಂಬೂಲ ಮತ್ತು ಹೋಮ ದ್ರವ್ಯಕ್ಕೆ ಉತ್ತಮ ಲವಂಗ.',
    descriptionEn: 'Premium whole cloves for tambula and havan.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm16',
    nameKn: 'ಹಸಿರು ಏಲಕ್ಕಿ',
    nameEn: 'Green Cardamom (Elaichi)',
    category: 'herbs',
    categoryLabelKn: 'ಹೋಮ & ಗಿಡಮೂಲಿಕೆ',
    categoryLabelEn: 'Herbs & Roots',
    price: 85,
    unitKn: '25 ಗ್ರಾಂ',
    unitEn: '25g',
    essential: false,
    descriptionKn: 'ತೀರ್ಥ ಪ್ರಸಾದ ಮತ್ತು ತಾಂಬೂಲಕ್ಕೆ ಸುಗಂಧಿ ಏಲಕ್ಕಿ.',
    descriptionEn: 'Fragrant green cardamom pods for teertha and offerings.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },

  // 3. ಸಮಿತ್ತುಗಳು / Samithu Woods
  {
    id: 'm17',
    nameKn: 'ಮಾವಿನ ಸಮಿತ್ತು',
    nameEn: 'Mango Samithu Wood Sticks',
    category: 'samithu',
    categoryLabelKn: 'ಸಮಿತ್ತುಗಳು',
    categoryLabelEn: 'Samithu Woods',
    price: 60,
    unitKn: '1 ಕಟ್ಟು (108 ಕಡ್ಡಿ)',
    unitEn: '1 bunch (108 pcs)',
    essential: true,
    descriptionKn: 'ಹೋಮಕುಂಡದ ಅಗ್ನಿ ಜನನಕ್ಕೆ ಒಣಗಿದ ಶುದ್ಧ ಮಾವಿನ ಸಮಿತ್ತು.',
    descriptionEn: 'Sun-dried mango tree twigs for Homa sacred fire offering.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },
  {
    id: 'm18',
    nameKn: 'ಅರಳಿ ಸಮಿತ್ತು (ಅಶ್ವತ್ಥ)',
    nameEn: 'Peepal (Ashwattha) Samithu',
    category: 'samithu',
    categoryLabelKn: 'ಸಮಿತ್ತುಗಳು',
    categoryLabelEn: 'Samithu Woods',
    price: 70,
    unitKn: '1 ಕಟ್ಟು',
    unitEn: '1 bunch',
    essential: false,
    descriptionKn: 'ಬೃಹಸ್ಪತಿ (ಗುರು) ಹಾಗೂ ಶಾಂತಿ ಹೋಮಗಳಿಗೆ ಸಮಿತ್ತು.',
    descriptionEn: 'Sacred Peepal tree twigs for Guru and Shanti homas.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },
  {
    id: 'm19',
    nameKn: 'ಬಿಲ್ವ ಸಮಿತ್ತು',
    nameEn: 'Bilva Samithu Wood',
    category: 'samithu',
    categoryLabelKn: 'ಸಮಿತ್ತುಗಳು',
    categoryLabelEn: 'Samithu Woods',
    price: 80,
    unitKn: '1 ಕಟ್ಟು',
    unitEn: '1 bunch',
    essential: false,
    descriptionKn: 'ಮಹಾರುದ್ರ ಮತ್ತು ಲಕ್ಷ್ಮೀ ಹೋಮಗಳಿಗೆ ಶ್ರೇಷ್ಠ.',
    descriptionEn: 'Sacred Bael tree wood for Maha Rudra and Lakshmi homas.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },

  // 4. ಪಂಚಗವ್ಯ / Panchagavya & Liquids
  {
    id: 'm20',
    nameKn: 'ಶುದ್ಧ ಹಸುವಿನ ಹಾಲು',
    nameEn: 'Pure Desi Cow Milk',
    category: 'panchagavya',
    categoryLabelKn: 'ಪಂಚಗವ್ಯ & ಅಭಿಷೇಕ',
    categoryLabelEn: 'Panchagavya & Liquids',
    price: 40,
    unitKn: '500 ಮಿಲಿ',
    unitEn: '500ml',
    essential: true,
    descriptionKn: 'ಅಭಿಷೇಕ ಮತ್ತು ನೈವೇದ್ಯಕ್ಕೆ ತಾಜಾ ದೇಸಿ ಆಕಳ ಹಾಲು.',
    descriptionEn: 'Fresh desi cow milk for abhisheka and kheer naivedya.',
    image: '/src/assets/images/product_brass_diya_1790401709970.jpg'
  },
  {
    id: 'm21',
    nameKn: 'ತಾಜಾ ಮೊಸರು',
    nameEn: 'Fresh Set Curd',
    category: 'panchagavya',
    categoryLabelKn: 'ಪಂಚಗವ್ಯ & ಅಭಿಷೇಕ',
    categoryLabelEn: 'Panchagavya & Liquids',
    price: 35,
    unitKn: '250 ಗ್ರಾಂ',
    unitEn: '250g',
    essential: true,
    descriptionKn: 'ಪಂಚಾಮೃತಕ್ಕೆ ಸಿದ್ಧಪಡಿಸಿದ ಮಣ್ಣಿನ ಮಡಕೆಯ ಶುದ್ಧ ಮೊಸರು.',
    descriptionEn: 'Traditional curd for panchamruta and abhisheka.',
    image: '/src/assets/images/product_brass_diya_1790401709970.jpg'
  },
  {
    id: 'm22',
    nameKn: 'ಶುದ್ಧ ಜೇನುತುಪ್ಪ',
    nameEn: 'Pure Wild Honey',
    category: 'panchagavya',
    categoryLabelKn: 'ಪಂಚಗವ್ಯ & ಅಭಿಷೇಕ',
    categoryLabelEn: 'Panchagavya & Liquids',
    price: 95,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: false,
    descriptionKn: 'ಕಾಡಿನ ನೈಸರ್ಗಿಕ ಶುದ್ಧ ಜೇನುತುಪ್ಪ, ಅಭಿಷೇಕಕ್ಕೆ ಶ್ರೇಷ್ಠ.',
    descriptionEn: '100% pure raw forest honey for ceremonial abhisheka.',
    image: '/src/assets/images/product_thali_kit_1790401723652.jpg'
  },
  {
    id: 'm23',
    nameKn: 'ಪವಿತ್ರ ಗಂಗಾಜಲ ಬಾಟಲಿ',
    nameEn: 'Sanctified Gangajal Sealed Bottle',
    category: 'panchagavya',
    categoryLabelKn: 'ಪಂಚಗವ್ಯ & ಅಭಿಷೇಕ',
    categoryLabelEn: 'Panchagavya & Liquids',
    price: 55,
    unitKn: '200 ಮಿಲಿ',
    unitEn: '200ml',
    essential: true,
    descriptionKn: 'ಹರಿದ್ವಾರ ಮತ್ತು ಕಾಶಿಯಿಂದ ತಂದ ಸೀಲ್ಡ್ ಗಂಗಾಜಲ.',
    descriptionEn: 'Sealed holy Ganga water from Gangotri/Haridwar.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },
  {
    id: 'm24',
    nameKn: 'ಪಂಚಾಮೃತ ಮಿಶ್ರಣ ಸಾಮಗ್ರಿ',
    nameEn: 'Panchamruta Ready Ingredients Pack',
    category: 'panchagavya',
    categoryLabelKn: 'ಪಂಚಗವ್ಯ & ಅಭಿಷೇಕ',
    categoryLabelEn: 'Panchagavya & Liquids',
    price: 110,
    unitKn: '1 ಕಿಟ್',
    unitEn: '1 kit',
    essential: false,
    descriptionKn: 'ಹಾಲು, ಮೊಸರು, ತುಪ್ಪ, ಜೇನುತುಪ್ಪ, ಕಲ್ಲುಸಕ್ಕರೆ ಅಳತೆ ಕಿಟ್.',
    descriptionEn: 'Proportioned 5 nectars kit for deity abhisheka.',
    image: '/src/assets/images/product_thali_kit_1790401723652.jpg'
  },

  // 5. ನವಧಾನ್ಯಗಳು / Navadhanya Grains
  {
    id: 'm25',
    nameKn: 'ಶುದ್ಧ ಬಿಳಿ ಅಕ್ಕಿ',
    nameEn: 'Pure Raw Rice (Pooja Akki)',
    category: 'navadhanya',
    categoryLabelKn: 'ನವಧಾನ್ಯ',
    categoryLabelEn: 'Navadhanya Grains',
    price: 50,
    unitKn: '1 ಕೆಜಿ',
    unitEn: '1 kg',
    essential: true,
    descriptionKn: 'ಕಳಸದ ಪೀಠ ಹಾಗೂ ಅಕ್ಷತೆಗೆ ಶುದ್ಧ ಮುರಿಯದ ಬಿಳಿ ಅಕ್ಕಿ.',
    descriptionEn: 'Clean whole raw rice for Kalasha base and akshata.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm26',
    nameKn: 'ಸಂಪೂರ್ಣ ನವಧಾನ್ಯ ಸೆಟ್ (9 ಧಾನ್ಯಗಳು)',
    nameEn: 'Complete 9-Grain Navadhanya Set',
    category: 'navadhanya',
    categoryLabelKn: 'ನವಧಾನ್ಯ',
    categoryLabelEn: 'Navadhanya Grains',
    price: 130,
    unitKn: '1 ಸೆಟ್ (9 ಪ್ಯಾಕೆಟ್)',
    unitEn: '1 set (9 packs)',
    essential: true,
    descriptionKn: 'ಸೂರ್ಯಾದಿ ನವಗ್ರಹ ಪ್ರತ್ಯೇಕ 9 ಧಾನ್ಯಗಳ ಶುದ್ಧ ಪ್ಯಾಕ್.',
    descriptionEn: 'Individually portioned grains for the nine cosmic planets.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm27',
    nameKn: 'ಶುದ್ಧ ಗೋಧಿ',
    nameEn: 'Whole Wheat Grains',
    category: 'navadhanya',
    categoryLabelKn: 'ನವಧಾನ್ಯ',
    categoryLabelEn: 'Navadhanya Grains',
    price: 35,
    unitKn: '250 ಗ್ರಾಂ',
    unitEn: '250g',
    essential: false,
    descriptionKn: 'ಸೂರ್ಯ ಗ್ರಹದ ಧಾನ್ಯವಾದ ಶುದ್ಧ ಗೋಧಿ.',
    descriptionEn: 'Golden whole wheat dedicated to Surya Deva.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm28',
    nameKn: 'ಹೆಸರುಬೇಳೆ & ಉದ್ದಿನಬೇಳೆ',
    nameEn: 'Moong & Urad Dal Pack',
    category: 'navadhanya',
    categoryLabelKn: 'ನವಧಾನ್ಯ',
    categoryLabelEn: 'Navadhanya Grains',
    price: 45,
    unitKn: '200 ಗ್ರಾಂ',
    unitEn: '200g',
    essential: false,
    descriptionKn: 'ಬುಧ ಮತ್ತು ರಾಹು ಶಾಂತಿಗಾಗಿ ಪ್ರಶಸ್ತ ಧಾನ್ಯಗಳು.',
    descriptionEn: 'Selected lentils for planetary balance.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },

  // 6. ಒಣ ಫಲಗಳು / Dry Fruits
  {
    id: 'm29',
    nameKn: 'ಶುದ್ಧ ಬೆಲ್ಲ (ಉಂಡೆ ಬೆಲ್ಲ)',
    nameEn: 'Organic Jaggery (Bella)',
    category: 'dryfruits',
    categoryLabelKn: 'ಒಣ ಫಲ & ನೈವೇದ್ಯ',
    categoryLabelEn: 'Dry Fruits',
    price: 40,
    unitKn: '250 ಗ್ರಾಂ',
    unitEn: '250g',
    essential: true,
    descriptionKn: 'ರಾಸಾಯನಿಕ ರಹಿತ ಸಾವಯವ ಸಿಹಿ ಬೆಲ್ಲ ನೈವೇದ್ಯಕ್ಕೆ.',
    descriptionEn: 'Chemical-free organic jaggery for sweet prasada naivedya.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm30',
    nameKn: 'ಗೋಡಂಬಿ & ಒಣದ್ರಾಕ್ಷಿ',
    nameEn: 'Cashew & Raisins Combo',
    category: 'dryfruits',
    categoryLabelKn: 'ಒಣ ಫಲ & ನೈವೇದ್ಯ',
    categoryLabelEn: 'Dry Fruits',
    price: 120,
    unitKn: '100 ಗ್ರಾಂ',
    unitEn: '100g',
    essential: false,
    descriptionKn: 'ಪಾಯಸ ಮತ್ತು ಪಂಚಖಾದ್ಯಕ್ಕೆ ಗುಣಮಟ್ಟದ ಗೋಡಂಬಿ-ದ್ರಾಕ್ಷಿ.',
    descriptionEn: 'Whole cashews and golden raisins for sacred kheer.',
    image: '/src/assets/images/category_navadhanya_grains_1790402530957.jpg'
  },
  {
    id: 'm31',
    nameKn: 'ಒಣ ಕೊಬ್ಬರಿ (ಗಿಟುಕು)',
    nameEn: 'Dry Coconut Halves (Kobbari)',
    category: 'dryfruits',
    categoryLabelKn: 'ಒಣ ಫಲ & ನೈವೇದ್ಯ',
    categoryLabelEn: 'Dry Fruits',
    price: 65,
    unitKn: '2 ಪೀಸ್ (ಜೊತೆ)',
    unitEn: '2 pcs (pair)',
    essential: true,
    descriptionKn: 'ಹೋಮದ ಪೂರ್ಣಾಹುತಿಗೆ ಹಾಗೂ ಬಾಗಿನಕ್ಕೆ ಶ್ರೇಷ್ಠ ಕೊಬ್ಬರಿ.',
    descriptionEn: 'Dry coconut cups for Poornahuti homa offering.',
    image: '/src/assets/images/dry_coconut_kobbari_1790403403401.jpg'
  },

  // 7. ಹಣ್ಣುಗಳು / Fruits & Veg
  {
    id: 'm32',
    nameKn: 'ಎಳಚಿಗಿ ಬಾಳೆಹಣ್ಣು (ಯಾಲಕ್ಕಿ ಬಾಳೆ)',
    nameEn: 'Yellakki Bananas (Bunch)',
    category: 'fruits',
    categoryLabelKn: 'ಹಣ್ಣು & ತರಕಾರಿ',
    categoryLabelEn: 'Fruits & Veg',
    price: 50,
    unitKn: '1 ಡಜನ್',
    unitEn: '1 dozen',
    essential: true,
    descriptionKn: 'ತಾಂಬೂಲ ಮತ್ತು ನೈವೇದ್ಯಕ್ಕೆ ತಾಜಾ ಸುವಾಸನೆಯ ಬಾಳೆಹಣ್ಣು.',
    descriptionEn: 'Fresh auspicious bananas for tambula and offering.',
    image: '/src/assets/images/puja_tambula_leaves_1790403387392.jpg'
  },
  {
    id: 'm33',
    nameKn: 'ಶುದ್ಧ ಸಿಹಿ ಎಳನೀರು',
    nameEn: 'Tender Sweet Coconut (Elaneeru)',
    category: 'fruits',
    categoryLabelKn: 'ಹಣ್ಣು & ತರಕಾರಿ',
    categoryLabelEn: 'Fruits & Veg',
    price: 45,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: false,
    descriptionKn: 'ಶಿವನಿಗೆ ಮತ್ತು ಗಣೇಶನಿಗೆ ಎಳನೀರು ಅಭಿಷೇಕಕ್ಕೆ.',
    descriptionEn: 'Fresh tender green coconut for divine abhisheka.',
    image: '/src/assets/images/puja_tambula_leaves_1790403387392.jpg'
  },
  {
    id: 'm34',
    nameKn: 'ವೀಳ್ಯದೆಲೆ & ಅಡಿಕೆ ಜೊತೆ (ತಾಂಬೂಲ)',
    nameEn: 'Betel Leaves & Areca Nut (Tambula)',
    category: 'fruits',
    categoryLabelKn: 'ಹಣ್ಣು & ತರಕಾರಿ',
    categoryLabelEn: 'Fruits & Veg',
    price: 40,
    unitKn: '20 ಎಲೆ + ಅಡಿಕೆ',
    unitEn: '20 leaves + nuts',
    essential: true,
    descriptionKn: 'ತಾಜಾ ಚಿಗುರು ವೀಳ್ಯದೆಲೆಗಳು ಹಾಗೂ ಮಂಗಳ ಅಡಿಕೆ.',
    descriptionEn: 'Crisp fresh betel leaves and auspicious areca nuts.',
    image: '/src/assets/images/puja_tambula_leaves_1790403387392.jpg'
  },

  // 8. ಪುಷ್ಪಗಳು / Divine Flowers
  {
    id: 'm35',
    nameKn: 'ತಾಜಾ ಮಲ್ಲಿಗೆ ಹೂವಿನ ಮಾಲೆ',
    nameEn: 'Fresh Jasmine (Mallige) Garland',
    category: 'flowers',
    categoryLabelKn: 'ದೈವಿಕ ಪುಷ್ಪ',
    categoryLabelEn: 'Divine Flowers',
    price: 90,
    unitKn: '1 ಮಾಲೆ (2 ಅಡಿ)',
    unitEn: '1 garland (2 ft)',
    essential: true,
    descriptionKn: 'ದೇವರಿಗೆ ಶೃಂಗಾರ ಮಾಡಲು ಸುವಾಸನೆಯ ಬಿಳಿ ಮಲ್ಲಿಗೆ.',
    descriptionEn: 'Fragrant fresh white jasmine garland for deity decoration.',
    image: '/src/assets/images/category_divine_flowers_1790402514635.jpg'
  },
  {
    id: 'm36',
    nameKn: 'ಕೆಂಪು ಕಮಲದ ಹೂ',
    nameEn: 'Divine Red/Pink Lotus Flower',
    category: 'flowers',
    categoryLabelKn: 'ದೈವಿಕ ಪುಷ್ಪ',
    categoryLabelEn: 'Divine Flowers',
    price: 40,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: true,
    descriptionKn: 'ಲಕ್ಷ್ಮೀ ಪೂಜೆಗೆ ಪರಮ ಪವಿತ್ರವಾದ ನೈಸರ್ಗಿಕ ಕಮಲ.',
    descriptionEn: 'Fresh auspicious sacred lotus bloom for Goddess Lakshmi.',
    image: '/src/assets/images/category_divine_flowers_1790402514635.jpg'
  },
  {
    id: 'm37',
    nameKn: 'ಚೆಂಡು ಹೂ (ಕೇಸರಿ / ಹಳದಿ)',
    nameEn: 'Fresh Marigold Flowers (Chendu Hoo)',
    category: 'flowers',
    categoryLabelKn: 'ದೈವಿಕ ಪುಷ್ಪ',
    categoryLabelEn: 'Divine Flowers',
    price: 45,
    unitKn: '250 ಗ್ರಾಂ',
    unitEn: '250g',
    essential: false,
    descriptionKn: 'ಮಂಡಲ ರಚನೆ ಮತ್ತು ಅಲಂಕಾರಕ್ಕೆ ಪ್ರಶಸ್ತ ಪುಷ್ಪ.',
    descriptionEn: 'Vibrant golden marigold blossoms for altar decoration.',
    image: '/src/assets/images/category_divine_flowers_1790402514635.jpg'
  },

  // 9. ಧಾತು & ಇತರೆ ಉಪಕರಣಗಳು / Other Tools
  {
    id: 'm38',
    nameKn: 'ಶುದ್ಧ ತಾಮ್ರದ ಕಳಸ ಪಾತ್ರೆ',
    nameEn: 'Pure Embossed Copper Kalasha Pot',
    category: 'others',
    categoryLabelKn: 'ಧಾತು & ಇತರೆ',
    categoryLabelEn: 'Other Tools',
    price: 340,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: true,
    descriptionKn: 'ಶಾಸ್ತ್ರೋಕ್ತ ಜಲ ಸ್ಥಾಪನೆಗಾಗಿ ಸಾತ್ವಿಕ ತಾಮ್ರದ ಕಳಸ.',
    descriptionEn: 'Heavy gauge pure copper Kalasha pot with traditional neck.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },
  {
    id: 'm39',
    nameKn: 'ಕಂಚಿನ ನಂದಿ ಘಂಟೆ (ಗಂಟೆ)',
    nameEn: 'Acoustic Brass Nandi Temple Bell',
    category: 'others',
    categoryLabelKn: 'ಧಾತು & ಇತರೆ',
    categoryLabelEn: 'Other Tools',
    price: 480,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: true,
    descriptionKn: 'ದೇವತಾರ್ಚನೆಗೆ 432 Hz ಸುಶ್ರಾವ್ಯ ಧ್ವನಿಯ ಘಂಟೆ.',
    descriptionEn: 'Hand-cast resonant bell with sacred Nandi finial handle.',
    image: '/src/assets/images/product_brass_diya_1790401709970.jpg'
  },
  {
    id: 'm40',
    nameKn: 'ಹಿತ್ತಾಳೆಯ ನಂದಾದೀಪ / ದಿಯ',
    nameEn: 'Traditional Mayur Brass Diya Lamp',
    category: 'others',
    categoryLabelKn: 'ಧಾತು & ಇತರೆ',
    categoryLabelEn: 'Other Tools',
    price: 450,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: true,
    descriptionKn: 'ಶುದ್ಧ ಹಿತ್ತಾಳೆಯ ದೀರ್ಘಕಾಲಿಕ ತುಪ್ಪದ ದೀಪ.',
    descriptionEn: 'Pure virgin brass oil lamp with anti-drip reservoir.',
    image: '/src/assets/images/product_brass_diya_1790401709970.jpg'
  },
  {
    id: 'm41',
    nameKn: 'ಮಣೆ (ಪೂಜಾ ಪೀಠ)',
    nameEn: 'Wooden Puja Asana Seat (Mane / Peetha)',
    category: 'others',
    categoryLabelKn: 'ಧಾತು & ಇತರೆ',
    categoryLabelEn: 'Other Tools',
    price: 320,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: false,
    descriptionKn: 'ಸಾಲಿಡ್ ಮರದಿಂದ ಮಾಡಿದ ಸಾಂಪ್ರದಾಯಿಕ ಪೂಜಾ ಆಸನ.',
    descriptionEn: 'Solid natural teak/jackfruit wood seat for ritual seating.',
    image: '/src/assets/images/category_copper_kalasha_1790402543268.jpg'
  },
  {
    id: 'm42',
    nameKn: 'ದೇವತಾರ್ಚನೆ ಶಂಖ',
    nameEn: 'Natural Sacred Blowing Shankha (Conch)',
    category: 'others',
    categoryLabelKn: 'ಧಾತು & ಇತರೆ',
    categoryLabelEn: 'Other Tools',
    price: 650,
    unitKn: '1 ಪೀಸ್',
    unitEn: '1 pc',
    essential: false,
    descriptionKn: 'ಶುಭ ನಾದ ತರಂಗಗಳನ್ನು ಹೊರಹೊಮ್ಮಿಸುವ ನೈಸರ್ಗಿಕ ಶಂಖ.',
    descriptionEn: 'Natural sacred white conch with clear resonant blowing sound.',
    image: '/src/assets/images/product_rudraksha_mala_1790401748975.jpg'
  },
  {
    id: 'm43',
    nameKn: 'ಪಂಚಪಾತ್ರೆ & ಉದ್ಧರಣೆ (ಚಮಚ)',
    nameEn: 'Brass Panchapatra with Udharini Spoon',
    category: 'others',
    categoryLabelKn: 'ಧಾತು & ಇತರೆ',
    categoryLabelEn: 'Other Tools',
    price: 280,
    unitKn: '1 ಸೆಟ್',
    unitEn: '1 set',
    essential: true,
    descriptionKn: 'ಆಚಮನ ಮತ್ತು ತೀರ್ಥ ಸಂಪ್ರೋಕ್ಷಣೆಗೆ ಹಿತ್ತಾಳೆ ಪಾತ್ರೆ.',
    descriptionEn: 'Traditional brass cup and ceremonial spoon for achamana water.',
    image: '/src/assets/images/product_thali_kit_1790401723652.jpg'
  }
];

export const WORK_PROCESS = [
  {
    step: '01',
    titleKn: 'ಪೂಜೆ ಆಯ್ಕೆ ಮಾಡಿ',
    titleEn: 'Select Pooja',
    descKn: 'ನಿಮಗೆ ಬೇಕಾದ ಪೂಜಾ ಸೇವೆಯನ್ನು ಅಥವಾ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳನ್ನು ಸುಲಭವಾಗಿ ಆಯ್ಕೆ ಮಾಡಿ.',
    descEn: 'Choose the specific pooja service or individual required samagri you need.'
  },
  {
    step: '02',
    titleKn: 'ಸಾಮಗ್ರಿಗಳು',
    titleEn: 'Select Items',
    descKn: 'ಪೂಜೆಗೆ ಬೇಕಾದ ಮಂಗಳ ದ್ರವ್ಯ, ನವಧಾನ್ಯ, ಫಲ ಪುಷ್ಪಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    descEn: 'Review and customize the essential materials, grains, and sacred utensils.'
  },
  {
    step: '03',
    titleKn: 'ಪುರೋಹಿತರ ಬುಕಿಂಗ್',
    titleEn: 'Book Purohit',
    descKn: 'ಅನುಭವಿ ವೇದ ವಿದ್ವಾನ್ ಪುರೋಹಿತರನ್ನು ನಿಮ್ಮ ಅನುಕೂಲಕರ ದಿನಾಂಕಕ್ಕೆ ನಿಗದಿ ಮಾಡಿ.',
    descEn: 'Schedule knowledgeable Vedic purohits for your auspicious date & muhurat.'
  },
  {
    step: '04',
    titleKn: 'ಸೇವೆಯನ್ನು ಪಡೆಯಿರಿ',
    titleEn: 'Get the Service',
    descKn: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಸಾಮಗ್ರಿಗಳು ಹಾಗೂ ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜಾ ಸೇವೆಯನ್ನು ನೆಮ್ಮದಿಯಿಂದ ಪಡೆಯಿರಿ.',
    descEn: 'Receive a hassle-free, traditional, consecrated ritual experience at your doorstep.'
  }
];

export const TRUST_PILLARS = [
  {
    icon: 'quality',
    titleKn: 'ಗುಣಮಟ್ಟ',
    titleEn: 'Quality',
    subKn: 'ಆಯ್ದ ಸಾಮಗ್ರಿಗಳು',
    subEn: 'Handpicked items',
    descKn: 'ಪ್ರತಿ ಸಾಮಗ್ರಿಯೂ ಶುದ್ಧ, ತಾಜಾ ಮತ್ತು ಶಾಸ್ತ್ರೋಕ್ತ ಗುಣಮಟ್ಟದ್ದು.'
  },
  {
    icon: 'time',
    titleKn: 'ಸಮಯ ಪಾಲನೆ',
    titleEn: 'Punctuality',
    subKn: 'ಸರಿಯಾದ ಸಮಯಕ್ಕೆ',
    subEn: 'On-time arrival',
    descKn: 'ನಿಗದಿತ ಮುಹೂರ್ತಕ್ಕೆ ಸರಿಯಾಗಿ ಸಾಮಗ್ರಿ ಹಾಗೂ ಪುರೋಹಿತರ ಆಗಮನ.'
  },
  {
    icon: 'trust',
    titleKn: 'ವಿಶ್ವಾಸ',
    titleEn: 'Trust',
    subKn: 'ಜವಾಬ್ದಾರಿಯುತ ಸೇವೆ',
    subEn: 'Responsible service',
    descKn: 'ನಿಮ್ಮ ಪೂಜೆ ನಮ್ಮ ಹೊಣೆಗಾರಿಕೆ ಎಂಬ ಭಕ್ತಿಪೂರ್ವಕ ಸೇವಾ ಮನೋಭಾವ.'
  },
  {
    icon: 'simplicity',
    titleKn: 'ಸರಳ ವ್ಯವಸ್ಥೆ',
    titleEn: 'Simplicity',
    subKn: 'ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ',
    subEn: 'Everything in one place',
    descKn: 'ಸಾಮಗ್ರಿ ಹುಡುಕಾಟದ ಗೋಜಿಲ್ಲದೆ ಎಲ್ಲವೂ ಸುಲಭವಾಗಿ ಲಭ್ಯ.'
  }
];

export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Raghunath Sharma',
    city: 'Shivamogga (ಶಿವಮೊಗ್ಗ)',
    rating: 5,
    title: 'Divine resonance from the Mayur Diyas & On-Time Purohit',
    date: '3 days ago',
    comment: 'The weight and pure brass chime of the diyas exceeded expectations. The priest arrived 30 minutes before muhurat and brought all the fresh lotus flowers and Bilva leaves. Highly recommended!',
    productName: 'Gruhapravesha Ceremony & Brass Diya'
  },
  {
    id: 'rev-2',
    author: 'Meenakshi Sundaram',
    city: 'Bengaluru',
    rating: 5,
    title: 'Griha Pravesh kit had every single required item',
    date: '1 week ago',
    comment: 'Our family was relieved that every single herb, mango samithu, and grain was fresh, fragrant, and strictly Agamic. Checking out with UPI QR took 10 seconds.',
    productName: 'Sampoorna Navagraha Homa Kit'
  },
  {
    id: 'rev-3',
    author: 'Dr. Vivek Sengupta',
    city: 'Mysuru',
    rating: 5,
    title: 'Authentic pure Bhimseni camphor & Mysore Chandan',
    date: '2 weeks ago',
    comment: 'Pure Bhimseni camphor leaves zero black soot, and the Mysore sandalwood aroma filled our home with divine calmness. The secure payment was smooth with instant OTP.',
    productName: 'Pure Bhimseni Camphor & Mysore Sandalwood'
  }
];

export const CONTACT_INFO = {
  name: 'Ramachandra M',
  nameKn: 'ರಾಮಚಂದ್ರ ಎಂ (Ramachandra M)',
  phone: '+91 87225 50479',
  displayPhone: '+91 87225 50479',
  email: 'shriramachandra1995@gmail.com',
  templeKn: 'ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ',
  templeEn: 'Anjaneya Temple, Arakere, Shivamogga',
  addressKn: 'ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ, ಕರ್ನಾಟಕ',
  addressEn: 'Anjaneya Temple, Arakere, Shivamogga, Karnataka',
  locationKn: 'ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ',
  locationEn: 'Anjaneya Temple, Arakere, Shivamogga, Karnataka',
  mottoKn: 'ಭಕ್ತಿ • ಶ್ರದ್ಧೆ • ಸಮರ್ಪಣೆ | ನಿಮ್ಮ ಪೂಜೆ • ನಮ್ಮ ಜವಾಬ್ದಾರಿ',
  mottoEn: 'Devotion • Faith • Dedication | Your Pooja • Our Responsibility'
};

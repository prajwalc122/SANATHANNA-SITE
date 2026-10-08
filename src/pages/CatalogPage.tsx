import React, { useState, useMemo } from 'react';
import { Language, RMSCatalogItem, RMSCategory, MaterialItem } from '../types';
import { RMS_CATEGORIES, RMS_CATALOG_ITEMS } from '../data/rmsCatalogData';
import { getCatalogItemImage } from '../utils/catalogImages';
import { 
  Search, Filter, ShoppingBag, MessageCircle, Phone, 
  Sparkles, Check, ChevronRight, Award, Shield, FileText, ArrowRight, X, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { templeAudio } from '../utils/audioChant';

interface CatalogPageProps {
  lang: Language;
  onAddToCart: (item: MaterialItem) => void;
  onBookPurohit: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  lang,
  onAddToCart,
  onBookPurohit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RMSCategory>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return RMS_CATALOG_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== 'all') {
        if (selectedMaterial === 'Brass' && item.material !== 'Brass') return false;
        if (selectedMaterial === 'Copper' && item.material !== 'Copper') return false;
        if (selectedMaterial === 'Kansa' && !item.material.includes('Kansa')) return false;
        if (selectedMaterial === 'SilverGold' && !['Silver Plated / Antique', 'Gold Plated'].includes(item.material)) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeClean = item.code.toLowerCase().replace('rms-', '');
        const matchCode = item.code.toLowerCase().includes(q) || codeClean.includes(q);
        const matchNameEn = item.nameEn.toLowerCase().includes(q);
        const matchNameKn = item.nameKn.toLowerCase().includes(q);
        const matchSizes = item.sizes.toLowerCase().includes(q);
        const matchDesc = item.descriptionEn.toLowerCase().includes(q) || item.descriptionKn.toLowerCase().includes(q);
        return matchCode || matchNameEn || matchNameKn || matchSizes || matchDesc;
      }
      return true;
    });
  }, [selectedCategory, selectedMaterial, searchQuery]);

  // Convert catalog item to standard app MaterialItem for Cart
  const handleAddItemToCart = (catalogItem: RMSCatalogItem) => {
    templeAudio.playTempleBell();
    const cleanCode = catalogItem.code.replace('RMS-', '');
    const materialItem: MaterialItem = {
      id: `item-${cleanCode.toLowerCase()}`,
      nameKn: `${catalogItem.nameKn} (#${cleanCode})`,
      nameEn: `${catalogItem.nameEn} [#${cleanCode}]`,
      category: 'others',
      categoryLabelKn: catalogItem.categoryNameKn,
      categoryLabelEn: catalogItem.categoryNameEn,
      price: catalogItem.priceEstimate || 450,
      unitKn: `1 ಪೀಸ್ (${catalogItem.sizes})`,
      unitEn: `1 pc (${catalogItem.sizes})`,
      essential: true,
      descriptionKn: `${catalogItem.descriptionKn} - ಅಳತೆ: ${catalogItem.sizes} (ಕ್ಯಾಟಲಾಗ್ ಪೇಜ್ ${catalogItem.pageNumber})`,
      descriptionEn: `${catalogItem.descriptionEn} - Size: ${catalogItem.sizes} (Catalog Page ${catalogItem.pageNumber})`
    };

    onAddToCart(materialItem);
    setAddedItemCode(catalogItem.code);
    setTimeout(() => setAddedItemCode(null), 2500);
  };

  const handleWhatsAppEnquiry = (item: RMSCatalogItem) => {
    const cleanCode = item.code.replace('RMS-', '');
    const text = encodeURIComponent(
      `ನಮಸ್ಕಾರ / Namaste! I am interested in purchasing from the Sacred Pooja Materials Catalogue:\n\n` +
      `📌 *Item Code:* #${cleanCode}\n` +
      `🏷️ *Product:* ${item.nameEn} (${item.nameKn})\n` +
      `📏 *Size Options:* ${item.sizes}\n` +
      `✨ *Material:* ${item.material}\n` +
      `📖 *Catalogue Page:* Page ${item.pageNumber}\n\n` +
      `Please provide stock availability, current metal weight, and best wholesale/retail pricing.`
    );
    window.open(`https://wa.me/919448123456?text=${text}`, '_blank');
  };

  return (
    <div id="catalog" className="min-h-screen bg-[#FFFDF9] pb-24 text-[#4D2300]">
      {/* Official Catalog Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4A1500] via-[#7A2800] to-[#993A00] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFE580] text-xs font-bold tracking-wider uppercase">
                <Award className="w-4 h-4 text-[#FFD700]" />
                <span>{lang === 'kn' ? 'ಪವಿತ್ರ ಪೂಜಾ ಪರಿಕರಗಳ ಅಧಿಕೃತ ಕ್ಯಾಟಲಾಗ್ • ೧೦೦% ಶುದ್ಧ ಗುಣಮಟ್ಟ' : 'Sacred Pooja Materials • 100% Export Grade Quality'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#FFF0E0]">
                {lang === 'kn' ? 'ಪೂಜಾ ಪರಿಕರಗಳ ಕ್ಯಾಟಲಾಗ್' : 'Sacred Pooja Materials & Utensils Catalog'}
              </h1>
              <p className="text-sm sm:text-base text-[#FFCC99] max-w-2xl leading-relaxed">
                {lang === 'kn'
                  ? '೫೦ ಪುಟಗಳ ಅಧಿಕೃತ ಕ್ಯಾಟಲಾಗ್‌ನಿಂದ ಹಿತ್ತಾಳೆ, ತಾಮ್ರ, ಕಂಚಿನ ಥಾಲಿ, ಸಮೈ, ದೇವಸ್ಥಾನದ ಘಂಟೆಗಳು, ಹವನ ಕುಂಡ, ದೀಪಗಳು ಹಾಗೂ ದೇವರ ಮೂರ್ತಿಗಳ ಸಂಪೂರ್ಣ ಸಂಗ್ರಹ (300+ ಪರಿಕರಗಳು).'
                  : 'Complete 50-page authentic catalogue featuring 300+ handcrafted items: temple bells, grand aartis, samai lamps, pure kansa utensils, havan kunds & sacred idols.'}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center px-3 border-r border-white/10">
                <span className="block text-2xl font-black text-[#FFD700] font-mono">320+</span>
                <span className="text-[10px] text-white/80 uppercase font-bold">{lang === 'kn' ? 'ಉತ್ಪನ್ನಗಳು' : 'Products'}</span>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <span className="block text-2xl font-black text-[#FFD700] font-mono">50</span>
                <span className="text-[10px] text-white/80 uppercase font-bold">{lang === 'kn' ? 'ಕ್ಯಾಟಲಾಗ್ ಪುಟಗಳು' : 'PDF Pages'}</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-2xl font-black text-[#00ED64] font-mono">100%</span>
                <span className="text-[10px] text-white/80 uppercase font-bold">{lang === 'kn' ? 'ರಫ್ತು ದರ್ಜೆ' : 'Export Grade'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Search & Filter Toolbar */}
      <section className="sticky top-[var(--header-height,104px)] z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#FFCC99]/60 shadow-xs py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#994700]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'kn' ? 'ಕೋಡ್ (ಉದಾ: 0109), ಹೆಸರು ಅಥವಾ ಅಳತೆಯಿಂದ ಹುಡುಕಿ...' : 'Search by Code (e.g. 0109), Name, Size...'}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-sm text-[#4D2300] placeholder:text-[#994700]/50 focus:outline-none focus:ring-2 focus:ring-[#CC5500] shadow-2xs font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Material Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-[#994700] whitespace-nowrap mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                {lang === 'kn' ? 'ಲೋಹ:' : 'Metal:'}
              </span>
              {[
                { id: 'all', labelKn: 'ಎಲ್ಲವೂ', labelEn: 'All Metals' },
                { id: 'Brass', labelKn: 'ಹಿತ್ತಾಳೆ', labelEn: 'Brass' },
                { id: 'Copper', labelKn: 'ತಾಮ್ರ', labelEn: 'Copper' },
                { id: 'Kansa', labelKn: 'ಕಂಚು (Bronze)', labelEn: 'Kansa' },
                { id: 'SilverGold', labelKn: 'ಬೆಳ್ಳಿ/ಬಂಗಾರ', labelEn: 'Silver/Gold' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedMaterial === m.id
                      ? 'bg-[#CC5500] text-white shadow-2xs'
                      : 'bg-white text-[#663000] border border-[#FFCC99] hover:bg-[#FFF5EB]'
                  }`}
                >
                  {lang === 'kn' ? m.labelKn : m.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Category Horizontal Scrolling Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {RMS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#4A1500] text-[#FFD700] shadow-xs ring-1 ring-[#FFD700]/40'
                    : 'bg-[#FFF5EB] text-[#663000] border border-[#FFCC99]/80 hover:bg-[#FFE8D6]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'kn' ? cat.kn.replace(' (All Items)', '') : cat.en}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif font-black text-[#4D2300] flex items-center gap-2">
              <span>{lang === 'kn' ? 'ಕ್ಯಾಟಲಾಗ್ ಉತ್ಪನ್ನಗಳ ವಿವರ' : 'Catalogue Products List'}</span>
              <span className="text-xs font-mono font-bold bg-[#FFCC99]/40 text-[#994700] px-2.5 py-0.5 rounded-full">
                {filteredItems.length} {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು' : 'Items'}
              </span>
            </h2>
            <p className="text-xs text-[#994700]">
              {lang === 'kn' ? 'ಪ್ರತಿ ವಸ್ತುವಿನ ಚಿತ್ರ, ನಿಖರವಾದ ಕೋಡ್ ಹಾಗೂ ಸೈಜ್ ವಿವರಗಳು ಲಭ್ಯವಿದೆ.' : 'All items feature authentic images, codes, available sizes, and pure metals.'}
            </p>
          </div>

          {/* WhatsApp Direct Help */}
          <a
            href="https://wa.me/919448123456?text=Namaste,%20I%20have%20an%20inquiry%20regarding%20the%20Pooja%20Materials%20Catalogue."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ನೇರ ವಿಚಾರಣೆ (WhatsApp)' : 'Direct WhatsApp Help'}</span>
          </a>
        </div>

        {/* Product Cards Grid with Authentic Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const cleanCode = item.code.replace('RMS-', '');
            return (
              <div
                key={item.code}
                className="bg-white rounded-2xl border-2 border-[#FFCC99]/60 hover:border-[#CC5500] p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Item Image with Code & Page Badge */}
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#FFF5EB] to-[#FFEAD4] mb-3 border border-[#FFCC99]/40 group-hover:border-[#CC5500]/60 transition-all">
                    <img
                      src={getCatalogItemImage(item)}
                      alt={item.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#4A1500]/90 backdrop-blur-xs text-[#FFD700] text-[10px] font-mono font-black tracking-wider shadow-xs">
                        #{cleanCode}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-[9px] font-bold text-[#4D2300] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-2xs border border-[#FFCC99]/50">
                        Page {item.pageNumber}
                      </span>
                    </div>
                  </div>

                  {/* Title & Metal */}
                  <h3 className="font-serif text-base font-bold text-[#4D2300] group-hover:text-[#CC5500] transition-colors leading-snug">
                    {lang === 'kn' ? item.nameKn : item.nameEn}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium -mt-0.5 mb-2">
                    {lang === 'kn' ? item.nameEn : item.nameKn}
                  </p>

                  {/* Metal Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.material === 'Copper' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : item.material.includes('Kansa')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : item.material.includes('Gold') || item.material.includes('Silver')
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                    }`}>
                      {lang === 'kn' ? item.materialKn : item.material}
                    </span>

                    <span className="text-[10px] text-gray-400 font-medium">
                      {lang === 'kn' ? item.categoryNameKn : item.categoryNameEn}
                    </span>
                  </div>

                  {/* Size Specs Pill */}
                  <div className="bg-[#FFF9F2] p-2.5 rounded-xl border border-[#FFCC99]/40 mb-3 space-y-1">
                    <span className="text-[10px] text-[#994700] uppercase font-bold tracking-wider block">
                      {lang === 'kn' ? 'ಲಭ್ಯವಿರುವ ಅಳತೆಗಳು:' : 'Available Sizes:'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#4D2300] block">
                      {item.sizes}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {lang === 'kn' ? item.descriptionKn : item.descriptionEn}
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-3 border-t border-[#FFCC99]/40 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">{lang === 'kn' ? 'ಅಂದಾಜು ಬೆಲೆ:' : 'Est. Price:'}</span>
                    <span className="text-base font-bold font-mono text-[#CC5500]">
                      ₹{item.priceEstimate || 450} <span className="text-[10px] text-gray-400 font-normal">{lang === 'kn' ? 'ಪ್ರಾರಂಭಿಕ' : 'onwards'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddItemToCart(item)}
                      className="w-full py-2 bg-[#CC5500] hover:bg-[#A34400] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    >
                      {addedItemCode === item.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{lang === 'kn' ? 'ಸೇರಿಸಲಾಗಿದೆ!' : 'Added!'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಖರೀದಿಸಿ' : 'Add to Cart'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleWhatsAppEnquiry(item)}
                      className="w-full py-2 bg-[#FFF0E0] hover:bg-[#FFE0CC] text-[#994700] border border-[#FFCC99] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#128C7E]" />
                      <span>{lang === 'kn' ? 'ವಿಚಾರಿಸಿ' : 'Enquire'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#FFCC99] p-8 max-w-lg mx-auto space-y-4">
            <Search className="w-12 h-12 text-[#CC5500] mx-auto opacity-40" />
            <h3 className="font-serif text-xl font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಯಾವುದೇ ಸಾಮಗ್ರಿ ಕಂಡುಬಂದಿಲ್ಲ' : 'No Catalog Items Found'}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === 'kn'
                ? 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಕೋಡ್ ಅಥವಾ ಹೆಸರನ್ನು ಬದಲಾಯಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
                : 'Please check your search term or select a different metal/category filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedMaterial('all');
              }}
              className="px-4 py-2 bg-[#CC5500] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {lang === 'kn' ? 'ಎಲ್ಲಾ ಪರಿಕರಗಳನ್ನು ತೋರಿಸು' : 'Reset All Filters'}
            </button>
          </div>
        )}

        {/* Wholesale & Custom Temple Orders Banner */}
        <section className="mt-14 bg-gradient-to-r from-[#4A1500] to-[#7A2800] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#FFD700]/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] font-mono text-xs font-bold rounded-full uppercase">
              {lang === 'kn' ? 'ದೇವಸ್ಥಾನ & ಸಗಟು ಪೂರೈಕೆ' : 'Temple & Wholesale Bulk Orders'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#FFF0E0]">
              {lang === 'kn' ? 'ದೇವಸ್ಥಾನಗಳಿಗೆ ಭಾರಿ ತೂಕದ ಬೆಲ್, ಸಮೈ & ಕಳಸ ಆರ್ಡರ್ ಮಾಡಬೇಕೆ?' : 'Need 150kg Temple Bells, 5ft Samai or Gopura Kalash?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#FFCC99] max-w-xl">
              {lang === 'kn'
                ? 'ಧಾರ್ಮಿಕ ದತ್ತಿ ಇಲಾಖೆ, ಮಠ-ಮಾನ್ಯಗಳು ಹಾಗೂ ದೇವಸ್ಥಾನಗಳ ಜೀರ್ಣೋದ್ಧಾರಕ್ಕೆ ಬೇಕಾಗುವ ಎಲ್ಲಾ ಪೂಜಾ ಪರಿಕರಗಳನ್ನು ರಫ್ತು ಗುಣಮಟ್ಟದಲ್ಲಿ ಸಗಟು ದರದಲ್ಲಿ ಪೂರೈಸುತ್ತೇವೆ.'
                : 'Direct manufacture for temples, mutts, and trusts. Custom engraving, weight specifications, and doorstep delivery across Karnataka & India.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://wa.me/919448123456?text=Namaste,%20I%20am%20looking%20for%20a%20bulk/temple%20order%20from%20the%20Pooja%20Materials%20Catalogue."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#00ED64] hover:bg-[#00c954] text-[#001E2B] font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಸಗಟು ಆರ್ಡರ್ (WhatsApp)' : 'Wholesale Inquiry'}</span>
            </a>

            <button
              onClick={onBookPurohit}
              className="px-6 py-3 bg-[#FF6A00] hover:bg-[#e05d00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'kn' ? 'ಪುರೋಹಿತರನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'Consult Purohit'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

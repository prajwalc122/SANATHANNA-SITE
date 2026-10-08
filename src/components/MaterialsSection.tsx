import React, { useState, useMemo } from 'react';
import { Language, MaterialCategory, MaterialItem } from '../types';
import { POOJA_MATERIALS, CATEGORY_INFO, POOJA_MATERIALS_BANNER } from '../data/poojaData';
import { Search, ShoppingBag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { templeAudio } from '../utils/audioChant';

interface MaterialsSectionProps {
  lang: Language;
  onAddToCart: (item: MaterialItem) => void;
  onViewItemDetails: (item: MaterialItem) => void;
  selectedItemIds: Set<string>;
  onOpenCheckout: () => void;
  onOpenCart: () => void;
  materials?: MaterialItem[];
}

export const MaterialsSection: React.FC<MaterialsSectionProps> = ({
  lang,
  onAddToCart,
  onViewItemDetails,
  selectedItemIds,
  onOpenCheckout,
  onOpenCart,
  materials = POOJA_MATERIALS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.nameKn.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        (item.descriptionKn && item.descriptionKn.toLowerCase().includes(q)) ||
        (item.descriptionEn && item.descriptionEn.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const selectedMaterialsList = useMemo(() => {
    return materials.filter((item) => selectedItemIds.has(item.id));
  }, [materials, selectedItemIds]);

  const selectedTotal = selectedMaterialsList.reduce((sum, item) => sum + item.price, 0);

  const handleSelect = (item: MaterialItem) => {
    onAddToCart(item);
    templeAudio.playTempleBell();
  };

  return (
    <section id="materials" className="py-12 sm:py-16 bg-transparent min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00] bg-white/80 px-3 py-1 rounded-full border border-[#FFCC99] backdrop-blur-sm shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಪೂಜಾ ದ್ರವ್ಯ ಭಂಡಾರ' : 'Essential Pooja Materials Store'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4D2300]">
            {lang === 'kn'
              ? 'ಪೂಜೆ ಮತ್ತು ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶುದ್ಧ ಸಾಮಗ್ರಿಗಳು'
              : 'Pure Materials for Poojas & Sacred Events'}
          </h2>

          <p className="text-xs sm:text-sm text-[#994700] leading-relaxed">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಪೂಜೆಗೆ ಬೇಕಾದ ಸಾತ್ವಿಕ ಮತ್ತು ಶುದ್ಧ ಸಾಮಗ್ರಿಗಳನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಿ ಆಯ್ಕೆ ಮಾಡಿ.'
              : 'Easily browse and select pure, sacred materials for your pooja rituals.'}
          </p>
        </div>

        {/* Suitable Materials Visual Showcase Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border-2 border-[#FFCC99] shadow-md bg-gradient-to-r from-[#FFF5EB] via-[#FFF9F2] to-[#FFE8D1]">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-7 p-6 sm:p-8 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FF6A00] text-white shadow-2xs">
                {lang === 'kn' ? 'ಶುದ್ಧ ವೈದಿಕ ಸಾಮಗ್ರಿಗಳು' : 'Authentic Vedic Materials'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4D2300] leading-tight">
                {lang === 'kn'
                  ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜಾ ದ್ರವ್ಯಗಳು & ಪರಿಪೂರ್ಣ ಕಿಟ್'
                  : 'Sacred Ritual Ingredients & Complete Pooja Kits'}
              </h3>
              <p className="text-xs sm:text-sm text-[#8C4700] leading-relaxed max-w-xl">
                {lang === 'kn'
                  ? 'ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಅಕ್ಷತೆ, ಸಮಿತ್ತು, ಕಳಸ, ಮೋದಕ ಹಾಗೂ ಹೋಮ ದ್ರವ್ಯಗಳು — 100% ಶುದ್ಧತೆ, ಕಲಬೆರಕೆ ರಹಿತ ಮತ್ತು ದೇವತಾ ಆರಾಧನೆಗೆ ಪ್ರಶಸ್ತ.'
                  : 'Turmeric, Kumkum, Sandalwood, Akshata, Samithu, Kalash, and Homa dravyas — 100% unadulterated, certified pure and energized for divine rituals.'}
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-semibold text-[#802B00]">
                <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-[#FFCC99]">
                  <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {lang === 'kn' ? '100% ಸಾತ್ವಿಕ ಶುದ್ಧತೆ' : '100% Sattvic Purity'}
                </span>
                <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-[#FFCC99]">
                  <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {lang === 'kn' ? 'ವೇದ ಶಾಸ್ತ್ರ ಸಮ್ಮತ' : 'Scripturally Sanctioned'}
                </span>
                <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-[#FFCC99]">
                  <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {lang === 'kn' ? 'ಮನೆ ಬಾಗಿಲಿಗೆ ವಿತರಣೆ' : 'Doorstep Delivery'}
                </span>
              </div>
            </div>
            <div className="md:col-span-5 aspect-[16/10] md:h-full relative overflow-hidden min-h-[220px]">
              <img
                src={POOJA_MATERIALS_BANNER}
                alt={lang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು' : 'Suitable Pooja Materials'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#FFF5EB] via-transparent to-transparent md:w-24 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 items-center">
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-[#994700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'kn'
                  ? 'ಸಾಮಗ್ರಿ ಹುಡುಕಿ... ಉದಾ: ಅರಿಶಿನ, ತುಪ್ಪ, ಕಮಲ, ಕರ್ಪೂರ'
                  : 'Search items... e.g. Turmeric, Ghee, Lotus, Camphor'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] placeholder-[#B37A4C] outline-none focus:border-[#FF6A00]"
            />
          </div>

          <div className="md:col-span-5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MaterialCategory)}
              className="w-full px-3 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-xs font-semibold text-[#4D2300] outline-none focus:border-[#FF6A00] cursor-pointer"
            >
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {lang === 'kn' ? info.kn : info.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between bg-[#FFE5CC]/50 border border-[#FFCC99] rounded-xl px-4 py-2 mb-6 text-xs text-[#994700]">
          <span className="font-bold text-[#4D2300] tabular-nums">
            {filteredMaterials.length} {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು ಲಭ್ಯ' : 'Materials Available'}
          </span>
          <span className="text-[11px] hidden sm:inline">
            {lang === 'kn' ? 'ಚಿತ್ರದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ವಿವರ ಪರಿಶೀಲಿಸಿ' : 'Click card or image for ritual significance'}
          </span>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="py-14 text-center bg-white rounded-2xl border border-[#FFCC99] p-6 space-y-2">
            <span className="text-3xl block">🔎</span>
            <h3 className="font-serif text-base font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಸಾಮಗ್ರಿ ಕಂಡುಬಂದಿಲ್ಲ' : 'Item Not Found'}
            </h3>
            <p className="text-xs text-[#994700]">
              {lang === 'kn' ? 'ಬೇರೆ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ ಅಥವಾ ಎಲ್ಲಾ ವಿಭಾಗಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.' : 'Try searching with a different keyword or reset category.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 bg-[#FF6A00] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              {lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ತೋರಿಸಿ' : 'Show All Items'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMaterials.map((item) => {
              const isSelected = selectedItemIds.has(item.id);
              const catInfo = CATEGORY_INFO[item.category];

              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col justify-between bg-white/92 backdrop-blur-md rounded-xl border overflow-hidden transition-all duration-200 ${
                    isSelected
                      ? 'border-[#FF6A00] ring-1 ring-[#FF6A00] shadow-sm'
                      : 'border-[#FFCC99] hover:border-[#FF6A00] hover:shadow-xs'
                  }`}
                >
                  {/* Card Image Slot according to tags & item */}
                  <div
                    onClick={() => onViewItemDetails(item)}
                    className="relative aspect-[4/3] bg-[#FFF8F2] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image || catInfo.image}
                      alt={item.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#994700] mb-1">
                        <span className="text-xs">{catInfo?.icon || '🪔'}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                          {lang === 'kn' ? item.categoryLabelKn : item.categoryLabelEn}
                        </span>
                      </div>

                      <h3 
                        onClick={() => onViewItemDetails(item)}
                        className="font-serif text-base font-bold text-[#4D2300] leading-snug line-clamp-1 cursor-pointer group-hover:text-[#FF6A00] transition-colors"
                      >
                        {lang === 'kn' ? item.nameKn : item.nameEn}
                      </h3>

                      <p className="text-[11px] text-[#8C4700] line-clamp-1 mt-0.5 leading-relaxed">
                        {lang === 'kn' ? item.descriptionKn : item.descriptionEn}
                      </p>
                    </div>

                    {/* Qty & Price Row */}
                    <div className="mt-3 pt-2.5 border-t border-[#FFE5CC] flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] text-[#994700]">
                          {lang === 'kn' ? 'ಪ್ರಮಾಣ' : 'Qty'}
                        </span>
                        <strong className="text-[11px] font-semibold text-[#4D2300]">
                          {lang === 'kn' ? item.unitKn : item.unitEn}
                        </strong>
                      </div>

                      <div className="text-right">
                        <span className="block text-[9px] text-[#994700]">
                          {lang === 'kn' ? 'ಬೆಲೆ' : 'Price'}
                        </span>
                        <strong className="font-serif text-base font-bold text-[#CC5500] tabular-nums">
                          ₹{item.price}
                        </strong>
                      </div>
                    </div>

                    {/* Add to Bag Button */}
                    <div className="mt-3">
                      <button
                        onClick={() => handleSelect(item)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'bg-[#2D5A27] text-white hover:bg-[#23471F]'
                            : 'bg-[#FF6A00] text-white hover:bg-[#CC5500]'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ಆಯ್ಕೆಯಾಗಿದೆ ✓' : 'Selected ✓'}</span>
                          </>
                        ) : (
                          <>
                            <span>+</span>
                            <span>{lang === 'kn' ? 'ಆಯ್ಕೆ ಮಾಡಿ' : 'Add to Bag'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Materials Panel */}
        {selectedMaterialsList.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl border-2 border-[#FF6A00] p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFE5CC] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#FF6A00] font-bold block">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಆಯ್ಕೆ' : 'Your Selected Items'}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                  {lang === 'kn' ? 'ಆಯ್ಕೆ ಮಾಡಿದ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು' : 'Selected Pooja Materials'}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-[#FFE5CC] text-[#994700] font-bold px-3 py-1 rounded-full">
                  {selectedMaterialsList.length} {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು' : 'items'}
                </span>
                <span className="font-serif text-xl font-bold text-[#CC5500] tabular-nums">
                  ₹{selectedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="py-4 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {selectedMaterialsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFF8F2] border border-[#FFCC99] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-[#4D2300]"
                >
                  <span className="font-semibold">{lang === 'kn' ? item.nameKn : item.nameEn}</span>
                  <span className="text-[10px] text-[#994700] tabular-nums">
                    (₹{item.price})
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#FFE5CC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onOpenCart}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#FFF0E0] border border-[#FFCC99] text-[#994700] hover:text-[#4D2300] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#FF6A00]" />
                <span>{lang === 'kn' ? 'ಸಂಪೂರ್ಣ ಚೀಲ ಪರಿಶೀಲಿಸಿ' : 'Review in Bag'}</span>
              </button>

              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>
                  {lang === 'kn'
                    ? `ಆಯ್ಕೆ ಮಾಡಿದ ಸಾಮಗ್ರಿಗಳಿಗಾಗಿ ಪಾವತಿಸಿ (₹${selectedTotal}) →`
                    : `Checkout with Gateway (₹${selectedTotal}) →`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

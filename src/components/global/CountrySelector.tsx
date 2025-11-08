import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface CountryOption {
  code: string;
  name: string;
  // 为了支持中英繁搜索，添加各语言的名称
  searchNames: string[];
}

interface CountrySelectorProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  label: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  name,
  value,
  onChange,
  error,
  required = false,
  label
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  
  // 限制加密货币服务的国家/地区列表（需要排除）
  const restrictedCountries = [
    'kp', // 朝鲜
    'cu', // 古巴
    'ir', // 伊朗
    'sy', // 叙利亚
    'ua', // 乌克兰
    'qa', // 卡塔尔
    'eg', // 埃及
    'af', // 阿富汗
    'dz', // 阿尔及利亚
    'bd', // 孟加拉国
    'iq', // 伊拉克
    'ma', // 摩洛哥
    'np', // 尼泊尔
    'mk', // 北马其顿
    'tn', // 突尼斯
    'mm', // 缅甸
  ];
  
  // 定义国家列表，包含更多国家/地区，并添加香港、中国台湾省、澳门
  const allCountries: CountryOption[] = [
    { code: 'cn', name: t('institutionalAuth.countries.cn'), searchNames: ['China', '中国', '中國'] },
    { code: 'us', name: t('institutionalAuth.countries.us'), searchNames: ['United States', 'USA', '美国', '美國'] },
    { code: 'uk', name: t('institutionalAuth.countries.uk'), searchNames: ['United Kingdom', 'UK', '英国', '英國'] },
    { code: 'jp', name: t('institutionalAuth.countries.jp'), searchNames: ['Japan', '日本', '日本'] },
    { code: 'sg', name: t('institutionalAuth.countries.sg'), searchNames: ['Singapore', '新加坡', '新加坡'] },
    { code: 'hk', name: t('institutionalAuth.countries.hk'), searchNames: ['Hong Kong', '香港', '香港'] },
    { code: 'tw', name: t('institutionalAuth.countries.tw'), searchNames: ['Taiwan', '中国台湾省', '中國台灣省'] },
    { code: 'mo', name: t('institutionalAuth.countries.mo'), searchNames: ['Macau', '澳门', '澳門'] },
    { code: 'au', name: t('institutionalAuth.countries.au'), searchNames: ['Australia', '澳大利亚', '澳大利亞'] },
    { code: 'ca', name: t('institutionalAuth.countries.ca'), searchNames: ['Canada', '加拿大', '加拿大'] },
    { code: 'de', name: t('institutionalAuth.countries.de'), searchNames: ['Germany', '德国', '德國'] },
    { code: 'fr', name: t('institutionalAuth.countries.fr'), searchNames: ['France', '法国', '法國'] },
    { code: 'it', name: t('institutionalAuth.countries.it'), searchNames: ['Italy', '意大利', '意大利'] },
    { code: 'es', name: t('institutionalAuth.countries.es'), searchNames: ['Spain', '西班牙', '西班牙'] },
    { code: 'ch', name: t('institutionalAuth.countries.ch'), searchNames: ['Switzerland', '瑞士', '瑞士'] },
    { code: 'se', name: t('institutionalAuth.countries.se'), searchNames: ['Sweden', '瑞典', '瑞典'] },
    { code: 'ru', name: t('institutionalAuth.countries.ru'), searchNames: ['Russia', '俄罗斯', '俄羅斯'] },
    { code: 'br', name: t('institutionalAuth.countries.br'), searchNames: ['Brazil', '巴西', '巴西'] },
    { code: 'mx', name: t('institutionalAuth.countries.mx'), searchNames: ['Mexico', '墨西哥', '墨西哥'] },
    { code: 'in', name: t('institutionalAuth.countries.in'), searchNames: ['India', '印度', '印度'] },
    { code: 'id', name: t('institutionalAuth.countries.id'), searchNames: ['Indonesia', '印度尼西亚', '印度尼西亞'] },
    { code: 'th', name: t('institutionalAuth.countries.th'), searchNames: ['Thailand', '泰国', '泰國'] },
    { code: 'vn', name: t('institutionalAuth.countries.vn'), searchNames: ['Vietnam', '越南', '越南'] },
    { code: 'kr', name: t('institutionalAuth.countries.kr'), searchNames: ['South Korea', '韩国', '韓國'] },
    { code: 'no', name: t('institutionalAuth.countries.no'), searchNames: ['Norway', '挪威', '挪威'] },
    { code: 'fi', name: t('institutionalAuth.countries.fi'), searchNames: ['Finland', '芬兰', '芬蘭'] },
    { code: 'nl', name: t('institutionalAuth.countries.nl'), searchNames: ['Netherlands', '荷兰', '荷蘭'] },
    { code: 'be', name: t('institutionalAuth.countries.be'), searchNames: ['Belgium', '比利时', '比利時'] },
    { code: 'at', name: t('institutionalAuth.countries.at'), searchNames: ['Austria', '奥地利', '奧地利'] },
    { code: 'pl', name: t('institutionalAuth.countries.pl'), searchNames: ['Poland', '波兰', '波蘭'] },
    { code: 'tr', name: t('institutionalAuth.countries.tr'), searchNames: ['Turkey', '土耳其', '土耳其'] },
    { code: 'sa', name: t('institutionalAuth.countries.sa'), searchNames: ['Saudi Arabia', '沙特阿拉伯', '沙烏地阿拉伯'] },
    { code: 'ae', name: t('institutionalAuth.countries.ae'), searchNames: ['United Arab Emirates', 'UAE', '阿联酋', '阿聯酋'] },
    { code: 'kw', name: t('institutionalAuth.countries.kw'), searchNames: ['Kuwait', '科威特', '科威特'] },
    { code: 'bh', name: t('institutionalAuth.countries.bh'), searchNames: ['Bahrain', '巴林', '巴林'] },
    { code: 'om', name: t('institutionalAuth.countries.om'), searchNames: ['Oman', '阿曼', '阿曼'] },
    { code: 'il', name: t('institutionalAuth.countries.il'), searchNames: ['Israel', '以色列', '以色列'] },
    { code: 'za', name: t('institutionalAuth.countries.za'), searchNames: ['South Africa', '南非', '南非'] },
  ];

  // 过滤掉限制国家，并根据搜索词过滤
  const filteredCountries = allCountries
    .filter(country => !restrictedCountries.includes(country.code))
    .filter(country => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return country.searchNames.some(name => 
        name.toLowerCase().includes(searchLower)
      );
    });

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    setShowDropdown(false);
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label 
        className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* 搜索输入框 */}
      <input
        type="text"
        placeholder={t('institutionalAuth.searchCountries')}
        value={searchTerm}
        onChange={handleSearchChange}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] mb-2 ${  
          isDarkMode 
            ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
            : 'border-[#EDEEF3] bg-white'
        }`}
      />
      
      {/* 下拉选择器 */}
      <div className="relative">
        <select
          ref={selectRef}
          name={name}
          value={value}
          onChange={handleSelectChange}
          required={required}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] appearance-none ${  
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${error ? 'border-red-500' : ''}`}
          onClick={handleDropdownToggle}
        >
          <option value="">{t('institutionalAuth.selectOption')}</option>
          {filteredCountries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        
        {/* 下拉箭头 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke={isDarkMode ? "#FFFFFF" : "#1C1C1C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default CountrySelector;
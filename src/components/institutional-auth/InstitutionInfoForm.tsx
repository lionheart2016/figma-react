import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface InstitutionInfoFormData {
  institutionName: string;
  registrationNumber: string;
  incorporationDate: string;
  businessType: string;
  industry: string;
  website: string;
  phoneNumber: string;
  email: string;
}

interface FormErrors {
  institutionName?: string;
  registrationNumber?: string;
  incorporationDate?: string;
  businessType?: string;
  industry?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
}

const InstitutionInfoForm: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState<InstitutionInfoFormData>({
    institutionName: '',
    registrationNumber: '',
    incorporationDate: '',
    businessType: '',
    industry: '',
    website: '',
    phoneNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const businessTypes = [
    { value: 'corporation', label: t('institutionalAuth.businessTypes.corporation') },
    { value: 'llc', label: t('institutionalAuth.businessTypes.llc') },
    { value: 'partnership', label: t('institutionalAuth.businessTypes.partnership') },
    { value: 'sole_proprietorship', label: t('institutionalAuth.businessTypes.soleProprietorship') },
    { value: 'non_profit', label: t('institutionalAuth.businessTypes.nonProfit') },
    { value: 'government', label: t('institutionalAuth.businessTypes.government') },
    { value: 'other', label: t('institutionalAuth.businessTypes.other') }
  ];

  const industries = [
    { value: 'finance', label: t('institutionalAuth.industries.finance') },
    { value: 'technology', label: t('institutionalAuth.industries.technology') },
    { value: 'healthcare', label: t('institutionalAuth.industries.healthcare') },
    { value: 'manufacturing', label: t('institutionalAuth.industries.manufacturing') },
    { value: 'retail', label: t('institutionalAuth.industries.retail') },
    { value: 'real_estate', label: t('institutionalAuth.industries.realEstate') },
    { value: 'energy', label: t('institutionalAuth.industries.energy') },
    { value: 'other', label: t('institutionalAuth.industries.other') }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除对应字段的错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 机构名称验证
    if (!formData.institutionName.trim()) {
      newErrors.institutionName = t('institutionalAuth.validation.institutionNameRequired');
    } else if (formData.institutionName.length < 2) {
      newErrors.institutionName = t('institutionalAuth.validation.institutionNameMinLength');
    }

    // 注册号验证
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = t('institutionalAuth.validation.registrationNumberRequired');
    }

    // 成立日期验证
    if (!formData.incorporationDate) {
      newErrors.incorporationDate = t('institutionalAuth.validation.incorporationDateRequired');
    } else {
      const incorporationDate = new Date(formData.incorporationDate);
      const today = new Date();
      if (incorporationDate > today) {
        newErrors.incorporationDate = t('institutionalAuth.validation.incorporationDateFuture');
      }
    }

    // 业务类型验证
    if (!formData.businessType) {
      newErrors.businessType = t('institutionalAuth.validation.businessTypeRequired');
    }

    // 行业验证
    if (!formData.industry) {
      newErrors.industry = t('institutionalAuth.validation.industryRequired');
    }

    // 网站验证
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = t('institutionalAuth.validation.websiteInvalid');
    }

    // 电话号码验证
    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('institutionalAuth.validation.phoneNumberInvalid');
    }

    // 邮箱验证
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('institutionalAuth.validation.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="institution-info-form">
      <form className="space-y-6">
        {/* 机构基本信息 */}
        <div className="form-section">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('institutionalAuth.institutionInfo.basicInfo')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 机构名称 */}
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.institutionName')} *
              </label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.institutionName ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.institutionInfo.institutionNamePlaceholder')}
              />
              {errors.institutionName && (
                <p className="text-red-500 text-xs mt-1">{errors.institutionName}</p>
              )}
            </div>

            {/* 注册号 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.registrationNumber')} *
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.registrationNumber ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.institutionInfo.registrationNumberPlaceholder')}
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>
              )}
            </div>

            {/* 成立日期 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.incorporationDate')} *
              </label>
              <input
                type="date"
                name="incorporationDate"
                value={formData.incorporationDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.incorporationDate ? 'border-red-500' : ''}`}
              />
              {errors.incorporationDate && (
                <p className="text-red-500 text-xs mt-1">{errors.incorporationDate}</p>
              )}
            </div>

            {/* 业务类型 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.businessType')} *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.businessType ? 'border-red-500' : ''}`}
              >
                <option value="">{t('institutionalAuth.selectOption')}</option>
                {businessTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>
              )}
            </div>

            {/* 行业 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.industry')} *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.industry ? 'border-red-500' : ''}`}
              >
                <option value="">{t('institutionalAuth.selectOption')}</option>
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
              )}
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="form-section">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('institutionalAuth.institutionInfo.contactInfo')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 网站 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.website')}
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.website ? 'border-red-500' : ''}`}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
            </div>

            {/* 电话号码 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.phoneNumber')}
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* 邮箱 */}
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.email ? 'border-red-500' : ''}`}
                placeholder="contact@institution.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstitutionInfoForm;
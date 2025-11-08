import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import CountrySelector from '../global/CountrySelector';

export interface InstitutionInfoFormData {
  institutionName: string;
  incorporationDate: string;
  // 替换industry为businessNature
  businessNature: string;
  // 新增字段
  registeredCountry: string;
  taxNumber: string;
  fundingSource: string;
  leiCode: string;
  website: string;
  phoneNumber: string;
  email: string;
}

interface FormErrors {
  institutionName?: string;
  incorporationDate?: string;
  // 替换industry为businessNature
  businessNature?: string;
  // 新增字段错误
  registeredCountry?: string;
  taxNumber?: string;
  fundingSource?: string;
  leiCode?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
}

interface InstitutionInfoFormProps {
  onSubmit: (data: InstitutionInfoFormData) => void;
  initialData?: Partial<InstitutionInfoFormData>;
}

const InstitutionInfoForm: React.FC<InstitutionInfoFormProps> = ({ 
  onSubmit, 
  initialData = {} 
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // 表单数据状态 - 添加默认测试数据以便测试
  const [formData, setFormData] = useState<InstitutionInfoFormData>({
    institutionName: initialData.institutionName || '测试机构有限公司',
    incorporationDate: initialData.incorporationDate || '2020-01-01',
    // 替换industry为businessNature
    businessNature: initialData.businessNature || '11', // 金融及保险活动
    // 新增字段
    registeredCountry: initialData.registeredCountry || 'CN',
    taxNumber: initialData.taxNumber || '91110105MA00H62P3F',
    fundingSource: initialData.fundingSource || '公司自有资金',
    leiCode: initialData.leiCode || '5493001XPQ4C557DZZ90',
    website: initialData.website || '',
    phoneNumber: initialData.phoneNumber || '',
    email: initialData.email || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});




  
  // 业务性质列表 - 基于香港标准行业分类2.0
  const businessNatures = [
    { value: '1', label: t('institutionalAuth.businessNatures.agriculture') },
    { value: '2', label: t('institutionalAuth.businessNatures.mining') },
    { value: '3', label: t('institutionalAuth.businessNatures.manufacturing') },
    { value: '4', label: t('institutionalAuth.businessNatures.energy') },
    { value: '5', label: t('institutionalAuth.businessNatures.water') },
    { value: '6', label: t('institutionalAuth.businessNatures.construction') },
    { value: '7', label: t('institutionalAuth.businessNatures.trade') },
    { value: '8', label: t('institutionalAuth.businessNatures.transportation') },
    { value: '9', label: t('institutionalAuth.businessNatures.accommodation') },
    { value: '10', label: t('institutionalAuth.businessNatures.ict') },
    { value: '11', label: t('institutionalAuth.businessNatures.finance') },
    { value: '12', label: t('institutionalAuth.businessNatures.realEstate') },
    { value: '13', label: t('institutionalAuth.businessNatures.professional') },
    { value: '14', label: t('institutionalAuth.businessNatures.administrative') },
    { value: '15', label: t('institutionalAuth.businessNatures.publicAdmin') },
    { value: '16', label: t('institutionalAuth.businessNatures.education') },
    { value: '17', label: t('institutionalAuth.businessNatures.healthcare') },
    { value: '18', label: t('institutionalAuth.businessNatures.arts') },
    { value: '19', label: t('institutionalAuth.businessNatures.otherServices') },
    { value: '20', label: t('institutionalAuth.businessNatures.householdActivities') },
    { value: '21', label: t('institutionalAuth.businessNatures.extraTerritorial') }
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
        [name]: undefined
      }));
    }
  };

  // 表单验证函数
  const validateForm = (): boolean => {
    console.log('开始验证表单，数据:', formData);
    // 重置错误状态
    const newErrors: FormErrors = {};
    
    // 机构名称验证
    if (!formData.institutionName.trim()) {
      newErrors.institutionName = t('institutionalAuth.validation.institutionNameRequired');
    } else if (formData.institutionName.length < 2) {
      newErrors.institutionName = t('institutionalAuth.validation.institutionNameMinLength');
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
    

    
    // 业务性质验证
    if (!formData.businessNature || formData.businessNature === '') {
      newErrors.businessNature = t('institutionalAuth.validation.businessNatureRequired');
    }
    
    // 注册国家/地区验证
    if (!formData.registeredCountry || formData.registeredCountry === '') {
      newErrors.registeredCountry = t('institutionalAuth.validation.registeredCountryRequired');
    }
    
    // 税务编号验证
    if (!formData.taxNumber.trim()) {
      newErrors.taxNumber = t('institutionalAuth.validation.taxNumberRequired');
    }
    
    // 资金来源验证
    if (!formData.fundingSource.trim()) {
      newErrors.fundingSource = t('institutionalAuth.validation.fundingSourceRequired');
    } else if (formData.fundingSource.length > 1024) {
      newErrors.fundingSource = t('institutionalAuth.validation.fundingSourceTooLong');
    }
    
    // LEI编码验证
    if (!formData.leiCode.trim()) {
      newErrors.leiCode = t('institutionalAuth.validation.leiCodeRequired');
    } else if (formData.leiCode.length !== 20) {
      newErrors.leiCode = t('institutionalAuth.validation.leiCodeLength');
    } else if (!/^[A-Z0-9]+$/.test(formData.leiCode.toUpperCase())) {
      newErrors.leiCode = t('institutionalAuth.validation.leiCodeInvalid');
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
    
    // 更新错误状态
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log('验证结果:', { isValid, errors: newErrors });
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('表单提交被触发');
    
    // 触发表单验证
    const isValid = validateForm();
    console.log('表单验证结果:', isValid);
    console.log('当前表单数据:', formData);
    console.log('onSubmit函数是否存在:', !!onSubmit);
    
    if (isValid) {
      console.log('准备调用onSubmit函数');
      // 如果表单验证通过，调用外部传入的onSubmit回调
      onSubmit(formData);
    } else {
      console.log('表单验证失败，滚动到第一个错误字段');
      // 滚动到第一个错误字段
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        console.log('找到错误字段，开始滚动');
        (firstErrorField as HTMLElement).scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        (firstErrorField as HTMLInputElement | HTMLSelectElement).focus();
      } else {
        console.log('未找到错误字段');
      }
    }
  };

  return (
    <div className="institution-info-form">
      <form 
        className="space-y-6" 
        onSubmit={handleSubmit}
        noValidate
      >
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
              <div className="relative">
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                    isDarkMode 
                      ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                      : 'border-[#EDEEF3] bg-white'
                  } ${errors.institutionName ? 'border-red-500' : ''}`}
                  placeholder={t('institutionalAuth.institutionInfo.institutionNamePlaceholder')}
                />
                {formData.institutionName && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, institutionName: '' }))}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm p-1 rounded-full ${
                      isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="清空字段"
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.institutionName && (
                <p className="text-red-500 text-xs mt-1">{errors.institutionName}</p>
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
                required
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

            {/* 注册国家/地区 */}
            <div>
              <CountrySelector
                name="registeredCountry"
                value={formData.registeredCountry}
                onChange={handleInputChange}
                error={errors.registeredCountry}
                required
                label={t('institutionalAuth.institutionInfo.registeredCountry')}
              />
            </div>

            {/* 业务性质 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.businessNature')} *
              </label>
              <select
                name="businessNature"
                value={formData.businessNature}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.businessNature ? 'border-red-500' : ''}`}
              >
                <option value="">{t('institutionalAuth.selectOption')}</option>
                {businessNatures.map(nature => (
                  <option key={nature.value} value={nature.value}>
                    {nature.label}
                  </option>
                ))}
              </select>
              {errors.businessNature && (
                <p className="text-red-500 text-xs mt-1">{errors.businessNature}</p>
              )}
            </div>
          </div>
        </div>

        {/* 税务与资金信息 */}
        <div className="form-section">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('institutionalAuth.institutionInfo.taxAndFundingInfo')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 税务编号 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.taxNumber')} *
              </label>
              <input
                type="text"
                name="taxNumber"
                value={formData.taxNumber}
                onChange={handleInputChange}
                maxLength={128}
                required
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.taxNumber ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.institutionInfo.taxNumberPlaceholder')}
              />
              {errors.taxNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.taxNumber}</p>
              )}
            </div>

            {/* 全球法人识别编码（LEI） */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.leiCode')} *
              </label>
              <input
                type="text"
                name="leiCode"
                value={formData.leiCode}
                onChange={handleInputChange}
                maxLength={20}
                required
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.leiCode ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.institutionInfo.leiCodePlaceholder')}
              />
              {errors.leiCode && (
                <p className="text-red-500 text-xs mt-1">{errors.leiCode}</p>
              )}
            </div>

            {/* 资金来源 */}
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.institutionInfo.fundingSource')} *
              </label>
              <input
                type="text"
                name="fundingSource"
                value={formData.fundingSource}
                onChange={handleInputChange}
                maxLength={1024}
                required
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.fundingSource ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.institutionInfo.fundingSourcePlaceholder')}
              />
              {errors.fundingSource && (
                <p className="text-red-500 text-xs mt-1">{errors.fundingSource}</p>
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


          </div>
        </div>
      </form>
    </div>
  );
};

export default InstitutionInfoForm;
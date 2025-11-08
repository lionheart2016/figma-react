import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import CountrySelector from '../global/CountrySelector';

interface AddressInfoFormData {
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  isSameAsRegistered: boolean;
  registeredCountry: string;
  registeredState: string;
  registeredCity: string;
  registeredPostalCode: string;
  registeredAddressLine1: string;
}

interface FormErrors {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  addressLine1?: string;
  registeredCountry?: string;
  registeredState?: string;
  registeredCity?: string;
  registeredPostalCode?: string;
  registeredAddressLine1?: string;
}

const AddressInfoForm: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState<AddressInfoFormData>({
    country: '',
    state: '',
    city: '',
    postalCode: '',
    addressLine1: '',
    isSameAsRegistered: true,
    registeredCountry: '',
    registeredState: '',
    registeredCity: '',
    registeredPostalCode: '',
    registeredAddressLine1: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // 如果勾选了"与注册地址相同"，则同步地址信息
    if (name === 'isSameAsRegistered' && (e.target as HTMLInputElement).checked) {
      setFormData(prev => ({
        ...prev,
        registeredCountry: prev.country,
        registeredState: prev.state,
        registeredCity: prev.city,
        registeredPostalCode: prev.postalCode,
        registeredAddressLine1: prev.addressLine1
      }));
    }

    // 清除对应字段的错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 处理字段失去焦点时的验证
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    const newErrors: FormErrors = {};
    
    // 对当前字段进行验证
    switch (name) {
      case 'country':
        if (!formData.country) {
          newErrors.country = t('institutionalAuth.validation.countryRequired');
        }
        break;
      case 'state':
        if (!formData.state) {
          newErrors.state = t('institutionalAuth.validation.stateRequired');
        }
        break;
      case 'city':
        if (!formData.city) {
          newErrors.city = t('institutionalAuth.validation.cityRequired');
        }
        break;
      case 'postalCode':
        if (!formData.postalCode) {
          newErrors.postalCode = t('institutionalAuth.validation.postalCodeRequired');
        }
        break;
      case 'addressLine1':
        if (!formData.addressLine1.trim()) {
          newErrors.addressLine1 = t('institutionalAuth.validation.addressLine1Required');
        }
        break;
      case 'registeredCountry':
        if (!formData.isSameAsRegistered && !formData.registeredCountry) {
          newErrors.registeredCountry = t('institutionalAuth.validation.registeredCountryRequired');
        }
        break;
      case 'registeredState':
        if (!formData.isSameAsRegistered && !formData.registeredState) {
          newErrors.registeredState = t('institutionalAuth.validation.registeredStateRequired');
        }
        break;
      case 'registeredCity':
        if (!formData.isSameAsRegistered && !formData.registeredCity) {
          newErrors.registeredCity = t('institutionalAuth.validation.registeredCityRequired');
        }
        break;
      case 'registeredPostalCode':
        if (!formData.isSameAsRegistered && !formData.registeredPostalCode) {
          newErrors.registeredPostalCode = t('institutionalAuth.validation.registeredPostalCodeRequired');
        }
        break;
      case 'registeredAddressLine1':
        if (!formData.isSameAsRegistered && !formData.registeredAddressLine1.trim()) {
          newErrors.registeredAddressLine1 = t('institutionalAuth.validation.registeredAddressLine1Required');
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // 表单验证通过，可以进行后续操作
      console.log('Form submitted successfully:', formData);
      // 这里可以添加表单提交逻辑，如API调用等
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 通讯地址验证
    if (!formData.country) {
      newErrors.country = t('institutionalAuth.validation.countryRequired');
    }

    if (!formData.state) {
      newErrors.state = t('institutionalAuth.validation.stateRequired');
    }

    if (!formData.city) {
      newErrors.city = t('institutionalAuth.validation.cityRequired');
    }

    if (!formData.postalCode) {
      newErrors.postalCode = t('institutionalAuth.validation.postalCodeRequired');
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = t('institutionalAuth.validation.addressLine1Required');
    }

    // 注册地址验证（如果与通讯地址不同）
    if (!formData.isSameAsRegistered) {
      if (!formData.registeredCountry) {
        newErrors.registeredCountry = t('institutionalAuth.validation.registeredCountryRequired');
      }

      if (!formData.registeredState) {
        newErrors.registeredState = t('institutionalAuth.validation.registeredStateRequired');
      }

      if (!formData.registeredCity) {
        newErrors.registeredCity = t('institutionalAuth.validation.registeredCityRequired');
      }

      if (!formData.registeredPostalCode) {
        newErrors.registeredPostalCode = t('institutionalAuth.validation.registeredPostalCodeRequired');
      }

      if (!formData.registeredAddressLine1.trim()) {
        newErrors.registeredAddressLine1 = t('institutionalAuth.validation.registeredAddressLine1Required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="address-info-form">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 通讯地址 */}
        <div className="form-section">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('institutionalAuth.addressInfo.communicationAddress')} *
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 国家 */}
            <div>
              <CountrySelector
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                error={errors.country}
                required
                label={t('institutionalAuth.addressInfo.country')}
              />
            </div>

            {/* 州/省 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.addressInfo.state')} *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.state ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.statePlaceholder')}
                required
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            {/* 城市 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.addressInfo.city')} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.city ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.cityPlaceholder')}
                required
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            {/* 邮政编码 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.addressInfo.postalCode')} *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.postalCode ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.postalCodePlaceholder')}
                required
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
              )}
            </div>

            {/* 地址行1 */}
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.addressInfo.addressLine1')} *
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.addressLine1 ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.addressLine1Placeholder')}
                required
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
              )}
            </div>


          </div>
        </div>

        {/* 注册地址 */}
        <div className="form-section">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isSameAsRegistered"
              checked={formData.isSameAsRegistered}
              onChange={handleInputChange}
              className="w-4 h-4 text-[#4B5EF5] bg-gray-100 border-gray-300 rounded focus:ring-[#4B5EF5] focus:ring-2"
            />
            <label className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
              {t('institutionalAuth.addressInfo.sameAsCommunication')}
            </label>
          </div>

          {!formData.isSameAsRegistered && (
            <>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.addressInfo.registeredAddress')} *
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 注册国家 */}
                <div>
                  <CountrySelector
                    name="registeredCountry"
                    value={formData.registeredCountry}
                    onChange={handleInputChange}
                    error={errors.registeredCountry}
                    required
                    label={t('institutionalAuth.addressInfo.registeredCountry')}
                  />
                </div>

                {/* 注册州/省 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                    {t('institutionalAuth.addressInfo.registeredState')} *
                  </label>
                  <input
                type="text"
                name="registeredState"
                value={formData.registeredState}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.registeredState ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.registeredStatePlaceholder')}
                required
              />
                  {errors.registeredState && (
                    <p className="text-red-500 text-xs mt-1">{errors.registeredState}</p>
                  )}
                </div>

                {/* 注册城市 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                    {t('institutionalAuth.addressInfo.registeredCity')} *
                  </label>
                  <input
                type="text"
                name="registeredCity"
                value={formData.registeredCity}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.registeredCity ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.registeredCityPlaceholder')}
                required
              />
                  {errors.registeredCity && (
                    <p className="text-red-500 text-xs mt-1">{errors.registeredCity}</p>
                  )}
                </div>

                {/* 注册邮政编码 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                    {t('institutionalAuth.addressInfo.registeredPostalCode')} *
                  </label>
                  <input
                type="text"
                name="registeredPostalCode"
                value={formData.registeredPostalCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.registeredPostalCode ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.registeredPostalCodePlaceholder')}
                required
              />
                  {errors.registeredPostalCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.registeredPostalCode}</p>
                  )}
                </div>

                {/* 注册地址行1 */}
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                    {t('institutionalAuth.addressInfo.registeredAddressLine1')} *
                  </label>
                  <input
                type="text"
                name="registeredAddressLine1"
                value={formData.registeredAddressLine1}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
                  isDarkMode 
                    ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
                    : 'border-[#EDEEF3] bg-white'
                } ${errors.registeredAddressLine1 ? 'border-red-500' : ''}`}
                placeholder={t('institutionalAuth.addressInfo.registeredAddressLine1Placeholder')}
                required
              />
                  {errors.registeredAddressLine1 && (
                    <p className="text-red-500 text-xs mt-1">{errors.registeredAddressLine1}</p>
                  )}
                </div>


              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressInfoForm;
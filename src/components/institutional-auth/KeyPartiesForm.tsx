import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface IndividualParty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  idType: 'passport' | 'id_card' | 'driver_license';
  address: string;
  role: string;
  ownershipPercentage: number;
}

interface EntityParty {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  ownershipPercentage: number;
  representativeName: string;
  representativeTitle: string;
}

type PartyType = 'individual' | 'entity';

type Party = IndividualParty | EntityParty;

interface KeyPartiesFormData {
  parties: Party[];
  currentPartyType: PartyType;
}

interface FormErrors {
  [key: string]: string;
}

const KeyPartiesForm: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState<KeyPartiesFormData>({
    parties: [],
    currentPartyType: 'individual'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [newParty, setNewParty] = useState<Partial<Party>>({});

  const idTypes = [
    { value: 'passport', label: t('institutionalAuth.keyParties.passport') },
    { value: 'id_card', label: t('institutionalAuth.keyParties.idCard') },
    { value: 'driver_license', label: t('institutionalAuth.keyParties.driverLicense') }
  ];

  const roles = [
    { value: 'director', label: t('institutionalAuth.keyParties.director') },
    { value: 'shareholder', label: t('institutionalAuth.keyParties.shareholder') },
    { value: 'beneficial_owner', label: t('institutionalAuth.keyParties.beneficialOwner') },
    { value: 'authorized_signatory', label: t('institutionalAuth.keyParties.authorizedSignatory') },
    { value: 'compliance_officer', label: t('institutionalAuth.keyParties.complianceOfficer') }
  ];

  const createEmptyParty = (type: PartyType): Partial<Party> => {
    if (type === 'individual') {
      return {
        id: Math.random().toString(36).substr(2, 9),
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idNumber: '',
        idType: 'passport',
        address: '',
        role: '',
        ownershipPercentage: 0
      };
    } else {
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        registrationNumber: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        ownershipPercentage: 0,
        representativeName: '',
        representativeTitle: ''
      };
    }
  };

  const handlePartyTypeChange = (type: PartyType) => {
    setFormData(prev => ({
      ...prev,
      currentPartyType: type
    }));
    setNewParty(createEmptyParty(type));
  };

  const handleNewPartyChange = (field: string, value: string | number) => {
    setNewParty(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateParty = (party: Partial<Party>, type: PartyType): boolean => {
    const newErrors: FormErrors = {};

    if (type === 'individual') {
      if (!(party as IndividualParty).firstName?.trim()) {
        newErrors.firstName = t('institutionalAuth.keyParties.firstNameRequired');
      }
      if (!(party as IndividualParty).lastName?.trim()) {
        newErrors.lastName = t('institutionalAuth.keyParties.lastNameRequired');
      }
      if (!(party as IndividualParty).email?.trim()) {
        newErrors.email = t('institutionalAuth.keyParties.emailRequired');
      } else if (!/\S+@\S+\.\S+/.test((party as IndividualParty).email)) {
        newErrors.email = t('institutionalAuth.keyParties.invalidEmail');
      }
      if (!(party as IndividualParty).phone?.trim()) {
        newErrors.phone = t('institutionalAuth.keyParties.phoneRequired');
      }
      if (!(party as IndividualParty).idNumber?.trim()) {
        newErrors.idNumber = t('institutionalAuth.keyParties.idNumberRequired');
      }
      if (!(party as IndividualParty).address?.trim()) {
        newErrors.address = t('institutionalAuth.keyParties.addressRequired');
      }
      if (!(party as IndividualParty).role) {
        newErrors.role = t('institutionalAuth.keyParties.roleRequired');
      }
      if ((party as IndividualParty).ownershipPercentage === undefined || 
          (party as IndividualParty).ownershipPercentage < 0 || 
          (party as IndividualParty).ownershipPercentage > 100) {
        newErrors.ownershipPercentage = t('institutionalAuth.keyParties.ownershipPercentageInvalid');
      }
    } else {
      if (!(party as EntityParty).name?.trim()) {
        newErrors.name = t('institutionalAuth.keyParties.entityNameRequired');
      }
      if (!(party as EntityParty).registrationNumber?.trim()) {
        newErrors.registrationNumber = t('institutionalAuth.keyParties.registrationNumberRequired');
      }
      if (!(party as EntityParty).email?.trim()) {
        newErrors.email = t('institutionalAuth.keyParties.emailRequired');
      } else if (!/\S+@\S+\.\S+/.test((party as EntityParty).email)) {
        newErrors.email = t('institutionalAuth.keyParties.invalidEmail');
      }
      if (!(party as EntityParty).phone?.trim()) {
        newErrors.phone = t('institutionalAuth.keyParties.phoneRequired');
      }
      if (!(party as EntityParty).address?.trim()) {
        newErrors.address = t('institutionalAuth.keyParties.addressRequired');
      }
      if (!(party as EntityParty).role) {
        newErrors.role = t('institutionalAuth.keyParties.roleRequired');
      }
      if ((party as EntityParty).ownershipPercentage === undefined || 
          (party as EntityParty).ownershipPercentage < 0 || 
          (party as EntityParty).ownershipPercentage > 100) {
        newErrors.ownershipPercentage = t('institutionalAuth.keyParties.ownershipPercentageInvalid');
      }
      if (!(party as EntityParty).representativeName?.trim()) {
        newErrors.representativeName = t('institutionalAuth.keyParties.representativeNameRequired');
      }
      if (!(party as EntityParty).representativeTitle?.trim()) {
        newErrors.representativeTitle = t('institutionalAuth.keyParties.representativeTitleRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addParty = () => {
    if (validateParty(newParty, formData.currentPartyType)) {
      setFormData(prev => ({
        ...prev,
        parties: [...prev.parties, newParty as Party]
      }));
      setNewParty(createEmptyParty(formData.currentPartyType));
      setErrors({});
    }
  };

  const removeParty = (id: string) => {
    setFormData(prev => ({
      ...prev,
      parties: prev.parties.filter(party => party.id !== id)
    }));
  };

  const renderIndividualForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.firstName')} *
        </label>
        <input
          type="text"
          value={(newParty as IndividualParty).firstName || ''}
          onChange={(e) => handleNewPartyChange('firstName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.firstName ? 'border-red-500' : ''}`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.lastName')} *
        </label>
        <input
          type="text"
          value={(newParty as IndividualParty).lastName || ''}
          onChange={(e) => handleNewPartyChange('lastName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.lastName ? 'border-red-500' : ''}`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.email')} *
        </label>
        <input
          type="email"
          value={(newParty as IndividualParty).email || ''}
          onChange={(e) => handleNewPartyChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.phone')} *
        </label>
        <input
          type="tel"
          value={(newParty as IndividualParty).phone || ''}
          onChange={(e) => handleNewPartyChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.idType')} *
        </label>
        <select
          value={(newParty as IndividualParty).idType || 'passport'}
          onChange={(e) => handleNewPartyChange('idType', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          }`}
        >
          {idTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.idNumber')} *
        </label>
        <input
          type="text"
          value={(newParty as IndividualParty).idNumber || ''}
          onChange={(e) => handleNewPartyChange('idNumber', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.idNumber ? 'border-red-500' : ''}`}
        />
        {errors.idNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
        )}
      </div>

      <div className="col-span-2">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.address')} *
        </label>
        <input
          type="text"
          value={(newParty as IndividualParty).address || ''}
          onChange={(e) => handleNewPartyChange('address', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.role')} *
        </label>
        <select
          value={(newParty as IndividualParty).role || ''}
          onChange={(e) => handleNewPartyChange('role', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.role ? 'border-red-500' : ''}`}
        >
          <option value="">{t('institutionalAuth.keyParties.selectRole')}</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.ownershipPercentage')} *
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={(newParty as IndividualParty).ownershipPercentage || 0}
          onChange={(e) => handleNewPartyChange('ownershipPercentage', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.ownershipPercentage ? 'border-red-500' : ''}`}
        />
        {errors.ownershipPercentage && (
          <p className="text-red-500 text-xs mt-1">{errors.ownershipPercentage}</p>
        )}
      </div>
    </div>
  );

  const renderEntityForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.entityName')} *
        </label>
        <input
          type="text"
          value={(newParty as EntityParty).name || ''}
          onChange={(e) => handleNewPartyChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.registrationNumber')} *
        </label>
        <input
          type="text"
          value={(newParty as EntityParty).registrationNumber || ''}
          onChange={(e) => handleNewPartyChange('registrationNumber', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.registrationNumber ? 'border-red-500' : ''}`}
        />
        {errors.registrationNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.email')} *
        </label>
        <input
          type="email"
          value={(newParty as EntityParty).email || ''}
          onChange={(e) => handleNewPartyChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.phone')} *
        </label>
        <input
          type="tel"
          value={(newParty as EntityParty).phone || ''}
          onChange={(e) => handleNewPartyChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="col-span-2">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.address')} *
        </label>
        <input
          type="text"
          value={(newParty as EntityParty).address || ''}
          onChange={(e) => handleNewPartyChange('address', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.role')} *
        </label>
        <select
          value={(newParty as EntityParty).role || ''}
          onChange={(e) => handleNewPartyChange('role', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.role ? 'border-red-500' : ''}`}
        >
          <option value="">{t('institutionalAuth.keyParties.selectRole')}</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.ownershipPercentage')} *
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={(newParty as EntityParty).ownershipPercentage || 0}
          onChange={(e) => handleNewPartyChange('ownershipPercentage', parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.ownershipPercentage ? 'border-red-500' : ''}`}
        />
        {errors.ownershipPercentage && (
          <p className="text-red-500 text-xs mt-1">{errors.ownershipPercentage}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.representativeName')} *
        </label>
        <input
          type="text"
          value={(newParty as EntityParty).representativeName || ''}
          onChange={(e) => handleNewPartyChange('representativeName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.representativeName ? 'border-red-500' : ''}`}
        />
        {errors.representativeName && (
          <p className="text-red-500 text-xs mt-1">{errors.representativeName}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.keyParties.representativeTitle')} *
        </label>
        <input
          type="text"
          value={(newParty as EntityParty).representativeTitle || ''}
          onChange={(e) => handleNewPartyChange('representativeTitle', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] ${
            isDarkMode 
              ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' 
              : 'border-[#EDEEF3] bg-white'
          } ${errors.representativeTitle ? 'border-red-500' : ''}`}
        />
        {errors.representativeTitle && (
          <p className="text-red-500 text-xs mt-1">{errors.representativeTitle}</p>
        )}
      </div>
    </div>
  );

  const renderPartyCard = (party: Party) => {
    const isIndividual = 'firstName' in party;
    
    return (
      <div key={party.id} className={`p-4 rounded-lg border ${
        isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A]' : 'border-[#EDEEF3] bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
              {isIndividual 
                ? `${(party as IndividualParty).firstName} ${(party as IndividualParty).lastName}`
                : (party as EntityParty).name
              }
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {roles.find(r => r.value === party.role)?.label} • 
              {t('institutionalAuth.keyParties.ownership')}: {party.ownershipPercentage}%
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeParty(party.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            {t('institutionalAuth.keyParties.remove')}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {t('institutionalAuth.keyParties.email')}:
          </span>
          <span className={isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}>
            {party.email}
          </span>
          
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {t('institutionalAuth.keyParties.phone')}:
          </span>
          <span className={isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}>
            {party.phone}
          </span>
          
          {isIndividual && (
            <>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {t('institutionalAuth.keyParties.idType')}:
              </span>
              <span className={isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}>
                {idTypes.find(t => t.value === (party as IndividualParty).idType)?.label}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="key-parties-form">
      <form className="space-y-6">
        {/* 已添加的关键当事方 */}
        {formData.parties.length > 0 && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
              {t('institutionalAuth.keyParties.addedParties')} ({formData.parties.length})
            </h3>
            <div className="grid gap-3">
              {formData.parties.map(renderPartyCard)}
            </div>
          </div>
        )}

        {/* 添加新关键当事方 */}
        <div className="form-section">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('institutionalAuth.keyParties.addNewParty')}
          </h3>
          
          {/* 类型选择 */}
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => handlePartyTypeChange('individual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.currentPartyType === 'individual'
                  ? 'bg-[#4B5EF5] text-white'
                  : isDarkMode
                    ? 'bg-[#2C2C2C] text-gray-300 hover:bg-[#3C3C3C]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('institutionalAuth.keyParties.individual')}
            </button>
            <button
              type="button"
              onClick={() => handlePartyTypeChange('entity')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.currentPartyType === 'entity'
                  ? 'bg-[#4B5EF5] text-white'
                  : isDarkMode
                    ? 'bg-[#2C2C2C] text-gray-300 hover:bg-[#3C3C3C]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('institutionalAuth.keyParties.entity')}
            </button>
          </div>

          {/* 表单内容 */}
          {formData.currentPartyType === 'individual' ? renderIndividualForm() : renderEntityForm()}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addParty}
              className="px-6 py-2 bg-[#4B5EF5] text-white rounded-lg text-sm font-medium hover:bg-[#3A4BD4] transition-colors"
            >
              {t('institutionalAuth.keyParties.addParty')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default KeyPartiesForm;
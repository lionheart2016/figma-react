// 机构认证相关类型定义

// 步骤数据接口定义
export interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
}

// 步骤数据接口定义 - 使用字符串类型的ID
// 机构认证步骤状态类型
export type StepStatus = 'pending' | 'current' | 'completed';

// 步骤数据接口定义
export interface StepData {
  id: string;
  title: string;
  status: StepStatus;
}

// 个人关键方数据类型定义
export interface IndividualParty {
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

// 实体关键方数据类型定义
export interface EntityParty {
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

// 关键方类型定义
export type PartyType = 'individual' | 'entity';

// 关键方联合类型定义
export type Party = IndividualParty | EntityParty;

// 关键方表单数据类型定义
export interface KeyPartiesFormData {
  parties: Party[];
  currentPartyType: PartyType;
}

// 地址信息表单数据类型定义
export interface AddressInfoFormData {
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

// 机构信息表单数据类型定义
export interface InstitutionInfoFormData {
  institutionName: string;
  incorporationDate: string;
  businessNature: string;
  registeredCountry: string;
  taxNumber: string;
  fundingSource: string;
  leiCode: string;
  website: string;
  phoneNumber: string;
  email: string;
}

// 表单错误类型定义
export interface FormErrors {
  [key: string]: string;
}

// 关键方表单组件属性接口
export interface KeyPartiesFormProps {
  onSubmit: (data: KeyPartiesFormData) => void;
  initialData?: KeyPartiesFormData;
}

// 地址信息表单组件属性定义
export interface AddressInfoFormProps {
  onSubmit: (data: AddressInfoFormData) => void;
  initialData?: Partial<AddressInfoFormData>;
}

// 机构信息表单组件属性定义
export interface InstitutionInfoFormProps {
  onSubmit: (data: InstitutionInfoFormData) => void;
  initialData?: Partial<InstitutionInfoFormData>;
}

// 机构认证步骤数据类型
export interface InstitutionAuthStepData {
  institutionInfo: {
    name: string;
    registrationNumber: string;
    businessType: string;
    industry: string;
    establishmentDate: string;
    legalRepresentative: string;
  };
  addressInfo: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  keyParties: KeyPartiesFormData;
  documents: {
    businessLicense: File | null;
    taxCertificate: File | null;
    bankStatement: File | null;
    additionalDocuments: File[];
  };
}
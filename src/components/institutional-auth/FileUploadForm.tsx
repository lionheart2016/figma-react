import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  uploadDate: Date;
}

// 文件上传项配置接口
interface FileUploadItem {
  key: string;
  labelKey: string;
  required: boolean;
}

// 文件上传数据接口
interface FileUploadFormData {
  [key: string]: UploadedFile | null | UploadedFile[];
  otherDocuments: UploadedFile[];
}

interface FormErrors {
  [key: string]: string;
}

// 文件上传项常量数组
const FILE_UPLOAD_ITEMS: FileUploadItem[] = [
  {
    key: 'businessLicense',
    labelKey: 'institutionalAuth.steps.fileUpload.businessLicense',
    required: true
  },
  {
    key: 'certificateOfIncorporation',
    labelKey: 'institutionalAuth.steps.fileUpload.certificateOfIncorporation',
    required: true
  },
  {
    key: 'shareholderList',
    labelKey: 'institutionalAuth.steps.fileUpload.shareholderList',
    required: true
  },
  {
    key: 'directorsList',
    labelKey: 'institutionalAuth.steps.fileUpload.directorsList',
    required: true
  },
  {
    key: 'orgChart',
    labelKey: 'institutionalAuth.steps.fileUpload.orgChart',
    required: false
  },
  {
    key: 'authorizedSigners',
    labelKey: 'institutionalAuth.steps.fileUpload.authorizedSigners',
    required: false
  },
  {
    key: 'taxForm',
    labelKey: 'institutionalAuth.steps.fileUpload.taxForm',
    required: false
  },
  {
    key: 'goodStanding',
    labelKey: 'institutionalAuth.steps.fileUpload.goodStanding',
    required: false
  },
  {
    key: 'bankStatement',
    labelKey: 'institutionalAuth.steps.fileUpload.bankStatement',
    required: true
  },
  {
    key: 'auditedFinancials',
    labelKey: 'institutionalAuth.steps.fileUpload.auditedFinancials',
    required: false
  },
  {
    key: 'addressProof',
    labelKey: 'institutionalAuth.steps.fileUpload.addressProof',
    required: false
  },
  {
    key: 'operatingAddress',
    labelKey: 'institutionalAuth.steps.fileUpload.operatingAddress',
    required: false
  }
];

const FileUploadForm: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // 初始化表单数据
  const initializeFormData = (): FileUploadFormData => {
    const data: FileUploadFormData = { otherDocuments: [] };
    FILE_UPLOAD_ITEMS.forEach(item => {
      data[item.key] = null;
    });
    return data;
  };
  
  const [formData, setFormData] = useState<FileUploadFormData>(initializeFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  
  // 动态创建文件输入引用
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  
  // 初始化文件输入引用
  React.useEffect(() => {
    // 重置引用对象，确保它有正确的键
    const refs: {[key: string]: HTMLInputElement | null} = {};
    FILE_UPLOAD_ITEMS.forEach(item => {
      refs[item.key] = null;
    });
    refs['otherDocuments'] = null;
    fileInputRefs.current = refs;
  }, []);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return t('institutionalAuth.fileUpload.fileTooLarge', { maxSize: '50MB' });
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return t('institutionalAuth.fileUpload.invalidFileType');
    }
    
    return null;
  };

  const handleFileUpload = (fieldName: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const error = validateFile(file);
    
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      return;
    }

    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date()
    };

    // 如果是图片文件，生成预览
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: {
            ...uploadedFile,
            previewUrl: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: uploadedFile
      }));
    }

    // 清除错误
    setErrors(prev => { 
      const newErrors = { ...prev };
      if (newErrors[fieldName]) delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleOtherDocumentsUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        // 可以在这里显示错误，但继续处理其他文件
        console.error(`File ${file.name} rejected:`, error);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
      };

      newFiles.push(uploadedFile);
    });

    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        otherDocuments: [...prev.otherDocuments, ...newFiles]
      }));
    }
  };

  const removeFile = (fieldName: string, fileId?: string) => {
    if (fieldName === 'otherDocuments' && fileId) {
      setFormData(prev => ({
        ...prev,
        otherDocuments: prev.otherDocuments.filter(file => file.id !== fileId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
      
      // 清除错误
      setErrors(prev => { 
        const newErrors = { ...prev };
        if (newErrors[fieldName]) delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragOver(fieldName);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = e.dataTransfer.files;
    if (fieldName === 'otherDocuments') {
      handleOtherDocumentsUpload(files);
    } else {
      handleFileUpload(fieldName, files);
    }
  };

  const renderFileUploadArea = (
    fieldName: string,
    label: string,
    required: boolean = true
  ) => {
    const file = formData[fieldName] as UploadedFile | null;
    const isDragActive = dragOver === fieldName;

    return (
      <div className="file-upload-section">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t(label)} {required && '*'}
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive 
              ? 'border-[#4B5EF5] bg-[#4B5EF5]/10' 
              : errors[fieldName] 
                ? 'border-red-500' 
                : isDarkMode 
                  ? 'border-[#2C2C2C] hover:border-[#4B5EF5]' 
                  : 'border-[#EDEEF3] hover:border-[#4B5EF5]'}`}
          onDragOver={(e) => handleDragOver(e, fieldName)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, fieldName)}
          onClick={() => fileInputRefs.current[fieldName]?.click()}
        >
          <input
            ref={inputRef => fileInputRefs.current[fieldName] = inputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={(e) => handleFileUpload(fieldName, e.target.files)}
          />
          
          {!file ? (
            <>
              <div className="text-4xl text-[#4B5EF5] mb-2">📁</div>
              <div className="mt-2">
                <span className="text-blue-500 text-sm">{t('institutionalAuth.fileUpload.browseFiles')}</span>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('institutionalAuth.fileUpload.supportedFormats')}
              </p>
            </>
          ) : (
            <div className="file-preview">
              {file.previewUrl && file.type.startsWith('image/') ? (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="max-h-32 mx-auto mb-2 rounded"
                />
              ) : (
                <div className="text-4xl text-[#4B5EF5] mb-2">📄</div>
              )}
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {file.name}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
              </p>
              <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fieldName);
                  }}
                  className="mt-2 text-red-500 text-xs hover:text-red-700"
                >
                  {t('institutionalAuth.fileUpload.removeFile')}
                </button>
            </div>
          )}
        </div>
        
        {errors[fieldName] && (
          <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
        )}
      </div>
    );
  };

  const renderOtherDocumentsArea = () => {
    const files = formData.otherDocuments;
    const isDragActive = dragOver === 'otherDocuments';

    return (
      <div className="file-upload-section">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {t('institutionalAuth.fileUpload.otherDocuments')}
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-[#4B5EF5] bg-[#4B5EF5]/10' 
              : isDarkMode 
                ? 'border-[#2C2C2C] hover:border-[#4B5EF5]' 
                : 'border-[#EDEEF3] hover:border-[#4B5EF5]'
          }`}
          onDragOver={(e) => handleDragOver(e, 'otherDocuments')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'otherDocuments')}
          onClick={() => fileInputRefs.current['otherDocuments']?.click()}
        >
          <input
            ref={inputRef => fileInputRefs.current['otherDocuments'] = inputRef}
            type="file"
            className="hidden"
            multiple
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={(e) => handleOtherDocumentsUpload(e.target.files)}
          />
          
          {files.length === 0 ? (
            <>
              <div className="text-4xl text-[#4B5EF5] mb-2">📁</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('institutionalAuth.fileUpload.otherDocumentsDescription')}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('institutionalAuth.fileUpload.supportedFormats')}
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {t('institutionalAuth.fileUpload.uploadedFiles')} ({files.length})
              </p>
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-[#2C2C2C] rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                        {file.name}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile('otherDocuments', file.id);
                  }}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  {t('institutionalAuth.fileUpload.removeFile')}
                </button>
                </div>
              ))}
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('institutionalAuth.fileUpload.clickToAddMore')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="file-upload-form">
      <form>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{t('institutionalAuth.fileUpload.title')}</h2>
          <p className="text-sm text-gray-500">{t('institutionalAuth.fileUpload.subtitle')}</p>
        </div>
        
        {/* 根据FILE_UPLOAD_ITEMS常量数组渲染所有文件上传区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {FILE_UPLOAD_ITEMS.map((item) => (
            <div key={item.key}>
              {renderFileUploadArea(
                item.key,
                item.labelKey,
                item.required
              )}
            </div>
          ))}
        </div>
        
        {/* 其他文档上传区域 */}
        {renderOtherDocumentsArea()}
      </form>
    </div>
  );
};

export default FileUploadForm;
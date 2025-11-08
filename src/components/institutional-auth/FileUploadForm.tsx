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

interface FileUploadFormData {
  businessLicense: UploadedFile | null;
  certificateOfIncorporation: UploadedFile | null;
  taxRegistration: UploadedFile | null;
  bankStatement: UploadedFile | null;
  otherDocuments: UploadedFile[];
}

interface FormErrors {
  businessLicense?: string;
  certificateOfIncorporation?: string;
  taxRegistration?: string;
  bankStatement?: string;
}

const FileUploadForm: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState<FileUploadFormData>({
    businessLicense: null,
    certificateOfIncorporation: null,
    taxRegistration: null,
    bankStatement: null,
    otherDocuments: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  
  const fileInputRefs = {
    businessLicense: useRef<HTMLInputElement>(null),
    certificateOfIncorporation: useRef<HTMLInputElement>(null),
    taxRegistration: useRef<HTMLInputElement>(null),
    bankStatement: useRef<HTMLInputElement>(null),
    otherDocuments: useRef<HTMLInputElement>(null)
  };

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

  const handleFileUpload = (fieldName: keyof FileUploadFormData, files: FileList | null) => {
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
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
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

  const removeFile = (fieldName: keyof FileUploadFormData, fileId?: string) => {
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

  const handleDrop = (e: React.DragEvent, fieldName: keyof FileUploadFormData) => {
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
    fieldName: keyof FileUploadFormData,
    label: string,
    description: string,
    required: boolean = true
  ) => {
    const file = formData[fieldName];
    const isDragActive = dragOver === fieldName;

    return (
      <div className="file-upload-section">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
          {label} {required && '*'}
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-[#4B5EF5] bg-[#4B5EF5]/10' 
              : errors[fieldName] 
                ? 'border-red-500' 
                : isDarkMode 
                  ? 'border-[#2C2C2C] hover:border-[#4B5EF5]' 
                  : 'border-[#EDEEF3] hover:border-[#4B5EF5]'
          }`}
          onDragOver={(e) => handleDragOver(e, fieldName)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, fieldName)}
          onClick={() => fileInputRefs[fieldName].current?.click()}
        >
          <input
            ref={fileInputRefs[fieldName]}
            type="file"
            className="hidden"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={(e) => handleFileUpload(fieldName, e.target.files)}
          />
          
          {!file ? (
            <>
              <div className="text-4xl text-[#4B5EF5] mb-2">📁</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {description}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('institutionalAuth.fileUpload.supportedFormats')}: JPG, PNG, PDF (≤50MB)
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
          onClick={() => fileInputRefs.otherDocuments.current?.click()}
        >
          <input
            ref={fileInputRefs.otherDocuments}
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
                {t('institutionalAuth.fileUpload.supportedFormats')}: JPG, PNG, PDF (≤50MB)
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
      <form className="space-y-6">
        {renderFileUploadArea(
          'businessLicense',
          t('institutionalAuth.fileUpload.businessLicense'),
          t('institutionalAuth.fileUpload.businessLicenseDescription')
        )}
        
        {renderFileUploadArea(
          'certificateOfIncorporation',
          t('institutionalAuth.fileUpload.certificateOfIncorporation'),
          t('institutionalAuth.fileUpload.certificateOfIncorporationDescription')
        )}
        
        {renderFileUploadArea(
          'taxRegistration',
          t('institutionalAuth.fileUpload.taxRegistration'),
          t('institutionalAuth.fileUpload.taxRegistrationDescription')
        )}
        
        {renderFileUploadArea(
          'bankStatement',
          t('institutionalAuth.fileUpload.bankStatement'),
          t('institutionalAuth.fileUpload.bankStatementDescription')
        )}
        
        {renderOtherDocumentsArea()}
      </form>
    </div>
  );
};

export default FileUploadForm;
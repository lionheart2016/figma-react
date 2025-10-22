import { describe, it, expect } from 'vitest';
import enTranslations from '../locales/en.json';
import zhCNTranslations from '../locales/zh-CN.json';
import zhTWTranslations from '../locales/zh-TW.json';

// 递归获取所有翻译键
function getAllKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const nestedKeys = getAllKeys(obj[key], prefix ? `${prefix}.${key}` : key);
      keys = [...keys, ...nestedKeys];
    } else {
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }
  
  return keys;
}

// 按命名空间分组翻译键
function groupKeysByNamespace(keys: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  
  keys.forEach(key => {
    const namespace = key.split('.')[0];
    if (!grouped[namespace]) {
      grouped[namespace] = [];
    }
    grouped[namespace].push(key);
  });
  
  return grouped;
}

describe('i18n Translations Integrity', () => {
  // 获取所有翻译键
  const enKeys = getAllKeys(enTranslations);
  const zhCNKeys = getAllKeys(zhCNTranslations);
  const zhTWKeys = getAllKeys(zhTWTranslations);
  
  // 按命名空间分组
  const enGroups = groupKeysByNamespace(enKeys);
  const zhCNGroups = groupKeysByNamespace(zhCNKeys);
  const zhTWGroups = groupKeysByNamespace(zhTWKeys);
  
  // 获取所有命名空间
  const allNamespaces = Array.from(
    new Set([
      ...Object.keys(enGroups),
      ...Object.keys(zhCNGroups),
      ...Object.keys(zhTWGroups)
    ])
  );

  // 测试所有英文翻译键在中文简体和繁体中都存在
  it('should have all English translation keys present in Simplified Chinese', () => {
    const missingKeys = enKeys.filter(key => !zhCNKeys.includes(key));
    expect(missingKeys).toEqual([], `Missing ${missingKeys.length} keys in zh-CN.json: ${missingKeys.join(', ')}`);
  });

  it('should have all English translation keys present in Traditional Chinese', () => {
    const missingKeys = enKeys.filter(key => !zhTWKeys.includes(key));
    expect(missingKeys).toEqual([], `Missing ${missingKeys.length} keys in zh-TW.json: ${missingKeys.join(', ')}`);
  });

  // 按命名空间测试翻译完整性
  allNamespaces.forEach(namespace => {
    describe(`Namespace: ${namespace}`, () => {
      it(`should have complete translations for ${namespace} in Simplified Chinese`, () => {
        const enNamespaceKeys = enGroups[namespace] || [];
        const zhCNNamespaceKeys = zhCNGroups[namespace] || [];
        
        const missingKeys = enNamespaceKeys.filter(key => !zhCNNamespaceKeys.includes(key));
        expect(missingKeys).toEqual([], `Missing ${missingKeys.length} keys in zh-CN.json for namespace ${namespace}: ${missingKeys.join(', ')}`);
      });

      it(`should have complete translations for ${namespace} in Traditional Chinese`, () => {
        const enNamespaceKeys = enGroups[namespace] || [];
        const zhTWNamespaceKeys = zhTWGroups[namespace] || [];
        
        const missingKeys = enNamespaceKeys.filter(key => !zhTWNamespaceKeys.includes(key));
        expect(missingKeys).toEqual([], `Missing ${missingKeys.length} keys in zh-TW.json for namespace ${namespace}: ${missingKeys.join(', ')}`);
      });
    });
  });

  // 测试没有空翻译值
  it('should not have empty translation values in English', () => {
    const emptyValues: string[] = [];
    
    function checkEmpty(obj: any, path: string = '') {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkEmpty(obj[key], currentPath);
        } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
          emptyValues.push(currentPath);
        }
      }
    }
    
    checkEmpty(enTranslations);
    expect(emptyValues).toEqual([], `Found empty translation values in en.json: ${emptyValues.join(', ')}`);
  });

  it('should not have empty translation values in Simplified Chinese', () => {
    const emptyValues: string[] = [];
    
    function checkEmpty(obj: any, path: string = '') {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkEmpty(obj[key], currentPath);
        } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
          emptyValues.push(currentPath);
        }
      }
    }
    
    checkEmpty(zhCNTranslations);
    expect(emptyValues).toEqual([], `Found empty translation values in zh-CN.json: ${emptyValues.join(', ')}`);
  });

  it('should not have empty translation values in Traditional Chinese', () => {
    const emptyValues: string[] = [];
    
    function checkEmpty(obj: any, path: string = '') {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkEmpty(obj[key], currentPath);
        } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
          emptyValues.push(currentPath);
        }
      }
    }
    
    checkEmpty(zhTWTranslations);
    expect(emptyValues).toEqual([], `Found empty translation values in zh-TW.json: ${emptyValues.join(', ')}`);
  });

  // 测试特殊格式的翻译键（包含占位符等）
  it('should preserve placeholder patterns in translations', () => {
    function extractPlaceholders(text: string): string[] {
      const regex = /\{\{([^}]+)\}\}/g;
      const matches = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
      }
      return matches;
    }

    function comparePlaceholders(enObj: any, zhObj: any, path: string = '') {
      for (const key in enObj) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof enObj[key] === 'object' && typeof zhObj[key] === 'object') {
          comparePlaceholders(enObj[key], zhObj[key], currentPath);
        } else if (typeof enObj[key] === 'string' && typeof zhObj[key] === 'string') {
          const enPlaceholders = extractPlaceholders(enObj[key]);
          const zhPlaceholders = extractPlaceholders(zhObj[key]);
          
          expect(enPlaceholders.sort()).toEqual(
            zhPlaceholders.sort(),
            `Mismatched placeholders for key ${currentPath}`
          );
        }
      }
    }

    // 检查中文简体翻译中的占位符
    comparePlaceholders(enTranslations, zhCNTranslations);
    // 检查中文繁体翻译中的占位符
    comparePlaceholders(enTranslations, zhTWTranslations);
  });
});
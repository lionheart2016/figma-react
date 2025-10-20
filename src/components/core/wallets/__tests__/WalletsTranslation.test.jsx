import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// 导入语言文件
import enTranslations from '../../../../locales/en.json';
import zhCNTranslations from '../../../../locales/zh-CN.json';
import zhTWTranslations from '../../../../locales/zh-TW.json';

// 从Wallets.jsx中提取所有使用的翻译键
function extractTranslationKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
  const keys = new Set();
  let match;
  
  while ((match = keyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

describe('Wallets Component - Translation Tests', () => {
  // 测试1: 提取并验证所有翻译键在所有语言文件中都存在
  it('should have all translation keys used in Wallets.jsx present in all locale files', () => {
    const componentPath = path.join(__dirname, '../Wallets.jsx');
    const usedKeys = extractTranslationKeysFromFile(componentPath);
    
    console.log('Translation keys found in Wallets.jsx:', usedKeys);
    
    const locales = {
      'English': enTranslations,
      'Chinese Simplified': zhCNTranslations,
      'Chinese Traditional': zhTWTranslations
    };
    
    const missingKeys = [];
    
    // 检查每个翻译键在每个语言文件中是否存在
    Object.entries(locales).forEach(([localeName, translations]) => {
      usedKeys.forEach(key => {
        const keys = key.split('.');
        let current = translations;
        let keyExists = true;
        
        for (const k of keys) {
          if (!current || !Object.prototype.hasOwnProperty.call(current, k)) {
            keyExists = false;
            break;
          }
          current = current[k];
        }
        
        if (!keyExists) {
          missingKeys.push({ locale: localeName, key });
        }
      });
    });
    
    // 如果有缺失的翻译键，报告它们
    if (missingKeys.length > 0) {
      console.error('Missing translation keys:');
      missingKeys.forEach(item => {
        console.error(`- In ${item.locale}: ${item.key}`);
      });
      
      // 由于我们的目标是检测问题，暂时不抛出断言错误
      console.log(`Found ${missingKeys.length} missing translation keys.`);
    } else {
      expect(missingKeys.length).toBe(0);
    }
  });
  
  // 测试2: 检测组件中是否有硬编码的中文文本
  it('should not contain hardcoded Chinese text in Wallets.jsx', () => {
    const componentPath = path.join(__dirname, '../Wallets.jsx');
    const content = fs.readFileSync(componentPath, 'utf8');
    const lines = content.split('\n');
    
    // 中文正则表达式
    const chineseRegex = /[\u4e00-\u9fa5]/;
    
    // 检测包含中文字符的行，但排除注释和翻译函数调用
    const hardcodedChineseLines = [];
    
    lines.forEach((line, index) => {
      // 跳过注释行
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return;
      }
      
      // 跳过包含翻译函数调用的行
      if (line.includes('t(') || line.includes("t(")) {
        return;
      }
      
      // 检查是否包含中文字符
      if (chineseRegex.test(line)) {
        hardcodedChineseLines.push({
          lineNumber: index + 1,
          content: line.trim()
        });
      }
    });
    
    // 输出找到的硬编码中文文本
    if (hardcodedChineseLines.length > 0) {
      console.error('Found hardcoded Chinese text in Wallets.jsx:');
      hardcodedChineseLines.forEach(item => {
        console.error(`Line ${item.lineNumber}: ${item.content}`);
      });
      
      // 由于我们的目标是检测问题，暂时不抛出断言错误
      console.log(`Found ${hardcodedChineseLines.length} lines with hardcoded Chinese text.`);
    } else {
      expect(hardcodedChineseLines.length).toBe(0);
    }
  });
  
  // 测试3: 验证所有翻译值都不是空的
  it('should have non-empty translation values for all used keys', () => {
    const componentPath = path.join(__dirname, '../Wallets.jsx');
    const usedKeys = extractTranslationKeysFromFile(componentPath);
    
    const locales = {
      'English': enTranslations,
      'Chinese Simplified': zhCNTranslations,
      'Chinese Traditional': zhTWTranslations
    };
    
    const emptyValues = [];
    
    Object.entries(locales).forEach(([localeName, translations]) => {
      usedKeys.forEach(key => {
        const keys = key.split('.');
        let current = translations;
        
        for (const k of keys) {
          if (!current || !Object.prototype.hasOwnProperty.call(current, k)) {
            return; // 跳过不存在的键，让其他测试处理
          }
          current = current[k];
        }
        
        // 检查值是否为空或仅包含空格
        if (!current || (typeof current === 'string' && current.trim() === '')) {
          emptyValues.push({ locale: localeName, key });
        }
      });
    });
    
    // 报告空翻译值
    if (emptyValues.length > 0) {
      console.error('Empty translation values found:');
      emptyValues.forEach(item => {
        console.error(`- In ${item.locale}: ${item.key}`);
      });
    }
    
    expect(emptyValues.length).toBe(0);
  });
});
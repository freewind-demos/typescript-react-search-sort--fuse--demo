import React, { FC, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './Hello.pcss';

// 示例文件名数据集
const sampleFiles = [
  'user_profile.tsx',
  'UserDashboard.jsx',
  'api-controller.ts',
  'mainConfig.js',
  'auth_middleware.ts',
  'event-emitter.js',
  'DataTransformer.ts',
  'test helper.js',
  'snake_case_file.tsx',
  'camelCaseExample.jsx',
  'kebab-case-component.tsx',
  'PascalCaseFile.ts',
  'mixed_Case-file.js',
  'UPPERCASE_FILE.tsx',
];

type FuseOptions = {
  isCaseSensitive: boolean;
  includeScore: boolean;
  shouldSort: boolean;
  threshold: number;
  tokenize: boolean;
  minMatchCharLength: number;
};

export const Hello: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>(sampleFiles);
  const [options, setOptions] = useState<FuseOptions>({
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    threshold: 0.8,
    tokenize: false,
    minMatchCharLength: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults(sampleFiles);
      return;
    }
    
    const fuse = new Fuse(sampleFiles, options);
    const searchResults = fuse.search(searchTerm);
    setResults(searchResults.map(result => result.item));
  }, [searchTerm, options]);

  return (
    <div className="Hello">
      <h1>Fuse.js 文件搜索示例</h1>
      
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="输入搜索词..."
          className="search-input"
        />
      </div>

      <div className="options-panel">
        <label>
          <input
            type="checkbox"
            checked={options.isCaseSensitive}
            onChange={(e) => setOptions({...options, isCaseSensitive: e.target.checked})}
          />
          区分大小写
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={options.shouldSort}
            onChange={(e) => setOptions({...options, shouldSort: e.target.checked})}
          />
          结果排序
        </label>

        <div>
          <label>
            模糊匹配阈值: {options.threshold}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={options.threshold}
              onChange={(e) => setOptions({...options, threshold: parseFloat(e.target.value)})}
            />
          </label>
        </div>
      </div>

      <div className="results">
        <h3>搜索结果：</h3>
        {results.length > 0 ? (
          <ul>
            {results.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        ) : (
          <p>无匹配结果</p>
        )}
      </div>
    </div>
  );
};

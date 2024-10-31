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
  findAllMatches: boolean;
  location: number;
  distance: number;
  useExtendedSearch: boolean;
  ignoreLocation: boolean;
  keys: string[];
};

export const Hello: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Array<{ item: string; score?: number }>>(
    sampleFiles.map(file => ({ item: file }))
  );
  const [options, setOptions] = useState<FuseOptions>({
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    threshold: 0.6,
    tokenize: false,
    minMatchCharLength: 1,
    findAllMatches: false,
    location: 0,
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: false,
    keys: ['*'],
  });

  // 添加示例关键词
  const sampleKeywords = [
    { text: 'user', desc: '测试基础搜索' },
    { text: 'FILE', desc: '测试大小写敏感' },
    { text: 'case', desc: '测试不同命名风格' },
    { text: 'test h', desc: '测试空格和距离参数' },
    { text: '.tsx', desc: '测试文件扩展名搜索' },
    { text: 'dash', desc: '测试部分匹配' },
  ];

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults(sampleFiles.map(file => ({ item: file })));
      return;
    }
    
    const fuse = new Fuse(sampleFiles, options);
    const searchResults = fuse.search(searchTerm);
    setResults(searchResults);
  }, [searchTerm, options]);

  return (
    <div className="Hello">
      <h1>Fuse.js 文件搜索示例</h1>
      
      <div className="main-container">
        {/* 左侧参数面板 */}
        <div className="params-panel">
          <h3>搜索参数设置</h3>
          <div className="options-grid">
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
                checked={options.includeScore}
                onChange={(e) => setOptions({...options, includeScore: e.target.checked})}
              />
              包含匹配分数
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.shouldSort}
                onChange={(e) => setOptions({...options, shouldSort: e.target.checked})}
              />
              结果排序
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.tokenize}
                onChange={(e) => setOptions({...options, tokenize: e.target.checked})}
              />
              分词匹配
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.findAllMatches}
                onChange={(e) => setOptions({...options, findAllMatches: e.target.checked})}
              />
              查找所有匹配
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.useExtendedSearch}
                onChange={(e) => setOptions({...options, useExtendedSearch: e.target.checked})}
              />
              使用扩展搜索
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.ignoreLocation}
                onChange={(e) => setOptions({...options, ignoreLocation: e.target.checked})}
              />
              忽略位置
            </label>

            <div className="slider-option">
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

            <div className="slider-option">
              <label>
                最小匹配长度: {options.minMatchCharLength}
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={options.minMatchCharLength}
                  onChange={(e) => setOptions({...options, minMatchCharLength: parseInt(e.target.value)})}
                />
              </label>
            </div>

            <div className="slider-option">
              <label>
                位置: {options.location}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.location}
                  onChange={(e) => setOptions({...options, location: parseInt(e.target.value)})}
                />
              </label>
            </div>

            <div className="slider-option">
              <label>
                距离: {options.distance}
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={options.distance}
                  onChange={(e) => setOptions({...options, distance: parseInt(e.target.value)})}
                />
              </label>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="content-panel">
          {/* 搜索输入框 */}
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="输入搜索关键词..."
              className="search-input"
            />
          </div>

          {/* 示例关键词按钮 */}
          <div className="keyword-buttons">
            {sampleKeywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(keyword.text)}
                title={keyword.desc}
                className="keyword-button"
              >
                {keyword.text}
              </button>
            ))}
          </div>

          {/* 搜索结果 */}
          <div className="search-results">
            {results.length > 0 ? (
              <ul>
                {results.map((result, index) => (
                  <li key={index}>
                    {result.item}
                    {result.score !== undefined && (
                      <span className="score">（匹配度：{(1 - result.score).toFixed(2)}）</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>无匹配结果</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

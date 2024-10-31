import React, { FC, useState, useEffect } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
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
  includeMatches: boolean;
};

// 添加 Fuse.js 的类型定义

// 添加一个高亮文本的组件
const HighlightText: FC<{ text: string; matches: FuseResult<string>['matches'] }> = ({
  text,
  matches
}) => {
  if (!matches || matches.length === 0) {
    return <span>{text}</span>;
  }

  const segments: { text: string; isMatch: boolean }[] = [];
  let lastIndex = 0;

  // 现在 indices 的类型会被正确推断为 Array<[number, number]>
  const indices = matches[0].indices;

  // 添加类型注解来修复 [start, end] 的类型错误
  indices.forEach(([start, end]: [number, number]) => {
    // 添加未匹配的文本
    if (start > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, start),
        isMatch: false
      });
    }
    // 添加匹配的文本
    segments.push({
      text: text.substring(start, end + 1),
      isMatch: true
    });
    lastIndex = end + 1;
  });

  // 添加剩余的未匹配文本
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isMatch: false
    });
  }

  return (
    <span>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={segment.isMatch ? 'highlight' : undefined}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
};

export const Hello: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Array<FuseResult<string>>>(
    sampleFiles.map(file => ({ 
      item: file, 
      matches: [],
      refIndex: 0,
      score: 1
    }))
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
    includeMatches: true,
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
      setResults(sampleFiles.map(file => ({ 
        item: file, 
        matches: [],
        refIndex: 0,
        score: 1
      })));
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
                onChange={(e) => setOptions({ ...options, isCaseSensitive: e.target.checked })}
              />
              区分大小写
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.includeScore}
                onChange={(e) => setOptions({ ...options, includeScore: e.target.checked })}
              />
              包含匹配分数
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.shouldSort}
                onChange={(e) => setOptions({ ...options, shouldSort: e.target.checked })}
              />
              结果排序
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.tokenize}
                onChange={(e) => setOptions({ ...options, tokenize: e.target.checked })}
              />
              分词匹配
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.findAllMatches}
                onChange={(e) => setOptions({ ...options, findAllMatches: e.target.checked })}
              />
              查找所有匹配
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.useExtendedSearch}
                onChange={(e) => setOptions({ ...options, useExtendedSearch: e.target.checked })}
              />
              使用扩展搜索
            </label>

            <label>
              <input
                type="checkbox"
                checked={options.ignoreLocation}
                onChange={(e) => setOptions({ ...options, ignoreLocation: e.target.checked })}
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
                  onChange={(e) => setOptions({ ...options, threshold: parseFloat(e.target.value) })}
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
                  onChange={(e) => setOptions({ ...options, minMatchCharLength: parseInt(e.target.value) })}
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
                  onChange={(e) => setOptions({ ...options, location: parseInt(e.target.value) })}
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
                  onChange={(e) => setOptions({ ...options, distance: parseInt(e.target.value) })}
                />
              </label>
            </div>
          </div>
        </div>

        {/* 侧内容区 */}
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
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <HighlightText
                  text={result.item}
                  matches={result.matches}
                />
                <span className="score">
                  Score: {result.score?.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

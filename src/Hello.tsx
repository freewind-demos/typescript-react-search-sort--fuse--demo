import React, { FC, useState, useEffect } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
import { Input, Checkbox, Slider, Button, Card, List, Typography, Space, Divider, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';

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

const styles = {
  container: css`
    padding: 24px;
  `,
  mainContainer: css`
    display: flex;
    gap: 24px;
  `,
  paramsPanel: css`
    width: 300px;
  `,
  contentPanel: css`
    flex: 1;
  `,
  highlight: css`
    background-color: #ffd591;
    padding: 0 2px;
    border-radius: 2px;
  `,
  searchResults: css`
    margin-top: 16px;
  `,
  keywordButtons: css`
    margin: 16px 0;
  `,
  score: css`
    color: #8c8c8c;
    font-size: 12px;
    margin-left: 8px;
  `
};

// 添加 Fuse.js 的类型定义

// 添加一个高亮文本的组件
const HighlightText: FC<{ text: string; matches: FuseResult<string>['matches'] }> = ({
  text,
  matches
}) => {
  if (!matches || matches.length === 0) {
    return <Typography.Text>{text}</Typography.Text>;
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
    <Typography.Text>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={segment.isMatch ? styles.highlight : undefined}
        >
          {segment.text}
        </span>
      ))}
    </Typography.Text>
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

  const optionDescriptions = {
    isCaseSensitive: {
      title: '区分大小写',
      description: '启用后，搜索将严格区分大小写。例如，"File" 和 "file" 将被视为不同的词。'
    },
    includeScore: {
      title: '包含匹配分数',
      description: '显示每个结果的匹配程度分数。分数越接近0表示匹配度越高。'
    },
    shouldSort: {
      title: '结果排序',
      description: '根据匹配分数对结果进行排序，匹配度最高的排在最前面。'
    },
    tokenize: {
      title: '分词匹配',
      description: '将搜索词和目标文本分解成单词进行匹配。例如"test helper"会被分解为"test"和"helper"分别匹配。'
    },
    findAllMatches: {
      title: '查找所有匹配',
      description: '在单个字符串中查找所有匹配项，而不是找到第一个匹配后就停止。这对于高亮显示所有匹配项很有用。'
    },
    useExtendedSearch: {
      title: '使用扩展搜索',
      description: '启用高级搜索语法，支持 AND、OR、NOT 等逻辑操作符。例如：^file 表示以file开头，!file 表示不包含file。'
    },
    ignoreLocation: {
      title: '忽略位置',
      description: '忽略文本中的匹配位置，只关注是否匹配。启用后，位置和距离参数将失效。'
    },
    threshold: {
      title: '模糊匹配阈值',
      description: '决定匹配的模糊程度。0.0表示完全匹配，1.0表示完全模糊。值越大，匹配越宽松。例如，0.6时"file"可能匹配到"filed"。'
    },
    minMatchCharLength: {
      title: '最小匹配长度',
      description: '匹配项的最小字符长度。较大的值可以避免过短的无意义匹配。'
    },
    location: {
      title: '位置',
      description: '期望找到匹配的位置。0表示从开头开始。此值影响距离计算，通常用于优先匹配特定位置的结果。'
    },
    distance: {
      title: '距离',
      description: '允许匹配的最大距离。较大的值允许单词间有更多的字符差异。例如，距离为100时，"test helper"可以匹配到"test_helper"。'
    }
  };

  return (
    <div className={styles.container}>
      <Typography.Title level={2}>Fuse.js 文件搜索示例</Typography.Title>

      <div className={styles.mainContainer}>
        <Card title="搜索参数设置" className={styles.paramsPanel}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.isCaseSensitive.title}</strong></div>
                  <div>{optionDescriptions.isCaseSensitive.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.isCaseSensitive}
                onChange={(e) => setOptions({ ...options, isCaseSensitive: e.target.checked })}
              >
                区分大小写
              </Checkbox>
            </Tooltip>
            
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.includeScore.title}</strong></div>
                  <div>{optionDescriptions.includeScore.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.includeScore}
                onChange={(e) => setOptions({ ...options, includeScore: e.target.checked })}
              >
                包含匹配分数
              </Checkbox>
            </Tooltip>
            
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.shouldSort.title}</strong></div>
                  <div>{optionDescriptions.shouldSort.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.shouldSort}
                onChange={(e) => setOptions({ ...options, shouldSort: e.target.checked })}
              >
                结果排序
              </Checkbox>
            </Tooltip>
            
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.tokenize.title}</strong></div>
                  <div>{optionDescriptions.tokenize.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.tokenize}
                onChange={(e) => setOptions({ ...options, tokenize: e.target.checked })}
              >
                分词匹配
              </Checkbox>
            </Tooltip>
            
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.findAllMatches.title}</strong></div>
                  <div>{optionDescriptions.findAllMatches.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.findAllMatches}
                onChange={(e) => setOptions({ ...options, findAllMatches: e.target.checked })}
              >
                查找所有匹配
              </Checkbox>
            </Tooltip>
            
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.useExtendedSearch.title}</strong></div>
                  <div>{optionDescriptions.useExtendedSearch.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.useExtendedSearch}
                onChange={(e) => setOptions({ ...options, useExtendedSearch: e.target.checked })}
              >
                使用扩展搜索
              </Checkbox>
            </Tooltip>
            
            <Tooltip 
              title={
                <div>
                  <div><strong>{optionDescriptions.ignoreLocation.title}</strong></div>
                  <div>{optionDescriptions.ignoreLocation.description}</div>
                </div>
              }
            >
              <Checkbox
                checked={options.ignoreLocation}
                onChange={(e) => setOptions({ ...options, ignoreLocation: e.target.checked })}
              >
                忽略位置
              </Checkbox>
            </Tooltip>

            <div>
              <Typography.Text>模糊匹配阈值</Typography.Text>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={options.threshold}
                onChange={(value) => setOptions({ ...options, threshold: value })}
                tooltip={{ formatter: value => value?.toString() }}
                marks={{ 0: '0', 1: '1' }}
              />
            </div>

            <div>
              <Typography.Text>最小匹配长度</Typography.Text>
              <Slider
                min={1}
                max={10}
                value={options.minMatchCharLength}
                onChange={(value) => setOptions({ ...options, minMatchCharLength: value })}
                tooltip={{ formatter: value => value?.toString() }}
                marks={{ 1: '1', 10: '10' }}
              />
            </div>

            <div>
              <Typography.Text>位置</Typography.Text>
              <Slider
                min={0}
                max={100}
                value={options.location}
                onChange={(value) => setOptions({ ...options, location: value })}
                tooltip={{ formatter: value => value?.toString() }}
                marks={{ 0: '0', 100: '100' }}
              />
            </div>

            <div>
              <Typography.Text>距离</Typography.Text>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={options.distance}
                onChange={(value) => setOptions({ ...options, distance: value })}
                tooltip={{ formatter: value => value?.toString() }}
                marks={{ 0: '0', 1000: '1000' }}
              />
            </div>
          </Space>
        </Card>

        <div className={styles.contentPanel}>
          <Input
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入搜索关键词..."
            prefix={<SearchOutlined />}
          />

          <div className={styles.keywordButtons}>
            <Space wrap>
              {sampleKeywords.map((keyword, index) => (
                <Button
                  key={index}
                  onClick={() => setSearchTerm(keyword.text)}
                  title={keyword.desc}
                >
                  {keyword.text}
                </Button>
              ))}
            </Space>
          </div>

          <List
            className={styles.searchResults}
            dataSource={results}
            renderItem={(result, index) => (
              <List.Item>
                <HighlightText
                  text={result.item}
                  matches={result.matches}
                />
                <span className={styles.score}>
                  Score: {result.score?.toFixed(3)}
                </span>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

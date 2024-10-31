import { Typography } from 'antd';
import { FuseResult } from 'fuse.js';
import React, { FC } from 'react';

export const HighlightText: FC<{ text: string; matches: FuseResult<string>['matches'] }> = ({
    text,
    matches
}) => {
    if (!matches || matches.length === 0) {
        return <Typography.Text>{text}</Typography.Text>;
    }

    const segments: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    const indices = matches[0].indices;

    indices.forEach(([start, end]: [number, number]) => {
        if (start > lastIndex) {
            segments.push({
                text: text.substring(lastIndex, start),
                isMatch: false
            });
        }
        segments.push({
            text: text.substring(start, end + 1),
            isMatch: true
        });
        lastIndex = end + 1;
    });

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
                    style={segment.isMatch ? {
                        backgroundColor: '#ffd591',
                        padding: '0 2px',
                        borderRadius: '2px'
                    }
                        : undefined
                    }
                >
                    {segment.text}
                </span>
            ))}
        </Typography.Text>
    );
}; 
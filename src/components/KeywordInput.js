console.log('KeywordInput.js loading...');

const KeywordInput = ({ keywords, onKeywordsChange, matchingStrategy, onMatchingStrategyChange }) => {
    const { createElement: h } = React;

    const handleKeywordInput = (e) => {
        const input = e.target;
        const value = input.value.trim();
        
        // Handle comma or enter key
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            
            // Split by comma and clean up
            const newKeywords = value
                .split(',')
                .map(k => k.trim())
                .filter(k => k && !keywords.includes(k));
            
            if (newKeywords.length > 0) {
                onKeywordsChange([...keywords, ...newKeywords]);
                input.value = '';
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        
        // Split by comma and clean up
        const newKeywords = pastedText
            .split(',')
            .map(k => k.trim())
            .filter(k => k && !keywords.includes(k));
        
        if (newKeywords.length > 0) {
            onKeywordsChange([...keywords, ...newKeywords]);
            e.target.value = '';
        }
    };

    const removeKeyword = (keyword) => {
        onKeywordsChange(keywords.filter(k => k !== keyword));
    };

    return h('div', { className: 'space-y-4' },
        h('div', { className: 'flex flex-col space-y-2' },
            h('label', { className: 'text-sm font-medium text-gray-700' }, 'Keywords'),
            h('div', { className: 'relative' },
                h('input', {
                    id: 'newKeyword',
                    type: 'text',
                    className: 'w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
                    placeholder: 'Enter keywords separated by commas',
                    onKeyDown: handleKeywordInput,
                    onPaste: handlePaste
                }),
                h('div', { className: 'text-xs text-gray-500 mt-1' },
                    'Press Enter or comma to add multiple keywords'
                )
            )
        ),
        h('div', { className: 'flex flex-wrap gap-2' },
            keywords.map(keyword =>
                h('span', {
                    key: keyword,
                    className: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700'
                },
                    keyword,
                    h('button', {
                        onClick: () => removeKeyword(keyword),
                        className: 'ml-2 text-primary-600 hover:text-primary-800 focus:outline-none'
                    }, '×')
                )
            )
        ),
        h('div', { className: 'flex flex-col space-y-2' },
            h('label', { className: 'text-sm font-medium text-gray-700' }, 'Matching Strategy'),
            h('select', {
                value: matchingStrategy,
                onChange: (e) => onMatchingStrategyChange(e.target.value),
                className: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
            },
                h('option', { value: 'exact' }, 'Exact Match'),
                h('option', { value: 'partial' }, 'Partial Match'),
                h('option', { value: 'regex' }, 'Regex Match')
            )
        )
    );
};

// Make component available globally
window.KeywordInput = KeywordInput;

console.log('KeywordInput.js loaded successfully'); 
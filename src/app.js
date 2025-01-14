console.log('App.js loading...');

// Verify React is available
if (!window.React) {
    throw new Error('React not loaded when initializing App');
}

const { Component, createElement: h } = React;

// Error Boundary Component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return h('div', { className: 'error-message' },
                h('h2', { className: 'font-bold mb-2' }, 'Something went wrong'),
                h('p', null, this.state.error?.message || 'Unknown error')
            );
        }
        return this.props.children;
    }
}

// Export for global use
window.ErrorBoundary = ErrorBoundary;

const App = () => {
    const { createElement: h, useState, useCallback } = React;

    const [text, setText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [matchingStrategy, setMatchingStrategy] = useState('exact');
    const [windowSize, setWindowSize] = useState(10);

    const handleTextChange = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const handleFileLoad = useCallback((fileContent) => {
        setText(fileContent);
    }, []);

    const handleWindowSizeChange = useCallback((e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setWindowSize(value);
        }
    }, []);

    return h('div', { className: 'min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8' },
        h('div', { className: 'max-w-7xl mx-auto' },
            h('div', { className: 'text-center mb-8 animate-fade-in' },
                h('h1', { className: 'text-4xl font-bold text-gray-900 mb-2' },
                    'Multi-Keyword Density Analyzer'
                ),
                h('p', { className: 'text-lg text-gray-600 max-w-3xl mx-auto' },
                    'Analyze keyword density and find intersection clusters in your text with advanced visualization'
                )
            ),
            h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8' },
                h('div', { className: 'lg:col-span-4 space-y-6' },
                    h(KeywordInput, {
                        keywords,
                        onKeywordsChange: setKeywords,
                        matchingStrategy,
                        onMatchingStrategyChange: setMatchingStrategy
                    }),
                    h('div', { className: 'space-y-2' },
                        h('label', { className: 'text-sm font-medium text-gray-700' },
                            'Window Size (%)'
                        ),
                        h('div', { className: 'flex items-center space-x-2' },
                            h('input', {
                                type: 'range',
                                min: '1',
                                max: '100',
                                value: windowSize,
                                onChange: handleWindowSizeChange,
                                className: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                            }),
                            h('span', { className: 'text-sm text-gray-600 font-medium' },
                                `${windowSize}%`
                            )
                        )
                    ),
                    h(FileUpload, { onTextLoad: handleFileLoad })
                ),
                h('div', { className: 'lg:col-span-8 space-y-6' },
                    h('div', { className: 'space-y-2' },
                        h('label', { className: 'text-sm font-medium text-gray-700' },
                            'Text Input'
                        ),
                        h('textarea', {
                            value: text,
                            onChange: handleTextChange,
                            className: 'block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-48 resize-y',
                            placeholder: 'Enter or paste your text here...'
                        })
                    ),
                    text && keywords.length > 0 && h(ResultsDisplay, {
                        text,
                        keywords,
                        matchingStrategy,
                        windowSize: Math.floor(text.split(/\s+/).length * (windowSize / 100))
                    })
                )
            )
        )
    );
};

// Make App available globally
window.App = App;

console.log('App.js loaded successfully');
const ResultsDisplay = ({ text, keywords, matchingStrategy, windowSize }) => {
    const { createElement: h, useMemo } = React;

    const results = useMemo(() => {
        if (!text || !keywords.length) return null;

        const overallStats = utils.getOverallStats(text, keywords, matchingStrategy);
        const individualClusters = keywords.map(keyword => ({
            keyword,
            clusters: utils.findKeywordClusters(text, keyword, windowSize, matchingStrategy)
        }));

        return {
            overallStats,
            individualClusters,
            highlightedFullText: utils.highlightText(text, keywords, matchingStrategy)
        };
    }, [text, keywords, matchingStrategy, windowSize]);

    if (!results) {
        return h('div', { 
            className: 'text-gray-500 text-center py-16 animate-fade-in',
            style: { animation: 'fadeIn 0.5s ease-out' }
        },
            h('p', { className: 'text-lg font-medium' }, 'Enter text and keywords to begin analysis'),
            h('p', { className: 'text-sm mt-2 text-gray-400' }, 'Your results will appear here')
        );
    }

    const { overallStats, individualClusters, highlightedFullText } = results;

    return h('div', { 
        className: 'space-y-8 animate-fade-in',
        style: { animation: 'fadeIn 0.5s ease-out' }
    },
        // Overall Statistics - Now more prominent
        h('div', { 
            className: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all hover:shadow-2xl'
        },
            h('h2', { 
                className: 'text-2xl font-bold text-gray-900 mb-6'
            },
                'Keyword Analysis Overview'
            ),
            h('div', { 
                className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            },
                overallStats.map(({ keyword, density, count }, index) =>
                    h('div', {
                        key: keyword,
                        className: `p-4 rounded-xl bg-white shadow-lg border border-gray-100 transform transition-all hover:-translate-y-1 hover:shadow-xl`,
                        style: {
                            animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }
                    },
                        h('div', { className: 'font-semibold text-lg text-gray-900 mb-2' }, keyword),
                        h('div', { className: 'space-y-1' },
                            h('div', { className: 'flex items-center justify-between' },
                                h('span', { className: 'text-sm text-gray-500' }, 'Occurrences'),
                                h('span', { className: 'text-lg font-bold text-primary-600' }, count)
                            ),
                            h('div', { className: 'flex items-center justify-between' },
                                h('span', { className: 'text-sm text-gray-500' }, 'Density'),
                                h('span', { className: 'text-lg font-bold text-primary-600' }, 
                                    `${density.toFixed(2)}%`
                                )
                            ),
                            h('div', { 
                                className: 'w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden'
                            },
                                h('div', {
                                    className: `bg-primary-${utils.calculateColorIntensity(count, Math.max(...overallStats.map(s => s.count)))} h-full rounded-full transition-all`,
                                    style: { width: `${density}%` }
                                })
                            )
                        )
                    )
                )
            )
        ),

        // Individual Keyword Highest Density Clusters
        h('div', { 
            className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
        },
            individualClusters.map(({ keyword, clusters }, index) => {
                console.log('Processing cluster:', { keyword, matchingStrategy });
                
                return clusters.length > 0 && h('div', {
                    key: keyword,
                    className: 'bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all hover:shadow-xl',
                    style: {
                        animation: `slideIn 0.5s ease-out ${(index + overallStats.length) * 0.1}s both`
                    }
                },
                    h('h3', { 
                        className: 'text-xl font-bold text-gray-900 mb-4'
                    },
                        `Peak Density: "${keyword}"`
                    ),
                    h('div', { 
                        className: 'bg-gray-50 rounded-lg p-4 border border-gray-100'
                    },
                        h('div', { 
                            className: 'flex flex-wrap gap-3 mb-3'
                        },
                            h('div', { 
                                className: 'px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium'
                            }, `${clusters[0].count} occurrences`),
                            h('div', { 
                                className: 'px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium'
                            }, `${clusters[0].density.toFixed(2)}% density`)
                        ),
                        h('div', { 
                            className: 'text-sm text-gray-600 mb-3 font-medium'
                        }, `Words ${clusters[0].start + 1}-${clusters[0].end + 1}`),
                        h('div', {
                            className: 'prose prose-sm max-w-none',
                            dangerouslySetInnerHTML: {
                                __html: utils.highlightText(
                                    clusters[0].text,
                                    [keyword],
                                    matchingStrategy
                                )
                            }
                        })
                    )
                );
            })
        ),

        // Full Text Analysis
        h('div', { 
            className: 'bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all hover:shadow-xl',
            style: {
                animation: 'slideIn 0.5s ease-out 0.8s both'
            }
        },
            h('h3', { 
                className: 'text-xl font-bold text-gray-900 mb-4'
            },
                'Full Text Analysis'
            ),
            h('div', {
                className: 'prose prose-lg max-w-none prose-primary',
                dangerouslySetInnerHTML: {
                    __html: highlightedFullText.split('\n').map(line => 
                        `<p class="mb-3 leading-relaxed">${line || '&nbsp;'}</p>`
                    ).join('')
                }
            })
        )
    );
}; 
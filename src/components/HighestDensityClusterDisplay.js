const HighestDensityClusterDisplay = ({ text, keywords, windowSize, matchingStrategy }) => {
    const { createElement: h, useMemo } = React;

    const clusters = useMemo(() => {
        if (!text || !keywords.length) return [];

        // Find intersection clusters first
        const intersectionClusters = utils.findIntersectionClusters(text, keywords, windowSize, matchingStrategy);
        
        // Then find individual clusters for each keyword
        const individualClusters = keywords.map(keyword => ({
            keyword,
            clusters: utils.findKeywordClusters(text, keyword, windowSize, matchingStrategy)
        }));

        return {
            intersectionClusters,
            individualClusters
        };
    }, [text, keywords, windowSize, matchingStrategy]);

    if (!text || !keywords.length) {
        return null;
    }

    const { intersectionClusters, individualClusters } = clusters;

    return h('div', { 
        className: 'space-y-8 animate-fade-in',
        style: { animation: 'fadeIn 0.5s ease-out' }
    },
        // Intersection Clusters Section
        intersectionClusters.length > 0 && h('div', {
            className: 'bg-white rounded-xl shadow-lg border border-gray-100 p-6'
        },
            h('h3', { 
                className: 'text-xl font-bold text-gray-900 mb-4'
            }, 
                'Keyword Intersection Clusters'
            ),
            h('div', { 
                className: 'space-y-4'
            },
                intersectionClusters.slice(0, 3).map((cluster, index) =>
                    h('div', {
                        key: index,
                        className: 'bg-gray-50 rounded-lg p-4 border border-gray-100',
                        style: {
                            animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }
                    },
                        h('div', { 
                            className: 'flex flex-wrap gap-2 mb-3'
                        },
                            cluster.keywords.map(keyword =>
                                h('span', {
                                    key: keyword,
                                    className: 'px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium'
                                }, keyword)
                            )
                        ),
                        h('div', { 
                            className: 'text-sm text-gray-600 mb-2'
                        }, 
                            `Words ${cluster.start + 1}-${cluster.end + 1}`
                        ),
                        h('div', {
                            className: 'prose prose-sm max-w-none',
                            dangerouslySetInnerHTML: {
                                __html: utils.highlightText(cluster.text, cluster.keywords, matchingStrategy)
                            }
                        })
                    )
                )
            )
        ),

        // Individual Keyword Clusters Section
        h('div', { 
            className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
        },
            individualClusters.map(({ keyword, clusters }, index) =>
                clusters.length > 0 && h('div', {
                    key: keyword,
                    className: 'bg-white rounded-xl shadow-lg border border-gray-100 p-6',
                    style: {
                        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                    }
                },
                    h('h3', { 
                        className: 'text-xl font-bold text-gray-900 mb-4'
                    },
                        `Highest Density: "${keyword}"`
                    ),
                    h('div', { 
                        className: 'space-y-4'
                    },
                        clusters.slice(0, 2).map((cluster, clusterIndex) =>
                            h('div', {
                                key: clusterIndex,
                                className: 'bg-gray-50 rounded-lg p-4 border border-gray-100'
                            },
                                h('div', { 
                                    className: 'flex flex-wrap gap-3 mb-3'
                                },
                                    h('div', { 
                                        className: 'px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium'
                                    }, `${cluster.count} occurrences`),
                                    h('div', { 
                                        className: 'px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium'
                                    }, `${cluster.density.toFixed(2)}% density`)
                                ),
                                h('div', { 
                                    className: 'text-sm text-gray-600 mb-2'
                                }, 
                                    `Words ${cluster.start + 1}-${cluster.end + 1}`
                                ),
                                h('div', {
                                    className: 'prose prose-sm max-w-none',
                                    dangerouslySetInnerHTML: {
                                        __html: utils.highlightText(cluster.text, [keyword], matchingStrategy)
                                    }
                                })
                            )
                        )
                    )
                )
            )
        )
    );
}; 
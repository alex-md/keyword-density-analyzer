const utils = {
    calculateDensity: (text, keyword, matchingStrategy = 'exact') => {
        if (!text || !keyword) return { count: 0, density: 0 };
        
        const words = text.split(/\s+/);
        let count = 0;
        
        switch (matchingStrategy) {
            case 'exact':
                count = words.filter(word => word.toLowerCase() === keyword.toLowerCase()).length;
                break;
            case 'partial':
                count = words.filter(word => word.toLowerCase().includes(keyword.toLowerCase())).length;
                break;
            case 'regex':
                try {
                    const regex = new RegExp(keyword, 'gi');
                    count = (text.match(regex) || []).length;
                } catch (e) {
                    console.error('Invalid regex pattern:', e);
                    count = 0;
                }
                break;
            default:
                count = words.filter(word => word.toLowerCase() === keyword.toLowerCase()).length;
        }
        
        const density = (count / words.length) * 100;
        return { count, density };
    },

    findKeywordClusters: (text, keyword, windowSize, matchingStrategy = 'exact') => {
        if (!text || !keyword || windowSize <= 0) return [];
        
        const words = text.split(/\s+/);
        const clusters = [];
        
        for (let i = 0; i <= words.length - windowSize; i++) {
            const windowText = words.slice(i, i + windowSize).join(' ');
            const { count, density } = utils.calculateDensity(windowText, keyword, matchingStrategy);
            
            if (count > 0) {
                clusters.push({
                    text: windowText,
                    start: i,
                    end: i + windowSize - 1,
                    count,
                    density
                });
            }
        }
        
        return clusters.sort((a, b) => b.density - a.density);
    },

    findIntersectionClusters: (text, keywords, windowSize, matchingStrategy = 'exact') => {
        if (!text || !keywords.length || windowSize <= 0) return [];
        
        const words = text.split(/\s+/);
        const clusters = [];
        
        for (let i = 0; i <= words.length - windowSize; i++) {
            const windowText = words.slice(i, i + windowSize).join(' ');
            const keywordsFound = keywords.filter(keyword => {
                const { count } = utils.calculateDensity(windowText, keyword, matchingStrategy);
                return count > 0;
            });
            
            if (keywordsFound.length > 1) {
                clusters.push({
                    text: windowText,
                    start: i,
                    end: i + windowSize - 1,
                    keywords: keywordsFound
                });
            }
        }
        
        return clusters.sort((a, b) => b.keywords.length - a.keywords.length);
    },

    getOverallStats: (text, keywords, matchingStrategy = 'exact') => {
        if (!text || !keywords.length) return [];
        
        return keywords.map(keyword => ({
            keyword,
            ...utils.calculateDensity(text, keyword, matchingStrategy)
        }));
    },

    calculateColorIntensity: (count, textLength) => {
        if (textLength === 0) return 200;
        // Calculate density as percentage (occurrences per 100 words)
        const density = (count / (textLength / 100));
        // Scale intensity based on density thresholds
        // 0-1% -> 400
        // 1-2% -> 300
        // 2-3% -> 200
        // >3% -> 100
        if (density <= 1) return 400;
        if (density <= 2) return 300;
        if (density <= 3) return 200;
        return 100;
    },

    highlightText: (text, keywords, matchingStrategy = 'exact') => {
        if (!text || !keywords.length) return text;
        
        let highlightedText = text;
        const wordCount = text.split(/\s+/).length;

        keywords.forEach(keyword => {
            const { count } = utils.calculateDensity(text, keyword, matchingStrategy);
            const colorIntensity = utils.calculateColorIntensity(count, wordCount);
            
            let pattern;
            switch (matchingStrategy) {
                case 'exact':
                    pattern = new RegExp(`\\b${keyword}\\b`, 'gi');
                    break;
                case 'partial':
                    pattern = new RegExp(`\\b\\w*${keyword}\\w*\\b`, 'gi');
                    break;
                case 'regex':
                    try {
                        pattern = new RegExp(keyword, 'gi');
                    } catch (e) {
                        console.error('Invalid regex pattern:', e);
                        return;
                    }
                    break;
                default:
                    pattern = new RegExp(`\\b${keyword}\\b`, 'gi');
            }
            
            highlightedText = highlightedText.replace(pattern, match => 
                `<mark class="bg-danger-${colorIntensity} bg-opacity-60 rounded px-1">${match}</mark>`
            );
        });
        
        return highlightedText;
    }
}; 

window.utils = utils; 
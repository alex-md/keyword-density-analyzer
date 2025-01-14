# Keyword Analyzer

A powerful web-based tool for analyzing keyword density, finding keyword clusters, and visualizing keyword distribution in text content.

## Features

- **Keyword Density Analysis**: Calculate the frequency and density of keywords in text
- **Multiple Matching Strategies**:
  - Exact match
  - Partial match
  - Regex pattern matching
- **Cluster Analysis**: Find areas of text with high keyword concentration
- **Multi-keyword Intersection**: Identify sections where multiple keywords appear together
- **Visual Highlighting**: Dynamic text highlighting with intensity based on keyword density
- **Real-time Analysis**: Instant results as you type or upload content

## Usage

1. Enter or upload your text content
2. Input your target keywords
3. Choose your matching strategy (exact, partial, or regex)
4. View results including:
   - Overall keyword statistics
   - Density percentages
   - Highest density clusters
   - Highlighted text visualization

## Technical Details

The analyzer provides several utility functions:

- `calculateDensity`: Computes keyword frequency and density
- `findKeywordClusters`: Identifies text segments with high keyword concentration
- `findIntersectionClusters`: Locates areas where multiple keywords overlap
- `getOverallStats`: Generates comprehensive keyword statistics
- `highlightText`: Creates visually highlighted text based on keyword density

## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser
3. Start analyzing your text content

## Browser Compatibility

Works in all modern browsers that support ES6+ JavaScript.

## License

MIT License - Feel free to use and modify as needed. 
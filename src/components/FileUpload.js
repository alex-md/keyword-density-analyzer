const FileUpload = ({ onTextLoad }) => {
    const { createElement: h } = React;

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'text/plain') {
            alert('Please upload a .txt file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            onTextLoad(e.target.result);
        };
        reader.readAsText(file);
    };

    return h('div', { className: 'space-y-2' },
        h('label', { className: 'text-sm font-medium text-gray-700' }, 'Upload Text File'),
        h('div', { className: 'flex items-center justify-center w-full' },
            h('label', {
                className: 'flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
            },
                h('div', { className: 'flex flex-col items-center justify-center pt-5 pb-6' },
                    h('svg', {
                        className: 'w-8 h-8 mb-4 text-gray-500',
                        'aria-hidden': 'true',
                        xmlns: 'http://www.w3.org/2000/svg',
                        fill: 'none',
                        viewBox: '0 0 20 16'
                    },
                        h('path', {
                            stroke: 'currentColor',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: '2',
                            d: 'M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                        })
                    ),
                    h('p', { className: 'mb-2 text-sm text-gray-500' },
                        h('span', { className: 'font-semibold' }, 'Click to upload'),
                        ' or drag and drop'
                    ),
                    h('p', { className: 'text-xs text-gray-500' }, '.txt files only')
                ),
                h('input', {
                    type: 'file',
                    className: 'hidden',
                    accept: '.txt',
                    onChange: handleFileUpload
                })
            )
        )
    );
}; 
module.exports = {
    icon: true,
    typescript: true,
    prettier: false, // Tắt prettier trong SVGR
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
    svgoConfig: {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        removeViewBox: false,
                    },
                },
            },
        ],
    },
}

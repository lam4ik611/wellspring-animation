module.exports = {
    syntax: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-mixins': {},
        'postcss-for': {},
        'postcss-each-variables': {},
        'postcss-each': {},
        'postcss-conditionals': {},
        'postcss-simple-vars': {},
        'postcss-calc': {precision: 6},
        'postcss-preset-env': {
            browsers: ['last 2 versions', '> 1%'],
            stage: 0,
        },
        'postcss-nested-ancestors': {},
        'postcss-nested': {},
        'postcss-extend': {},
        'autoprefixer': {}
    }
};

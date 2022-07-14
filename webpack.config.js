import path from 'path'

export default {
    mode: 'development',
    entry:{
        mapa: './src/js/mapa.js',
        addImage: './src/js/add-image.js'
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}
import path from 'path'

export default {
    mode: 'development',
    entry:{
        mapa: './src/js/mapa.js',
        addImage: './src/js/add-image.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        homeMap: './src/js/homeMap.js',
        changeState: './src/js/changeState.js'
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}
module.exports = {
    devServer: {
        proxy: {
            '/register': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            },
            '/login': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            },
            '/ba-from-loc': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            },
            '/index': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            },
            '/data': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            },
            '/forecast': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            },
            '/historical': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            }
        }
    }
}
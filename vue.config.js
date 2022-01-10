module.exports = {
    devServer: {
        proxy: {
            // '/register': {
            //     target: 'https://api2.watttime.org/v2',
            //     changeOrigin: true
            // },
            '/login': {
                target: 'https://api2.watttime.org/v2',
                changeOrigin: true
            }
        }
    }
}
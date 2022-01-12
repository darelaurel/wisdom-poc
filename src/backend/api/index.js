const axios = require('axios');

const register = async (credentials) => {
    try {
        return await axios.post('https://api2.watttime.org/v2/register',{...credentials})
    } catch (error) {
        console.log({ error })
        return error.response
    }
};

const login = async ({username,password}) => {
    try {
        return await axios.get('https://api2.watttime.org/v2/login', {
            headers:{
                'Authorization':'Basic '+ Buffer.from(`${username}:${password}`).toString('base64')
            }
        })
    } catch (error) {
        console.log({ error })
        return error.response
    }
};
const getBalancingAuthority = async (lag, long,token) => {
    try {
        return await axios.get('https://api2.watttime.org/v2/ba-from-loc', {
            params: {
                latitude: lag,
                longitude: long
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        return error.response
    }
}

const getRealTimeEmissionIndex = async ({ba,long=null,lag=null, token}) => {
    try {
        return await axios.get('https://api2.watttime.org/v2/index', {
            params: {
                ba:ba,
                longitude:long,
                latitude:lag
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        return error.response
    }
}

const getGridEmissionData = async ({ ba, long = null, lag = null, token }) => {
    try {
        return await axios.get('https://api2.watttime.org/v2/data', {
            params: {
                ba: ba,
                longitude: long,
                latitude: lag
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        return error.response
    }
}


const getEmissionForecast = async ({ ba, starttime,endtime, token }) => {
    try {
        return await axios.get('https://api2.watttime.org/v2/forecast', {
            params: {
                ba,
                starttime,
                endtime
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        return error.response
    }
}

const getHistorical = async ({ ba, token }) => {
    try {
        return await axios.get('https://api2.watttime.org/v2/historical', {
            params: {
                ba
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        return error.response
    }
}


module.exports = {
    register,
    login,
    getBalancingAuthority,
    getRealTimeEmissionIndex,
    getGridEmissionData,
    getEmissionForecast,
    getHistorical
}
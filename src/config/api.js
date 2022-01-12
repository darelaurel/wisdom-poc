import axios from "axios"
export const getBalancingAuthority = async (lag, long) => {
    try {
        const { data } = await axios('/ba-from-loc', {
            method: "GET",
            mode: "no-cors",
            params: {
                latitude: lag,
                longitude: long
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });

        return { data }

    } catch ({ response: { data } }) {
        return data.error
    }
}

export const getRealTimeEmissionIndex = async (ba)=>{
    try {
        const { data } = await axios('/index', {
            method: "GET",
            mode: "no-cors",
            params: {
                ba
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });

        return { data }

    } catch ({response:{data}}) {

        return data.message
    }
}


export const getGridEmissionData = async (values) => {
    try {
        const { data } = await axios('/data', {
            method: "GET",
            mode: "no-cors",
            params: {
                ...values
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });

        return { data }

    } catch ({ response: { data } }) {

        return data.message
    }
}


export const getEmissionForcast = async (values) => {
    try {
        const { data } = await axios('/forecast', {
            method: "GET",
            mode: "no-cors",
            params: {
                ...values
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });

        return { data }

    } catch ({ response: { data } }) {

        return data.message
    }
}


export const getHistorical = async (ba) => {
    try {
        const { data } = await axios('/historical', {
            method: "GET",
            mode: "no-cors",
            params: {
                ba
            },
            responseType:'blob',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });

        const url = window.URL.createObjectURL(new Blob([data]))

        const link = document.createElement('a')

        link.href= url

        link.setAttribute('download','historical.zip')

        document.body.appendChild(link)

        return { link }

    } catch (error) {

        return { error:'Invalid scope. You do not have sufficient access to this resource. See https://api.watttime.org/plans/ for more information or email contact@watttime.org for pricing. Please note that all users are allowed free access to CAISO_NORTH.'}
    }
}
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
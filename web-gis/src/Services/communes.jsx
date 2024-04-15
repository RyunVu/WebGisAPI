import axios from 'axios';

export async function getCommunesByQueries(queries) {
    const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune?Keyword=${queries}`);

    if (data.isSuccess) return data.result;
    else return null;
}

export async function getCommunes() {
    // console.log('API endpoint:', process.env.REACT_APP_API_ENDPOINT);
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune`);
        if (data.isSuccess) {
            return data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching communes:', error);
        return null;
    }
}

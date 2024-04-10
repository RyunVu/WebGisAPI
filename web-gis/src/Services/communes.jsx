import axios from 'axios';

export async function getCommunesByQueries(queries) {
    const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune?Keyword=${queries}`);

    if (data.isSuccess) return data.result;
    else return null;
}

export async function getCommunes() {
    const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune`);
    if (data.isSuccess) return data.result;
    else return null;
}

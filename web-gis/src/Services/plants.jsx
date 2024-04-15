import axios from 'axios';

export async function getPlants() {
    // console.log('API endpoint:', process.env.REACT_APP_API_ENDPOINT);
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plant`);
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

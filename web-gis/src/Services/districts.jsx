import axios from 'axios';

export async function getActivedDistricts() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/district?Actived=true`);

        if (response.data && response.data.isSuccess) {
            console.log(response.data.result);
            return response.data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

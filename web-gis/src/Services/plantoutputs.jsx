import axios from 'axios';

export async function getCommunesByQueries(queries) {
    const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune?Keyword=${queries}`);

    if (data.isSuccess) return data.result;
    else return null;
}

export async function getPlantOutputs() {
    // console.log('API endpoint:', process.env.REACT_APP_API_ENDPOINT);
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput`);
        if (data.isSuccess) {
            return data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching plant outputs:', error);
        return null;
    }
}

export async function getPlantOutputsWithCommuneId(communeId) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput/commune/${communeId}`);
        if (data.isSuccess) {
            return data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching plant outputs of a commune:', error);
        return null;
    }
}

export async function getPlantOutputsWithPlantIdAndDate(plantId, year, month) {
    try {
        const { data } = await axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/plantOutput/plant/${plantId}/year/${year}/month/${month}`,
        );
        if (data.isSuccess) {
            return data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching plant outputs of plant and time:', error);
        return null;
    }
}

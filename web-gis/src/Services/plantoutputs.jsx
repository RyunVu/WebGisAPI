import axios from 'axios';

export async function getPlantOutputsByQueries(queries) {
    const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput?${queries}`);

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

export async function getPlantOutputById(id) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput/${id}`);
        if (data.isSuccess) return data.result;
        else return null;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function toggleActivedPlantOutputById(id) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput/${id}`);
        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function createPlantOutput(plantoutput) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput`, plantoutput);

        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function updatePlantOutput(id, plantoutput) {
    try {
        const { data } = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput/${id}`, plantoutput);
        console.log('data: ' + JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function deletePlantOutputById(id) {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/plantOutput/${id}`);
        if (data.isSuccess) {
            return data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

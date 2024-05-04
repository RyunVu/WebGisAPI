import axios from 'axios';

export async function getPlantsByQueries(queries) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plant?${queries}`);
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

export async function getActivedPlants() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plant?Actived=true`);

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

export async function getPlantById(id) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/plant/${id}`);
        if (data.isSuccess) return data.result;
        else return null;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function toggleActivedPlantById(id) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/plant/${id}`);
        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function createPlant(plant) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/plant`, plant);

        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function updatePlant(id, plant) {
    try {
        const { data } = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/plant/${id}`, plant);

        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function deletePlantById(id) {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/plant/${id}`);
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

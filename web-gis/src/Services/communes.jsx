import axios from 'axios';

export async function getCommunesByQueries(queries) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune?${queries}`);
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

export async function getActivedCommunes() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune?Actived=true`);

        if (response.data && response.data.isSuccess) {
            // console.log(response.data.result);
            return response.data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export async function getCommuneById(id) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/commune/${id}`);

        console.log(data);

        if (data.isSuccess) return data.result;
        else return null;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
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

export async function toggleActivedCommuneById(id) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/commune/${id}`);
        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function updateCommune(id, Commune) {
    try {
        const { data } = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/commune/${id}`, Commune);

        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function deleteCommuneById(id) {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/commune/${id}`);
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

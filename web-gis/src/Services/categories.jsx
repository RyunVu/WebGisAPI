import axios from 'axios';

export async function getCategoriesByQueries(queries) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/category?${queries}`);
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

export async function getActivedCategories() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/category?Actived=true`);

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

export async function getCategoryById(id) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/category/${id}`);
        if (data.isSuccess) return data.result;
        else return null;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function toggleActivedCategoryById(id) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/category/${id}`);
        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function createCategory(category) {
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/category`, category);

        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function updateCategory(id, category) {
    try {
        const { data } = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/category/${id}`, category);

        return data;
    } catch (error) {
        console.error('Có lỗi:', error);
        return null;
    }
}

export async function deleteCategoryById(id) {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/category/${id}`);
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

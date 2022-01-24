import Axios from "axios";

const baseURL = "http://46.137.187.59:3003";

const CancelToken = Axios.CancelToken;

export default function getAxiosInst() {
    return Axios.create({
        baseURL: baseURL,
    });
}

export const apiHandler = async(
    apiCall, { onSuccess, onError } = {},
    options = { sync: false }
) => {
    let response;
    try {
        const source = CancelToken.source();
        response = await apiCall(source);

        const data = response?.data;

        if (response?.status === 200) {
            if (onSuccess && options.sync) onSuccess(data);
            else if (onSuccess) await onSuccess(data);
        } else {
            const error = new Error("Some Error");
            error.code = response?.status;
            throw error;
        }
    } catch (error) {
        if (Axios.isCancel(error)) {
            console.log("Request canceled", error.message);
        } else {
            response = error.response;
            onError && onError(error, response);
        }
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return response;
    }
};
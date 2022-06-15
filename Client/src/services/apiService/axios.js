import Axios from "axios";
import { toast } from "react-toastify";

const baseURL = "http://localhost:3003/";

const CancelToken = Axios.CancelToken;

export default function getAxiosInst() {
    return Axios.create({
        baseURL: baseURL,
    });
}

export const apiHandler = async (
    apiCall, { onSuccess, onError } = {},

    options = { sync: false }
) => {
    let response;
    try {
        const source = CancelToken.source();
        response = await apiCall(source);
        const data = response?.data;

        if (response?.status === 201 || response?.status===200) {
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

export const apiHandlerStatus = async (
    apiCall, apiName
) => {
    let response;
    try {
        const source = CancelToken.source();
        response = await apiCall(source);

        const data = response?.data;
        if (apiName === 'createUniqueNumber') {
            if (response?.status === 201) {
                return data
            }
            if (response?.status === 200) {
                console.log("detected");
                toast('We detected something wrong with the connection! Please try again')
                // redirectTopath()
            }
            else {
                const error = new Error("Some Error");
                error.code = response?.status;
                throw error;
            }
        }
        if(apiName==='claimTrue'){
            if(response.status===204){
                return response
            }
            else{
                const error = new Error("Some Error");
                error.code = response?.status;
                throw error;
            }
        }
    } catch (error) {
        if (Axios.isCancel(error)) {
            console.log("Request canceled", error.message);
        } else {
            response = error.response;
            return error
        }
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return response;
    }
};
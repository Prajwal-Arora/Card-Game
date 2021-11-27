


export const setLocalStore = (storeName: string, data: any) => {

    try {
        localStorage.setItem(storeName, JSON.stringify(data))
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }

}

export const getLocalStore = (storeName: string) => {

    try {
        const data = localStorage.getItem(storeName);
        if (data) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error(error);
        return null;
    }

}

export const clearLocalStore = (storeName:any) => {
    return localStorage.removeItem(storeName);
}

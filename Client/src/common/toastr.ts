import { toast } from 'react-toastify';



const ShowToastMessage = (messageObject: any, priorMessage?: string) => {

    const { message, id, type } = messageObject;

    toast(priorMessage ?? message, {
        toastId: priorMessage ?? id,
        type: type
    });

}

export default ShowToastMessage;
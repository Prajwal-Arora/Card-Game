import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { FaCaretDown } from "react-icons/fa";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiMessage2Line } from "react-icons/ri";
import "./common.css"
import { useBattleDetail, useSocketDetail, useWalletDetail } from '../store/hooks';



const ChattingBox = () => {
    const path = useLocation();
    let socket: any = useSocketDetail();
    const location = path.pathname.split("?")[0];
    const battleArray = useBattleDetail();
    const walletState: any = useWalletDetail();
    const [isChatBoxHidden, setChatBoxHidden] = useState(true)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<any>([])
    const [messageReceived, setMessageReceived] = useState(false)

    useEffect(() => {
        if(location==='/'){
            setMessages([])
            setChatBoxHidden(true)
        }
    }, [location])

    useEffect(() => {
       if(isChatBoxHidden){
        setMessageReceived(false)
       }
    }, [isChatBoxHidden])


    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (message: any) => {
                console.log(message)
                setMessageReceived(true)
                setMessages((messages: any) => [...messages, message])
                const chatBody: any = document.querySelector('.chat-body')
                chatBody.scrollTop = chatBody.scrollHeight
            })
        }
    }, [socket])

    const sendMessage = (event: any) => {
        event.preventDefault()
        if (message) {
            socket.emit("message", { owner: battleArray.player1, client: walletState.userName, chat: message })
            setMessage('')
        }
    }

    const toggleChatBox = () => {
        const chatBody: any = document.querySelector('.chat-body')
        if (isChatBoxHidden) {
            chatBody.style.display = 'block'
            
            setChatBoxHidden(false)
        }
        else {
            chatBody.style.display = 'none'
            setChatBoxHidden(true)
           
        }
    }

    return (
        <div>
            {
                ((location.includes('cards-selection') || location.includes('game-play') || location === '/risk-factor' || location.includes('game-winner'))&& battleArray?.player2 ) &&
                <div className="chatBoxWrapper">
                    <div className={`chat-box ${!isChatBoxHidden ? 'chat-white' : ''} chat-box-player1`}>
                        <div onClick={toggleChatBox} className={` chat-head ${(isChatBoxHidden && messageReceived) ? 'blinking ' : isChatBoxHidden?'chat-head-bar':''}`}>
                            {/* <h2>Chat Box</h2> */}
                            {!isChatBoxHidden ?
                                <span ><BsFillChatDotsFill /></span> :
                                <span ><RiMessage2Line /></span>}
                        </div>
                        <div className="chat-body position-relative ">
                            <div className="msg-insert">
                                {messages?.map((msg: any) => {
                                    {console.log(msg)}
                                    if (msg.user !== walletState.userName)
                                        return <div className="msg-send">{msg.text}</div>
                                    if (msg.user === walletState.userName)
                                        return <div className="msg-receive">{msg.text}</div>
                                    else
                                        return ''
                                    // return <div className="msg-send">
                                    //     {msg.text}
                                    // </div>
                                })}
                            </div>
                            <div className="chat-text">
                                <input type='text' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.currentTarget.value)} onKeyPress={event => event.key === 'Enter' && sendMessage(event)} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChattingBox
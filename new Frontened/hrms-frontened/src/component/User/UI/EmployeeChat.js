import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useAxios from "../../../hooks/useAxios";
const EmployeeChat = ({ recipientId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const chatSocket = useRef(null);
    const { userId,firstName } = useSelector(state => state.auth);
    const axiosInstance = useAxios()
    useEffect(()=>{
        axiosInstance.get('http://127.0.0.1:8000/messages/')
        .then(response => {
            setMessages(response.data);
        });
    },[userId,recipientId])
    console.log("result in comment",messages)
    useEffect(() => {
        // connecting to the WebSocket
        chatSocket.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/chatting/${recipientId}/${userId}/`
        );
        chatSocket.current.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log(data,"this is the message on*/*/*")
            if (data.senderId == userId || data.recipientId == userId) {
                setMessages(prevMessages => [...prevMessages, data]);
            }
        };
        chatSocket.current.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    }, [recipientId, userId]);

    const handleSendMessage = () => {
        chatSocket.current.send(JSON.stringify({
            'message': message,
            'senderId': userId,
            'recipientId': recipientId,
            'first_name' : firstName
        }));
        setMessage('');
    };

    return (
        <div >         
            <textarea width="40px" readOnly value={messages.map(msg => `${msg.senderId === userId ? firstName : msg.first_name}: ${msg.message}`).join('\n')} cols="30" rows="5" />
            <br />
            <div style={{ display: `flex` }}>
                <input
                    type="text"
                    id="inputText"
                    placeholder='Enter your text here ...'
                    size="22"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyUp={e => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button onClick={handleSendMessage} className="btn btn-success">Send</button>
            </div>
        </div>
    );
};

export default EmployeeChat;
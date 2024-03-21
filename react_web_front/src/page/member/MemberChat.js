import { useEffect, useRef, useState } from "react";

const MemberChat = (props) => {
  const memberId = props.memberId;

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://"); //웹소켓은 시작주소가 http가 아니라 ws임
  const [ws, setWs] = useState({});

  useEffect(() => {
    //연결(webSocket객체 생성하면 자동으로 접속함)
    const socket = new WebSocket(socketServer + "/allChat");
    setWs(socket);

    //이 컴포넌트가 없어질 때(나갈때)
    return () => {
      //소켓 닫음(연결 닫음)
      socket.close();
    };
  }, []);

  //웹소켓 연결이 완료되면 실행할 함수
  const startChat = () => {
    const data = { type: "enter", memberId: memberId };
    ws.send(JSON.stringify(data));
  };

  //클라이언트가 서버로부터 데이터를 받으면 실행되는 함수
  const receiveMsg = (receiveData) => {
    console.log(receiveData);
    //receiveData 콘솔로그 결과 : MessageEvent {isTrusted: true, data: `{"type":"chat","memberId":"user02","message":"nice to meet you. i'm user02"}`, origin: 'ws://192.168.10.35:8888',...}
    //Spring에서 객체를 문자열로 바꿔서 보낸 것은, MessageEvent 객체의 키 중 data라는 키로 받아옴. data의 value를 보면 문자열임.
    //이제 그 data에 담긴 문자열을 객체로 형변환해야함
    const receiveStr = receiveData.data;
    const chat = JSON.parse(receiveStr);
    console.log(receiveStr);
    console.log(chat);
    setChatList([...chatList, chat]);
  };

  //웹소켓 연결이 종료되면 실행되는 함수
  const endChat = () => {};

  //웹소켓 객체에 위의 함수를 연결(위치 중요. 여기에 위치해야함)
  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;

  const [chatList, setChatList] = useState([]); //채팅목록
  const [chatMessage, setChatMessage] = useState(""); //입력받아서 전송할 메세지
  const [btnStatus, setBtnStatus] = useState(true); // 전송버튼 활성화 조건(아무것도 입력되어있지 않으면 전송버튼 비활성화 되어 있음)

  //채팅 입력시 함수
  const inputChatMessage = (e) => {
    const checkValue = e.target.value.replaceAll("\n", ""); //개행문자를 빈문자열로 바꿔
    //  입력값이 없고          엔터를 문자로 바꿨을 때에도 입력값이 없을 때
    if (chatMessage === "" && checkValue === "") {
      setBtnStatus(true);
    } else {
      setChatMessage(e.target.value);
      setBtnStatus(false);
    }
    //setBtnStatus(chatMessage === "" && checkValue === "" ? true : false);
  };

  const sendMessage = () => {
    //ws.send(chatMessage);
    //스프링에서 메세지 수신은 기본적으로 문자열 message만 가능함(message.getPayload()가 문자열임)
    //그러나 우리는 ID도 같이 보내야 함.
    //그래서 아래의 객체를 만들어서, JSON객체의 형태로 문자열로 변환해서 서버에 전송
    const data = { type: "chat", memberId: memberId, message: chatMessage };
    ws.send(JSON.stringify(data));
    setChatMessage("");
    setBtnStatus(true);
  };

  //엔터키를 누르면
  const inputKey = (e) => {
    //엔터키를 누르고, shft키를 누르지 않았고, 입력값이 빈값이 아닐 때
    if (e.keyCode === 13 && !e.shiftKey && chatMessage !== "") {
      sendMessage();
    }
  };

  const chatAreaRef = useRef(null);
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">Websocket Chatting</div>
      <div className="chat-content-wrap">
        <div className="chat-message-area" ref={chatAreaRef}>
          {chatList.map((chat, index) => {
            return (
              <ChattingMessage
                key={"chat-message" + index}
                chat={chat}
                memberId={memberId}
              />
            );
          })}
        </div>
        <div className="chat-input-box">
          <textarea
            className="chat-message"
            placeholder="Input Message..."
            value={chatMessage}
            onChange={inputChatMessage}
            onKeyUp={inputKey}
          />
          <button
            className="send-btn"
            disabled={btnStatus}
            onClick={sendMessage}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

const ChattingMessage = (props) => {
  const chat = props.chat;
  const memberId = props.memberId;

  return (
    <>
      {chat.type === "enter" ? (
        /*누군가 입장하면*/
        <p className="info">
          <span>{chat.memberId}</span>님이 입장하셨습니다.
        </p>
      ) : chat.type === "out" ? (
        /*누군가 나가면*/
        <p className="info">
          <span>{chat.memberId}</span>님이 나가셨습니다.
        </p>
      ) : (
        /*일반적인 채팅메세지면*/
        <div
          className={chat.memberId === memberId ? "chat right" : "chat left"}
        >
          <div className="user">
            <span className="material-icons">account_circle</span>
            <span className="name">{chat.memberId}</span>
          </div>
          <div className="chatting-message">{chat.message}</div>
        </div>
      )}
    </>
  );
};

export default MemberChat;

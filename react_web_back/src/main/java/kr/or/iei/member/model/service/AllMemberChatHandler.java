package kr.or.iei.member.model.service;

import java.util.HashMap;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.iei.member.model.dto.ChatMessage;

@Component
public class AllMemberChatHandler extends TextWebSocketHandler {
	
	//웹소켓에 접속한 회원 정보를 저장하는 map(세션, 아이디)
	private HashMap<WebSocketSession, String> members;
	//채팅방을 각각 만들려면 위 해쉬맵을 좀 더 고민해보면 됨. STOMP를 활용하면 조금 더 쉽게 할 수 있긴 함
	
	public AllMemberChatHandler() {
		super();
		members = new HashMap<WebSocketSession, String>();
	}

	//클라이언트가 웹소켓에 접속하면 그 접속을 자동을 인식해서 호출되는 메소드
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
	}

	//클라이언트가 데이터를 전송하면 해당 데이터를 수신하는 메소드
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		/* 전체 흐름!!!
		 * Client - JS) type, memberId, message가 담긴 객체를 문자열로 바꿔서 전송
		 * Server - Spring) 문자열을 받아서 객체로 변환
		 * Server - Spring) 객체를 다시 문자열로 바꿔서, TextMessage 객체에 담아서 참여한 클라이언트 모두에게 전송
		 * client - JS) 받아온 객체의 key 중 data인 것의 value가 서버가 보낸 문자열임. 그 문자열을 다시 객체로 변환
		 */
		//자바스크립트에서 json객체(type, memberId, message)를 문자열로 바꿔서 전송했음
		ObjectMapper om = new ObjectMapper();//jackson의 내장 객체(받아온 문자열을 다시 객체로 변환하기 위해)
		ChatMessage cm = om.readValue(message.getPayload(), ChatMessage.class);//문자열을 ChatMessage(type, memberId, message)객체로 형변환
		System.out.println(cm);
		if(cm.getType().equals("enter")) {
			//최초 접속하면 -> type == enter -> members에 저장
			members.put(session, cm.getMemberId());
			//입장했다는 메세지 전달
			ChatMessage sendData = new ChatMessage();
			sendData.setType("enter");
			sendData.setMemberId(members.get(session));
			sendData.setMessage("");
			String sendDataStr = om.writeValueAsString(sendData);
			for (WebSocketSession ws : members.keySet()) {
				ws.sendMessage(new TextMessage(sendDataStr));
			}
		}else if(cm.getType().equals("chat")) {
			//채팅메세지를 보내면 -> type == chat -> 현재 접속한 모든 클라이언들에게 메세지 전달
			ChatMessage sendData = new ChatMessage();
			sendData.setType("chat");
			sendData.setMemberId(members.get(session));//또는 cm.getMemberId()
			sendData.setMessage(cm.getMessage());
			//Set<WebSocketSession> keys = members.keySet();//members map의 모든 키를 set 형태로 반환
			String sendDataStr = om.writeValueAsString(sendData);//객체를 문자열로 변경
			for(WebSocketSession ws : members.keySet()) {
				ws.sendMessage(new TextMessage(sendDataStr));
			}
		}
	}

	//클라이언트가 접속을 끊으면 자동으로 호출되는 메소드
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		//나갔다는 메세지 전달
		ObjectMapper om = new ObjectMapper();
		ChatMessage sendData = new ChatMessage();
		sendData.setType("out");
		sendData.setMemberId(members.get(session));
		sendData.setMessage("");
		String sendDataStr = om.writeValueAsString(sendData);
		members.remove(session);//채팅방 나가는 나에게는 메세지를 보낼 필요 없으므로 이 코드 먼저 실행하고 메세지 보냄
		for(WebSocketSession ws : members.keySet()) {
			ws.sendMessage(new TextMessage(sendDataStr));
		}
	}


	
	
	
}

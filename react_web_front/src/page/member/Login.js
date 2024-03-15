import { useState } from "react";
import "./member.css";
import { Button1, Button3, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
  //로그인시 isLogin값 변경 위해 set함수 가져옴
  const loginFunction = props.login;

  //백 서버 주소
  /*
  1. react_web_front폴더 아래에 파일명 .env 이거로 파일 하나 생성하고
  2. 그 파일 안에 다음 내용 입력 : REACT_APP_BACK_SERVER=http://192.168.10.35:8888
  3. 저기서 서버 주소와 포트 번호는 자기꺼에 맞춰서 수정
  4. 프로젝트시 저 서버주소로 에러 뜨지 않도록, git에 commit하기 전에 해당 수정목록을 우클릭하고 ignore하기
  */
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");

  const navigate = useNavigate();

  const login = () => {
    if (memberId !== "" && memberPw !== "") {
      const obj = { memberId, memberPw };
      axios
        .post(backServer + "/member/login", obj)
        .then((res) => {
          if (res.data.message === "success") {
            console.log(res.data.data); // = eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6InVzZXIwMSIsImlhdCI6MTcxMDQ4MzYzMywiZXhwIjoxNzEwNDg3MjMzfQ.PCcJrZOWUFj1A_3oNf2XGJp2DE2RlSSH8pdykLgNNuM
            loginFunction(res.data.data); //App.js 에서 속성으로 받아온 login함수 실행
            Swal.fire("로그인 성공");
            navigate("/");
          } else {
            Swal.fire("아이디 또는 비밀번호를 확인하세요");
          }
        })
        .catch((res) => {
          console.log("에러");
        });
    }
  };

  const join = () => {
    navigate("/join");
  };

  return (
    <div className="login-wrap">
      <div className="page-title">로그인</div>

      <div className="login-input-wrap">
        <label htmlFor="memberId">아이디</label>
        <Input
          type="text"
          content="memberId"
          data={memberId}
          setData={setMemberId}
        />
      </div>

      <div className="login-input-wrap">
        <label htmlFor="memberPw">비밀번호</label>
        <Input
          type="text"
          content="memberPw"
          data={memberPw}
          setData={setMemberPw}
        />
      </div>
      <div className="login-search-box">
        <Link to="#">아이디 찾기</Link>
        <span className="material-icons">horizontal_rule</span>
        <Link to="#">비밀번호 찾기</Link>
      </div>
      <div className="login-btn-box">
        <Button1 text="로그인" clickEvent={login} />
      </div>
      <div className="login-btn-box">
        <Button3 text="회원가입" clickEvent={join} />
      </div>
    </div>
  );
};

export default Login;

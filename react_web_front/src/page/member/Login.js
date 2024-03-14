import { useState } from "react";
import "./member.css";
import { Button1, Button3, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");

  const navigate = useNavigate();

  const login = () => {
    if (memberId !== "" && memberPw !== "") {
      const obj = { memberId, memberPw };
      axios
        .post("http://192.168.10.35:8888/member/login", obj)
        .then((res) => {
          if (res.data.message === "success") {
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

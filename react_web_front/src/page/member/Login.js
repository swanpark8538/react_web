import { useState } from "react";
import "./member.css";
import { Button2, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
    } else {
      Swal.fire("아이디와 비밀번호를 모두 입력해주세요.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="page-title">로그인</div>

      <div className="login-input-wrap">
        <div>
          <div className="label">
            <label htmlFor="memberId">아이디</label>
          </div>
          <div className="input">
            <Input
              type="text"
              content="memberId"
              data={memberId}
              setData={setMemberId}
            />
          </div>
        </div>
      </div>

      <div className="login-input-wrap">
        <div>
          <div className="label">
            <label htmlFor="memberPw">비밀번호</label>
          </div>
          <div className="input">
            <Input
              type="text"
              content="memberPw"
              data={memberPw}
              setData={setMemberPw}
            />
          </div>
        </div>
      </div>
      <div className="check">
        <div className="idCheck">아이디 확인</div>
        <div className="pwCheck">비밀번호 재발급</div>
      </div>
      <div className="login-btn-box">
        <Button2 text="로그인" clickEvent={login} />
      </div>
    </div>
  );
};

export default Login;

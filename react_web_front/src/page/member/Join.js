import { useState } from "react";
import "./member.css";
import { Button2, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Join = () => {
  //백 서버 주소
  /*
  1. react_web_front폴더 아래에 파일명 .env 이거로 파일 하나 생성하고
  2. 그 파일 안에 다음 내용 입력 : REACT_APP_BACK_SERVER=http://192.168.10.35:8888
  3. 저기서 서버 주소와 포트 번호는 자기꺼에 맞춰서 수정
  4. 프로젝트시 저 서버주소로 에러 뜨지 않도록, git에 commit하기 전에 해당 수정목록을 우클릭하고 ignore하기
  */
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //전송용
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");

  //화면구현용
  const [memberPwRe, setMemberPwRe] = useState("");
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");

  const navigate = useNavigate();

  //아이디 입력하고 나갔을 때 이벤트(유효성검사 and 중복체크)
  const idChk = () => {
    //정규표현식으로 유효성 검사
    const idRdg = /^[a-zA-Z0-9]{4,12}$/;
    if (idRdg.test(memberId)) {
      //정규표현식 만족했을 때 → 중복체크
      setCheckIdMsg("정규표현식 만족. 이제 중복체크 할 예정");
      axios
        .get(backServer + "/member/id/" + memberId)
        .then((res) => {
          if (res.data.message === "duplication") {
            console.log("여기1");
            setCheckIdMsg("이미 사용중인 아이디입니다.");
          } else if (res.data.message === "not duplication") {
            console.log("여기2");
            setCheckIdMsg("");
          } else {
            console.log("여기3");
          }
        })
        .catch((res) => {
          console.log("여기4");
          console.log(res);
        });
    } else {
      //정규표현식 만족하지 못했을 때
      setCheckIdMsg("아이디는 영어 대/소문자/숫자로 4~12글자입니다.");
    }
  };

  //비밀번호 확인을 입력하면, 비밀번호와 일치하는지 체크하는 함수
  const pwCheck = () => {
    if (memberPw !== memberPwRe) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwMsg("");
    }
  };

  //회원가입 버튼 클릭시 동작할 이벤트
  const join = () => {
    if (
      memberId !== "" &&
      memberPw !== "" &&
      memberName !== "" &&
      memberPhone !== "" &&
      checkIdMsg === "" &&
      checkPwMsg === ""
    ) {
      const obj = { memberId, memberPw, memberName, memberPhone };
      axios
        .post(backServer + "/member/join", obj) //로그인시에도 post메소드 써야 해서, url에 join 붙임
        .then((res) => {
          if (res.data.message === "success") {
            navigate("/login");
          } else {
            //sweetalert 뜨고 "확인"누르면 그때 then 작동
            Swal.fire(
              "처리중 에러가 발생했습니다. 잠시 후 다시 시도해주세요."
            ).then(() => {
              navigate("/");
            });
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("입력값을 확인하세요");
    }
  };

  return (
    <div className="join-wrap">
      <div className="page-title">회원가입</div>
      <JoinInputWrap
        label="아이디"
        content="memberId"
        type="text"
        data={memberId}
        setData={setMemberId}
        checkMsg={checkIdMsg}
        blurEvent={idChk}
      />
      <JoinInputWrap
        label="비밀번호"
        content="memberPw"
        type="password"
        data={memberPw}
        setData={setMemberPw}
        /*checkMsg속성을 안 적으면, checkMsg 값은 undefined임*/
      />
      <JoinInputWrap
        label="비밀번호확인"
        content="memberPwRe"
        type="password"
        data={memberPwRe}
        setData={setMemberPwRe}
        checkMsg={checkPwMsg}
        blurEvent={pwCheck}
      />
      <JoinInputWrap
        label="이름"
        content="memberName"
        type="text"
        data={memberName}
        setData={setMemberName}
      />
      <JoinInputWrap
        label="전화번호"
        content="memberPhone"
        type="text"
        data={memberPhone}
        setData={setMemberPhone}
      />
      <div className="join-btn-box">
        <Button2 text="회원가입" clickEvent={join} />
      </div>
    </div>
  );
};

const JoinInputWrap = (props) => {
  const label = props.label;
  const content = props.content;
  const type = props.type;
  const data = props.data;
  const setData = props.setData;
  const checkMsg = props.checkMsg;
  const blurEvent = props.blurEvent;

  return (
    <div className="join-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={content}>{label}</label>
        </div>
        <div className="input">
          <Input
            type={type}
            content={content}
            data={data}
            setData={setData}
            blurEvent={blurEvent}
          />
        </div>
      </div>
      {/*js는 null,NaN,undefined면 false로 처리함*/}
      {checkMsg ? <div className="check-msg">{checkMsg}</div> : ""}
    </div>
  );
};

export default Join;

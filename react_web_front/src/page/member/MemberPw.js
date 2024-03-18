import { useState } from "react";
import { Button1, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";

const MemberPw = () => {
  const [isAuth, setIsAuth] = useState(false); //현재 비밀번호를 입력해서 인증 했는지 여부
  const [currPw, setCurrPw] = useState(""); //현재 비밀번호
  const [memberPw, setMemberPw] = useState(""); //새 비밀번호
  const [memberPwRe, setMemberPwRe] = useState(""); //비밀번호 확인
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const checkPw = () => {
    const member = { memberPw: currPw };
    //원래 select는 get메소드가 맞는데, 이 케이스에선 비밀번호를 보내기 때문에 보안상 이유로 post
    axios
      .post(backServer + "/member/pw", member)
      .then((res) => {
        if (res.data.message === "valid") {
          setIsAuth(true);
          setCurrPw("");
        } else {
          Swal.fire({
            icon: "question",
            title: "비밀번호를 확인하세요",
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const changePw = () => {
    if (memberPw !== "" && memberPw === memberPwRe) {
      const m = { memberPw };
      axios
        .patch(backServer + "/member/pw", m)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              icon: "success",
              title: "비밀번호 변경 완료",
            }).then(() => {
              setIsAuth(false); //화면을 바꾸기 위해
              setMemberPw(""); //초기화
              setMemberPwRe(""); //초기화
            });
          } else {
            console.log(res);
          }
        })
        .catch((res) => {});
    }
  };

  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">비밀번호 변경 화면</div>
      <div className="pw-change-wrap">
        {isAuth ? (
          <>
            <div className="pw-input-wrap">
              <div>
                <label htmlFor="memberPw">새 비밀번호</label>
                <Input
                  type="password"
                  content="memberPw"
                  data={memberPw}
                  setData={setMemberPw}
                />
              </div>
              <div>
                <label htmlFor="memberPwRe">비밀번호 확인</label>
                <Input
                  type="password"
                  content="memberPwRe"
                  data={memberPwRe}
                  setData={setMemberPwRe}
                />
                <Button1 text="변경하기" clickEvent={changePw} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pw-input-wrap">
              <div>
                <label htmlFor="currPw">현재 비밀번호</label>
                <Input
                  type="password"
                  content="currPw"
                  data={currPw}
                  setData={setCurrPw}
                />
                <Button1 text="입력" clickEvent={checkPw} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberPw;

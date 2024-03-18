import { useEffect, useState } from "react";
import { Button1, Button3, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MemberInfo = (props) => {
  const member = props.member;
  const logout = props.logout;

  const [phone, setPhone] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER;
  //렌더링 중복 방지용
  useEffect(() => {
    setPhone(member.memberPhone);
  }, [member]);

  const updateMemberPhone = () => {
    const m = { memberId: member.memberId, memberPhone: phone }; //member.memberPhone 아님 주의!!
    axios
      .patch(backServer + "/member/phone", m)
      .then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            icon: "success",
            title: "전화번호가 수정되었습니다.",
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "잠시 후 다시 시도해주세요.",
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const deleteMember = () => {
    //SweetAlert의 기능
    Swal.fire({
      icon: "warning",
      title: "회원탈퇴",
      text: "회원을 탈퇴하시겠습니까?",
      showCancelButton: true, //취소버튼 활성화
      confirmButtonText: "탈퇴하기", //기존의 "확인"버튼에 "확인" 대신 들어갈 텍스트
      cancelButtonText: "취소", //"취솝"버튼에 들어갈 텍스트
    }).then((res) => {
      if (res.isConfirmed) {
        //확인버튼(여기선 "탈퇴하기"버튼) 눌렀을 때
        axios
          .delete(backServer + "/member/") //+member.memberId를 안 적은 이유는, 인터셉터가 알아서 보내주니까
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire("탈퇴 완료").then(() => {
                logout();
              });
            } else {
              console.log(res.data);
            }
          })
          .catch((res) => {
            console.log(res);
          });
      }
    });
  };

  return (
    <div>
      <div className="mypage-current-wrap">
        <h1 className="mypage-current-title">내 정보</h1>
        <table className="member-info-tbl">
          <tbody>
            <tr>
              <td>아이디</td>
              <td>{member.memberId}</td>
            </tr>
            <tr>
              <td>이름</td>
              <td>{member.memberName}</td>
            </tr>
            <tr>
              <td>전화번호</td>
              <td id="member-phone">
                <div>
                  <Input
                    type="text"
                    contet="phone"
                    data={phone}
                    setData={setPhone}
                  />
                  <Button3 text="수정하기" clickEvent={updateMemberPhone} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="delete-btn-box">
          <Button1 text="회원탈퇴" clickEvent={deleteMember} />
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;

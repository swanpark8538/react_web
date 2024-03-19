import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button1, Button2 } from "../../component/FormFrm";
import Swal from "sweetalert2";

const BoardView = (props) => {
  const isLogin = props.isLogin;
  const params = useParams();
  const boardNo = params.boardNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [board, setBoard] = useState({});
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    //최초 화면 로드가 완료된 후에 동작하는 함수
    axios
      .get(backServer + "/board/one/" + boardNo)
      .then((res) => {
        setBoard(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
    if (isLogin) {
      axios.get(backServer + "/member").then((res) => {
        setMember(res.data.data);
      });
    }
  }, []);

  const modify = () => {
    navigate("/board/modify/" + boardNo);
  };

  const deleteBoard = () => {
    Swal.fire({
      icon: "warning",
      text: "게시물을 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(backServer + "/board/" + boardNo)
          .then((res) => {
            if (res.data.message === "success") {
              navigate("/board/list");
            }
          })
          .catch((res) => {
            console.log(res);
          });
      }
    });
  };

  return (
    <div className="board-view-wrap">
      <div className="board-view-top">
        <div className="board-view-thumbnail">
          {board.boardImg === null ? (
            <img src="/image/default.png" />
          ) : (
            <img src={backServer + "/board/thumbnail/" + board.boardImg} />
          )}
        </div>
        <div className="board-view-info">
          <div className="board-view-title">{board.boardTitle}</div>
          <div className="board-view-sub-info">
            <div>{board.boardWriter}</div>
            <div>{board.boardDate}</div>
          </div>
          <div className="board-view-file">
            <div>첨부파일</div>
            <div className="file-zone">
              {/*에러 : board.fileList.map((file,index)=>{})*/}
              {/*왜냐면 useEffect 실행 전에 fileList는 null인데*/}
              {/*map은 배열이 아니면 에러창을 띄우기 때문*/}
              {/*그래서 삼항연산자로 조건 걸어야함*/}
              {board.fileList
                ? board.fileList.map((file, index) => {
                    return <FileItem key={"file" + index} file={file} />;
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>
      <div
        className="board-view-detail"
        //db에 태그까지 포함된 데이터를 가져와서 태그 없이 보에기 하려면 아래처럼 코드
        dangerouslySetInnerHTML={{ __html: board.boardContent }}
      ></div>
      {isLogin ? (
        <div className="board-view-btn-zone">
          {member && member.memberId === board.boardWriter ? (
            <>
              <Button1 text="수정" clickEvent={modify} />
              <Button2 text="삭제" clickEvent={deleteBoard} />
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const FileItem = (props) => {
  const file = props.file;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const fileDown = () => {
    axios
      .get(backServer + "/board/file/" + file.boardFileNo, {
        //axios는 기본적으로 모든 응답을 json으로 처리
        //그러나 이 요청은 파일을 받아야 하므로, json으로 처리 불가능
        //따라서 파일 형식으로 받아야함. 딱 이거 하나만 다름!!
        responseType: "blob",
      })
      .then((res) => {
        //서버에서 바이너리데이터가 들어옴(2진수) -> 이를 blob이라는 파일 형태로 변경
        const blob = new Blob([res.data]);
        //blob데이터를 다운로드할 수 있는 임시 링크를 생성
        const fileObjectUrl = window.URL.createObjectURL(blob);
        //blob데이터를 다운로드할 링크 생성
        const link = document.createElement("a"); //a태그 생성
        link.href = fileObjectUrl; //위에서 만든 파일링크와 연결
        link.style.display = "none"; //화면에서 안 보이도록
        //다운로드할 파일 이름 지정
        link.download = file.filename;
        //마무리
        document.body.appendChild(link); //문서 body에 a태그를 자식으로 추가
        link.click(); //a태그 클릭(->다운로드 진행됨)
        link.remove(); //a태그 삭제
        window.URL.revokeObjectURL(fileObjectUrl); //임시링크 삭제
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div className="board-file">
      <span className="material-icons file-icon" onClick={fileDown}>
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};

export default BoardView;

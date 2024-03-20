import { useState } from "react";
import BoardFrm from "./BoardFrm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BoardWrite = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  //insert를 위해 사용자에게 받아야 하는 정보 : 제목, 썸네일, 내용, 첨부파일
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null); //썸네일. board_file테이블이니까 변수명 다르게
  const [boardFile, setBoardFile] = useState([]); //첨부파일. board_file테이블이니까 변수명 다르게
  //사용자 화면 출력용
  const [boardImg, setBoardImg] = useState(null); //썸네이 미리보기용
  const [fileList, setFileList] = useState([]); //첨부파일 미리보기용

  //글쓰기 버튼 클릭시 함수
  const write = () => {
    console.log(boardTitle);
    console.log(boardContent);
    console.log(thumbnail);
    console.log(boardFile);
    if (boardTitle !== "" && boardContent !== "") {
      //전송용 form객체 생성
      const form = new FormData();
      form.append("boardTitle", boardTitle); //키,밸류
      form.append("boardContent", boardContent);
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }
      axios
        //주소 : url, 보내는 객체 : form, 파일 설정 객체
        .post(backServer + "/board", form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            navigate("/board/list");
          } else {
            Swal.fire("문제 발생");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };

  return (
    <div className="board-write-wrap">
      <div className="board-frm-title">게시글 작성</div>
      <BoardFrm
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardContent={boardContent}
        setBoardContent={setBoardContent}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        boardFile={boardFile}
        setBoardFile={setBoardFile}
        boardImg={boardImg}
        setBoardImg={setBoardImg}
        fileList={fileList}
        setFileList={setFileList}
        buttonFunction={write}
      />
    </div>
  );
};

export default BoardWrite;

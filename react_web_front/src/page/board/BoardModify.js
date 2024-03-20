import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoardFrm from "./BoardFrm";

const BoardModify = () => {
  const params = useParams();
  const boardNo = params.boardNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  //데이터 전송용 : 제목, 썸네일, 내용, 첨부파일
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null); //썸네일. board_file테이블이니까 변수명 다르게
  const [boardFile, setBoardFile] = useState([]); //첨부파일. board_file테이블이니까 변수명 다르게
  //사용자 화면 출력용
  const [boardImg, setBoardImg] = useState(null); //썸네이 미리보기용
  const [fileList, setFileList] = useState([]); //첨부파일 미리보기용
  //삭제한 파일번호를 저장할 배열(삭제파일을 알아야 db랑 드라이브에서 삭제할 수 있음)
  const [delFileNo, setDelFileNo] = useState([]);
  //썸네일 수정여부 체크용
  const [thumbnailCheck, setThumbnailCheck] = useState(0);
  const [oldThumbnail, setOldThumbnail] = useState(null);

  useEffect(() => {
    axios
      .get(backServer + "/board/one/" + boardNo)
      .then((res) => {
        const board = res.data.data;
        setBoardTitle(board.boardTitle);
        setBoardContent(board.boardContent);
        setBoardImg(board.boardImg);
        setFileList(board.fileList);
        setOldThumbnail(board.boardImg);
        console.log(res.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const modify = () => {
    /*
    console.log("boardTitle : " + boardTitle);
    console.log("boardContent : " + boardContent);
    console.log("boardThumbnail : " + thumbnail);
    console.log("boardFile : " + boardFile);
    console.log("oldThumbnail : " + oldThumbnail);
    console.log("thumbnailCheck : " + thumbnailCheck);
    console.log("delFileNo : " + delFileNo);
    */
    const form = new FormData();
    form.append("boardNo", boardNo);
    form.append("boardTitle", boardTitle);
    form.append("boardContent", boardContent);
    form.append("thumbnailCheck", thumbnailCheck);
    form.append("boardImg", oldThumbnail); //기존 썸네일을 boardImg 변수에 저장 -> 썸네일이 변경되지 않으면 기존값 그대로 업데이트 되도록
    //썸네일 수정시 추가
    if (thumbnail !== null) {
      form.append("thumbnail", thumbnail);
    }
    //첨부파일 추가시 추가
    for (let i = 0; i < boardFile.length; i++) {
      form.append("boardFile", boardFile[i]);
    }
    //삭제한 파일번호 배열 추가
    for (let i = 0; i < delFileNo.length; i++) {
      form.append("delFileNo", delFileNo[i]);
    }

    axios
      .patch(backServer + "/board", form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          navigate("/board/view/" + boardNo);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <div className="board-modify-wrap">
      <div className="board-frm-title">게시물 수정</div>
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
        buttonFunction={modify}
        //아래 데이터는 수정하기에서만 보내는 내용
        type="modify"
        delFileNo={delFileNo}
        setDelFileNo={setDelFileNo}
        thumbnailCheck={thumbnailCheck}
        setThumbnailCheck={setThumbnailCheck}
      />
    </div>
  );
};

export default BoardModify;

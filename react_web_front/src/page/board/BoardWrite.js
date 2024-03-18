import { useState } from "react";
import BoardFrm from "./BoardFrm";

const BoardWrite = () => {
  //insert를 위해 사용자에게 받아야 하는 정보 : 제목, 썸네일, 내용, 첨부파일
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null); //board_file테이블이니까 변수명 다르게
  const [boardFile, setBoardFile] = useState([]); //board_file테이블이니까 변수명 다르게

  //사용자 화면 출력용
  const [boardImg, setBoardImg] = useState(null); //썸네이 미리보기용
  const [fileList, setFileList] = useState([]); //첨부파일 미리보기용

  //글쓰기 버튼 클릭시 함수
  const write = () => {
    console.log("게시글 작성 고고");
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

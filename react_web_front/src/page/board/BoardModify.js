import { useParams } from "react-router-dom";

const BoardModify = () => {
  const params = useParams();
  const boardNo = params.boardNo;
  return (
    <div>
      <h1>게시글 수정</h1>
    </div>
  );
};

export default BoardModify;

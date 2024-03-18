import { useEffect, useState } from "react";
import { Button1 } from "../../component/FormFrm";
import axios from "axios";
import Pagination from "../../component/Pagination";
import { useNavigate } from "react-router-dom";

const BoardList = (props) => {
  const isLogin = props.isLogin;
  const [boardList, setBoardList] = useState([]); //게시글
  const [pageInfo, setPageInfo] = useState({}); //페이징
  const [reqPage, setReqPage] = useState(1);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  //reqPage가 바뀔 때마다 페이지전환효과(setBoardList)
  useEffect(() => {
    axios
      .get(backServer + "/board/list/" + reqPage)
      .then((res) => {
        setBoardList(res.data.data.boardList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);

  const writeBtn = () => {
    navigate("/board/write");
  };

  return (
    <>
      {/*먼저!! 로그인 여부에 따라 글쓰기 버튼 보여주기*/}
      {isLogin ? (
        <div className="board-write-btn">
          <Button1 text="글쓰기" clickEvent={writeBtn} />
        </div>
      ) : (
        ""
      )}
      {/*이제 게시글 보여주기*/}
      <div className="board-list-wrap">
        {boardList.map((board, index) => {
          return <BoardItem key={"board" + index} board={board} />;
        })}
      </div>
      {/*페이지 네비게이션*/}
      <div className="board-page">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  return (
    <div className="board-item">
      <div className="board-item-img">
        <img src="/image/default.png" />
      </div>
      <div className="board-item-info">
        <div className="board-item-title">{board.boardTitle}</div>
        <div className="board-item-writer">{board.boardWriter}</div>
        <div className="board-item-date">{board.boardDate}</div>
      </div>
    </div>
  );
};

export default BoardList;

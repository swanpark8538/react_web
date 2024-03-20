import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../component/Pagination";

//* MUI - Switch - Controlled
import Switch from "@mui/material/Switch";

const AdminBoard = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);

  useEffect(() => {
    axios
      .get(backServer + "/admin/board/" + reqPage)
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.data);
          setBoardList(res.data.data.boardList);
          setPageInfo(res.data.data.pi);
        } else {
          console.log(res.data);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);

  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">게시판 관리</div>
      <div className="admin-board-tbl">
        <table>
          <thead>
            <tr>
              <td width={"10%"}>번호</td>
              <td width={"45%"} className="title-td">
                제목
              </td>
              <td width={"15%"}>작성자</td>
              <td width={"15%"}>작성일</td>
              <td width={"15%"}>공개여부</td>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board, index) => {
              return <BoardItem key={"board" + index} board={board} />;
            })}
          </tbody>
        </table>
        <div className="admin-paging-wrap">
          <Pagination
            reqPage={reqPage}
            setReqPage={setReqPage}
            pageInfo={pageInfo}
          />
        </div>
      </div>
    </div>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const [boardStatus, setBoardStatus] = useState(board.boardStatus === 1); //1과 같으면 true
  const backServer = process.env.REACT_APP_BACK_SERVER;

  //위 BoardItem컴포넌트태그 보면, 페이지가 이동해도 key값은 동일함.
  //그래서 페이지가 바뀌더라도 예를 들어 key="board0"인 것은 setBoardStatus가 돌아가지 않기 때문에
  //이전 페이지에서 처리한 boardStatus가 그대로 들어가있음(렌더링X).
  //그래서 uesEffect를 활용해서 board객체가 바뀔 때마다 serBoardStatus를 다시 해야함
  useEffect(() => {
    setBoardStatus(board.boardStatus === 1);
  }, [board]);

  const changeBoardStatus = (e) => {
    const boardNo = board.boardNo;
    const boardStatus = e.target.checked ? 1 : 2;
    const checkedStatus = e.target.checked;
    const b = { boardNo, boardStatus };
    axios
      .patch(backServer + "/admin/boardStatus", b)
      .then((res) => {
        if (res.data.message === "success") {
          setBoardStatus(checkedStatus);
        } else {
          console.log(res.data);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <tr>
      <td>{board.boardNo}</td>
      <td className="title-td">
        <div>
          <Link to={"/board/view/" + board.boardNo}>{board.boardTitle}</Link>
        </div>
      </td>
      <td>{board.boardWriter}</td>
      <td>{board.boardDate}</td>
      <td className="status-td">
        {/*MUI - Switch - Controlled*/}
        <Switch checked={boardStatus} onChange={changeBoardStatus} />
      </td>
    </tr>
  );
};

export default AdminBoard;

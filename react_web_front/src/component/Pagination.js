import "./pagination.css";

const Pagination = (props) => {
  const pageInfo = props.pageInfo;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;

  const changePage = (e) => {
    const pageNo = e.currentTarget.innerText; //버블링 방지currentTarget
    setReqPage(Number(pageNo));
  };
  //paging jsx가 저장될 배열
  const arr = new Array();
  //"맨 앞으로"버튼 - 어느 페이지에서든 1페이지로 이동하는 버튼
  arr.push(
    <span
      key="first-page"
      className="material-icons page-item"
      onClick={() => {
        setReqPage(1);
      }}
    >
      first_page
    </span>
  );
  //"이전 페이지" 버튼 - 현재 페이지보다 1 작은 페이지로 이동. 단 1페이지면 동작 X
  arr.push(
    <span
      key="prev-page"
      className="material-icons page-item"
      onClick={() => {
        if (reqPage != 1) {
          setReqPage(reqPage - 1);
        }
      }}
    >
      navigate_before
    </span>
  );
  //페이징 숫자
  let pageNo = pageInfo.pageNo; //pageInfo.pageNo = 페이지네비게이션에서 맨 앞쪽의 페이지번호
  for (let i = 0; i < pageInfo.pageNaviSize; i++) {
    if (pageNo === Number(reqPage)) {
      arr.push(
        <span key={"page" + i} className="page-item active-page">
          {pageNo}
        </span>
      );
    } else {
      arr.push(
        <span key={"page" + i} className="page-item" onClick={changePage}>
          {pageNo}
        </span>
      );
    }
    pageNo++;
    if (pageNo > pageInfo.totalPage) {
      break;
    }
  }
  //"다음페이지" 버튼
  arr.push(
    <span
      key="next-page"
      className="material-icons page-item"
      onClick={() => {
        if (reqPage != pageInfo.totalPage) {
          setReqPage(Number(reqPage) + 1);
        }
      }}
    >
      navigate_next
    </span>
  );
  //"맨 끝으로" 버튼
  arr.push(
    <span
      key="last-page"
      className="material-icons page-item"
      onClick={() => {
        setReqPage(pageInfo.totalPage);
      }}
    >
      last_page
    </span>
  );

  return <div className="paging-wrap">{arr}</div>;
};

export default Pagination;

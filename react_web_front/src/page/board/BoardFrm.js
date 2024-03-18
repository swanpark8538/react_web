import { Input } from "../../component/FormFrm";

const BoardFrm = (props) => {
  //데이터 전송용(insert를 위해 사용자에게 받아야 하는 정보) : 제목, 썸네일, 내용, 첨부파일
  const boardTitle = props.boardTitle; //""
  const setBoardTitle = props.setBoardTitle;
  const boardContent = props.boardContent; //""
  const setBoardContent = props.setBoardContent;
  const thumbnail = props.thumbnail; //null
  const setThumbnail = props.setThumbnail;
  const boardFile = props.boardFile; //null
  const setBoardFile = props.setBoardFile;

  //사용자 화면 출력용
  const boardImg = props.boardImg; //null
  const setBoardImg = props.setBoardImg;
  const fileList = props.fileList; //[]
  const setFileList = props.setFileList;

  //글쓰기 버튼 클릭시 함수
  const buttonFunction = props.buttonFunction;

  //썸네일 파일 추가시 함수
  const changeThumbnail = (e) => {
    const files = e.currentTarget.files; //버블링이벤트 방지 currentTarget
    if (files.length !== 0 && files[0] != 0) {
      setThumbnail(files[0]); //전송용 state에 file객체 세팅
      //화면에 썸네일 미리보기 세팅
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setBoardImg(reader.result);
      };
    } else {
      //있던 파일 없앴을 때(=취소 눌렀을 때)
      setThumbnail(null);
      setBoardImg(null);
    }
  };

  return (
    <div className="board-frm-wrap">
      <div className="board-frm-top">
        <div className="board-thumbnail">
          {boardImg === null ? (
            <img src="/image/default.png" />
          ) : (
            <img src={boardImg} />
          )}
        </div>
        <div className="board-info">
          <table className="board-info-tbl">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="boardTitle">제목</label>
                </td>
                <td>
                  <Input
                    type="text"
                    content="boardTitle"
                    data={boardTitle}
                    setData={setBoardTitle}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="thumbnail">대표이미지</label>
                </td>
                <td>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*" //<input type="file">의 input이 허용된 file : 모든 타입의 이미지파일
                    onChange={changeThumbnail}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="board-frm-bottom"></div>
    </div>
  );
};

export default BoardFrm;

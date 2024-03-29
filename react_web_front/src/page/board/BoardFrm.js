import { useState } from "react";
import { Button1, Input } from "../../component/FormFrm";
import TextEditor from "../../component/TextEditor";

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

  //수정하기에서만 받아오는 데이터
  const type = props.type;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;
  const thumbnailCheck = props.thumbnailCheck;
  const setThumbnailCheck = props.setThumbnailCheck;

  const backServer = process.env.REACT_APP_BACK_SERVER;

  //첨부파일을 추가하면 화면에 보여줄 state
  const [newFileList, setNewFileList] = useState([]);

  //썸네일 파일 추가시 함수
  const changeThumbnail = (e) => {
    const files = e.currentTarget.files; //버블링이벤트 방지 currentTarget
    if (files.length !== 0 && files[0] != 0) {
      if (type === "modify") {
        setThumbnailCheck(1);
      }
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
  //첨부파일 추가시 동작할 함수
  const changeFile = (e) => {
    const files = e.currentTarget.files;
    setBoardFile(files); //전송용
    //e.currentTarget.files의 FileList는 배열처럼 보이지만 사실 console찍어보면 그냥 file객체들 담은 '객체'임!!!
    //그래서 map이나 foreach가 안 됨. 배열이 아니어서.
    //그래서 밑에 return에서 map함수를 통해 화면에 출력하기 위해 file의 name을 넣을 배열을 직접 생성해서
    //그 배열을 화면출력용 state인 fileList에 넣겠음.
    //그리고 그 fileList를 map으로 돌려서 화면에 출력하겠음
    const arr = new Array();
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i].name);
    }
    setNewFileList(arr); //화면출력용
  };

  return (
    <div className="board-frm-wrap">
      <div className="board-frm-top">
        <div className="board-thumbnail">
          {boardImg === null ? (
            <img src="/image/default.png" />
          ) : type === "modify" && thumbnailCheck === 0 ? (
            <img src={backServer + "/board/thumbnail/" + boardImg} />
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
                  <label htmlFor="thumbnail">대표이미지(썸네일)</label>
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
              <tr>
                <td>
                  <label htmlFor="boardFile">첨부파일</label>
                </td>
                <td>
                  <input type="file" onChange={changeFile} multiple />
                </td>
              </tr>
              <tr className="file-list">
                <td>첨부파일목록</td>
                <td>
                  <div className="file-zone">
                    {type === "modify"
                      ? fileList.map((file, index) => {
                          return (
                            <FileItem
                              key={"oldFile" + index}
                              file={file}
                              fileList={fileList}
                              setFileList={setFileList}
                              delFileNo={delFileNo}
                              setDelFileNo={setDelFileNo}
                            />
                          );
                        })
                      : ""}

                    {newFileList.map((item, index) => {
                      return (
                        <p key={"newFile" + index}>
                          <span className="filename">{item}</span>
                        </p>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="board-frm-bottom">
        <TextEditor
          data={boardContent}
          setData={setBoardContent}
          url={backServer + "/board/editor"}
        />
      </div>
      <div className="board-frm-btn-box">
        <Button1
          text={type === "modify" ? "수정하기" : "작성하기"}
          clickEvent={buttonFunction}
        />
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const file = props.file;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;

  const deleteFile = () => {
    //delFileNo배열에 현재 파일번호 추가 -> 컨트롤러로 전송해서 작업해야 하므로
    setDelFileNo([...delFileNo, file.boardFileNo]);
    //화면에서 파일 삭제 : fileList에서 해당 file을 제거
    /*
    const copyFileList = new Array();
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i] !== file) {
        copyFileList.push(fileList[i]);
      }
    }
    setFileList(copyFileList);
    */
    const newFileList = fileList.filter((item, index) => {
      return item !== file;
    });
    setFileList(newFileList);
  };

  return (
    <p>
      <span className="filename">{file.filename}</span>
      <span className="material-icons del-file-icon" onClick={deleteFile}>
        delete
      </span>
    </p>
  );
};

export default BoardFrm;

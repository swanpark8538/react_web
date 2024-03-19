import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill"; //컴포넌트 임포트!!
import "react-quill/dist/quill.snow.css"; //css임포트(snow테마)!!
import ImageResize from "quill-image-resize-module-react"; //임포트!!
import axios from "axios";
Quill.register("modules/ImageResize", ImageResize); //임포트..?? 암튼!!

const TextEditor = (props) => {
  const data = props.data;
  const setData = props.setData;
  const url = props.url;

  //이미지를 axios로 올리고 가져오는 함수
  const imageHandler = () => {
    const input = document.createElement("input"); //input태그 생성
    input.setAttribute("type", "file"); //type : "file"
    input.setAttribute("accept", "image/*"); //accept 지정 : image파일만 허용
    input.click(); //생성한 input을 클릭
    //생성한 input에 change이벤트 적용 : 동기요청(async)
    input.onchange = async () => {
      const files = input.files;
      if (files !== null) {
        const form = new FormData();
        form.append("image", files[0]); //key,value
        axios
          //주소 : url, 보내는 객체 : form, 파일 설정 객체
          .post(url, form, {
            headers: {
              contentType: "multipart/form-data",
              processData: false,
            },
          })
          .then((res) => {
            //res.data.data = (스프링부트에서 String returnPath = ) "/board/editor/" + filepath;
            const editor = quillRef.current.getEditor(); //텍스트에디터dom을 선택
            const range = editor.getSelection(); //에디터 내부 이미지 관리용
            const backServer = process.env.REACT_APP_BACK_SERVER;
            editor.insertEmbed(
              range.index,
              "image",
              backServer + res.data.data
            );
            editor.setSelection(range.index + 1);
          })
          .catch((res) => {
            console.log(res);
          });
      }
    };
  };

  //컴포넌트 내부에서 특정 DOM객체를 선택할 때 document.queryselector 대신 사용하는 Hooks : useRef
  const quillRef = useRef();
  //quill에디터 옵션 형식을 지정(배열타입으로)
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockqoute",
    "list",
    "bullet",
    "align",
    "image",
    "color",
  ];
  //quill에서 사용할 모듈 설정(퀼이 굳이 메모형식을 쓰래...)
  //useMemo : 동일한 값을 반환하는 경우 함수를 반복적으로 호출하는 것이 아니라 메모리에 저장해두고 바로 가져오는 hooks
  const modules = useMemo(() => {
    return {
      //key : toolbar, ImageResize
      toolbar: {
        //toolbar 안에 key : container, handlers
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      ImageResize: {
        //ImageResize 안에 key : parchment, modules
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      formats={formats}
      theme="snow"
      value={data}
      onChange={setData}
      modules={modules}
    />
  );
};

export default TextEditor;

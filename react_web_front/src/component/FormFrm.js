import "./formFrm.css";

const Input = (props) => {
  const data = props.data; //input태그와 연결할 state
  const setData = props.setData; //state값을 변경하는 set함수
  const type = props.type; //text,password등
  const content = props.content; //id등에 사용. id 뿐만 아니라 여러 곳에서 사용할 거라서 content라고 명명함
  const blurEvent = props.blurEvent; //onBlur = 커서가 해당 태그를 나갈 때 작동하는 이벤트

  const changeData = (e) => {
    setData(e.target.value);
  };
  return (
    <input
      className="input-form"
      id={content}
      type={type}
      value={data}
      onChange={changeData}
      onBlur={blurEvent}
    />
  );
};

const Button1 = (props) => {
  const text = props.text; //버튼 내부에 표시될 텍스트
  const clickEvent = props.clickEvent; //onclick함수
  return (
    <button className="btn st1" type="button" onClick={clickEvent}>
      {text}
    </button>
  );
};
const Button2 = (props) => {
  const text = props.text; //버튼 내부에 표시될 텍스트
  const clickEvent = props.clickEvent; //onclick함수
  return (
    <button className="btn st2" type="button" onClick={clickEvent}>
      {text}
    </button>
  );
};
const Button3 = (props) => {
  const text = props.text; //버튼 내부에 표시될 텍스트
  const clickEvent = props.clickEvent; //onclick함수
  return (
    <button className="btn st3" type="button" onClick={clickEvent}>
      {text}
    </button>
  );
};

export { Input };
export { Button1 };
export { Button2 };
export { Button3 };

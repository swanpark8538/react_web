import { Route, Routes } from "react-router-dom";
import Footer from "./page/common/Footer";
import Header from "./page/common/Header";
import Main from "./page/common/Main";
import Join from "./page/member/Join";
import Login from "./page/member/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import MemberMain from "./page/member/MemberMain";
import BoardMain from "./page/board/BoardMain";
import AdminMain from "./page/admin/AdminMain";

function App() {
  //새로고침 하면 App.js가 재실행되면서 isLogin 값이 false로 다시 리셋되면서 로그아웃됨.
  //새로고침 전에 로그인했다면, login함수에서 localStorage에 member라는 문자열객체를 저장해놨음.
  const obj = JSON.parse(window.localStorage.getItem("member"));

  //const [isLogin, setIsLogin] = useState(false); //로그인 상태를 체크하는 state
  //const [token, setToken] = useState(""); //토큰 값
  //const [expiredTime, setExpiredTime] = useState(""); //인증만료시간
  const [isLogin, setIsLogin] = useState(obj ? true : false); // obj가 채워져있다면 true
  const [token, setToken] = useState(obj ? obj.accessToken : ""); //obj가 채워져있다면 거기서 accessToken값 가져와
  const [expiredTime, setExpiredTime] = useState(
    //obj가 채워져있다면 거기서 tokenExpired를 가져와서 Date타입으로 형변환
    obj ? new Date(obj.tokenExpired) : ""
  );
  if (obj) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  //로그인 로직 한번에 담은 함수
  const login = (accessToken) => {
    //로그인 성공시 받은 accessToken을 token state에 저장
    setToken(accessToken);
    //로그인 성공 시각을 기준으로 1시간 뒤가 만료시간이므로, 그 데이터를 expiredTime state에 저장
    const tokenExpired = new Date(new Date().getTime() + 60 * 60 * 1000); //현재시각의 1시간 후의 시각을 다시 Date타입으로 생성
    setExpiredTime(tokenExpired);
    //token과 expiredTime을 객체로 묶은 후, 이 객체를 문자열로 변환하여 localStorage에 저장
    //왜냐! localStorage에는 문자열만 저장 가능하기 떄문에...
    //조심! set은 이 함수가 끝난 후에 작동되므로, token, expiredTime을 넣으면 안 되고, 이와 같은 값인 accessToken, tokenExpired을 넣어야함
    //accessToken은 문자열이지만 tokenExpired는 Date타입이므로, tokenExpired의 값을 문자열로 변환하여 객체에 저장
    const obj = { accessToken, tokenExpired: tokenExpired.toISOString() };
    //이 obj를 문자열로 변환
    const member = JSON.stringify(obj);
    //localStorage에 저장
    window.localStorage.setItem("member", member);

    //axios의 헤더에 토큰값 자동설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken; //인증 : "인증방식(여기선 Bearer) 띄어쓰기(필수)"+토큰
    //↑↑ 여기서 axios객체의 header에 미리 설정 안 해놓으면, 매번 axios를 통해서 spring에 요청할 때마다
    //{headers:{Authorization: "Bearer " + token}} 이 객체를 spring에 매개변수로 전달해야 하는 번거로움이 있음

    //isLogin도 true로 바꿈 → 변경되어야 할 화면들 렌더링 다시 일어날 수 있도록
    setIsLogin(true);

    //만료시간 지나면 로그아웃 자동실행 설정
    const remainingTime = tokenExpired.getTime() - new Date().getTime(); //만료시간(ms) - 현재시간(ms)
    setTimeout(logout, remainingTime); //로그아웃을 남은시간만큼 지난 후에 실행
  };

  //로그인 할때 변경한 사항을 모두 초기화
  const logout = () => {
    setToken("");
    setExpiredTime("");
    window.localStorage.removeItem("member");
    axios.defaults.headers.common["Authorization"] = null;
    setIsLogin(false);
  };

  //페이지가 로드(또는 새로고침) 되면 동작(login함수에서 setTimeout이 사라지므로)
  useEffect(() => {
    if (isLogin) {
      //로그인 되어있으면 → 저장해둔 만료시간을 꺼내서 현재시간과 비교한 후 로그아웃 자동실행 설정
      const remainingTime = expiredTime.getTime() - new Date().getTime();
      setTimeout(logout, remainingTime);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  }, []);

  return (
    <div className="wrap">
      <Header isLogin={isLogin} logout={logout} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route
            path="/member/*"
            element={<MemberMain isLogin={isLogin} logout={logout} />}
          />
          {/*서브라우팅은 경로에 *(아래 파일들 모두) 또는 **(아래 폴더들 포함해서 모든 파일들)*/}

          <Route path="/board/*" element={<BoardMain isLogin={isLogin} />} />
          <Route path="/admin/*" element={<AdminMain />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

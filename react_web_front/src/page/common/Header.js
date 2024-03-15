import "./default.css";
import { Link } from "react-router-dom";

const Header = (props) => {
  //Login.js에서 로그인 성공시 setIsLogin(true)을 함.
  const isLogin = props.isLogin;
  const logout = props.logout;

  return (
    <header>
      <div className="header">
        <div className="main-logo">
          <Link to="/">PARK's WORLD</Link>
        </div>
        <Navi />
        <HeaderLink isLogin={isLogin} logout={logout} />
        {/*isLogin값을 보냄*/}
      </div>
    </header>
  );
};

const Navi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="#">메뉴-1</Link>
        </li>
        <li>
          <Link to="#">메뉴-2</Link>
        </li>
        <li>
          <Link to="#">메뉴-3</Link>
        </li>
        <li>
          <Link to="#">메뉴-4</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = (props) => {
  const isLogin = props.isLogin;
  const logout = props.logout;

  return (
    <div className="header-link">
      {/*isLogin 값에 따라서 화면 우측 상단 변경*/}
      {isLogin ? (
        <>
          {/*태그 하나로만 보낼 수 있으므로(안 그러면 오류), 빈태그 <>로 감싸야함.*/}
          <Link to="/member/info" title="마이페이지">
            {/*title속성 : 커서 올리면 속성값 나옴*/}
            <span className="material-icons">face</span>
          </Link>
          <Link to="#" title="로그아웃" onClick={logout}>
            {/*로그아웃은 onclick으로 어찌어찌 하므로 페이지이동이 필요 없어서, link to=~ 이게 필요없음*/}
            <span className="material-icons">logout</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" title="로그인">
            {/*title속성 : 커서 올리면 속성값 나옴*/}
            <span className="material-icons">login</span>
          </Link>
          <Link to="/join" title="회원가입">
            <span className="material-icons">assignment_ind</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;

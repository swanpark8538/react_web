import "./default.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="main-logo">
          <Link to="/">PARK's WORLD</Link>
        </div>
        <Navi />
        <HeaderLink />
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

const HeaderLink = () => {
  return (
    <div className="header-link">
      <Link to="/login" title="로그인">
        {/*title속성 : 커서 올리면 속성값 나옴*/}
        <span class="material-icons">login</span>
      </Link>
      <Link to="/join" title="회원가입">
        <span class="material-icons">assignment_ind</span>
      </Link>
    </div>
  );
};

export default Header;

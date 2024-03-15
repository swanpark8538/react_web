import { Link } from "react-router-dom";
import "./sideMenu.css";

const SideMenu = (props) => {
  const menus = props.menus;
  const setMenus = props.setMenus;

  const changeMenu = (index) => {
    const copyMenus = [...menus];
    copyMenus.forEach((item) => {
      item.active = false;
    });
    copyMenus[index].active = true;
    setMenus(copyMenus);
  };

  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => {
          return (
            <li key={"menu" + index}>
              <Link
                to={menu.url}
                className={menu.active ? "active-side" : ""}
                onClick={() => {
                  changeMenu(index);
                }}
              >
                {/* 서브라우팅 쓸 때에는 url에 슬래시 붙이는거 조심.
                슬래시 안 붙이면 /member/여기부터 시작인데,
                슬래시 붙이면 /여기부터 시작임(즉 메인부터 시작)*/}
                {menu.text}
                <span className="material-icons">chevron_right</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;

import { useState } from "react";
import SideMenu from "../../component/SideMenu";
import "./admin.css";
import { Route, Routes } from "react-router-dom";
import AdminMember from "./AdminMember";
import AdminBoard from "./AdminBoard";

const AdminMain = () => {
  const [menus, setMenus] = useState([
    { url: "member", text: "회원관리", active: false },
    { url: "board", text: "게시판 관리", active: false },
  ]);

  return (
    <div className="mypage-wrap">
      <div className="mypage-title">
        <span>관리자 페이지</span>
      </div>
      <div className="mypage-content">
        <SideMenu menus={menus} setMenus={setMenus} />
        <div className="mypage-current-content">
          <Routes>
            <Route path="/member" element={<AdminMember />} />
            <Route path="/board" element={<AdminBoard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;

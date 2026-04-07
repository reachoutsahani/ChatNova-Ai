import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h2>chatnova</h2>

      {/* 🔥 VERY IMPORTANT */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
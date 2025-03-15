import { Outlet } from "umi";
import { Navbar } from "@/components/common/Navbar/Navbar";
import { theme } from "../../config/theme.config";

export default function BaseLayout() {
  return (
    <>
      <div className="md:px-[12.6%] duration-100">
        <Navbar {...theme.NavbarProps} />
        <Outlet />
      </div>
    </>
  );
}

import style from "./Header.module.scss";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className={style["header-container"]}>
      <div>
        <Link to="/">
          <img
            className={style["logo"]}
            src={logo}
            height={50}
            width={50}
          ></img>
        </Link>
      </div>
      <div className={style["name"]}>dev chat</div>
    </div>
  );
};

export default Header;

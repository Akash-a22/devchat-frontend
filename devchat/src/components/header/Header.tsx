import style from "./Header.module.scss";
import logo from "../../assets/logo.svg";

const Header = () => {
  return (
    <div className={style["header-container"]}>
      <div>
        <img className={style["logo"]} src={logo} height={50} width={50}></img>
      </div>
      <div className={style["name"]}>dev chat</div>
    </div>
  );
};

export default Header;

import style from "/src/styles/MenuOption.module.css"
import lableStyle from "/src/styles/CubeLayout.module.css";
import { preload, play } from "/electron/utils/sound.js";
import { Link } from 'react-router-dom';

preload("click");
preload("hover");

function MenuOption({ dst, text, selected, pressed }) {
    const className = pressed
        ? `${lableStyle.label} ${style.selectedInput}`
        : selected
        ? `${lableStyle.label} ${style.selected}`
        : lableStyle.label;

    return (
        <Link
            to={dst}
            className={className}
            onMouseOver={() => play("hover")}
            onClick={() => play("click")}
        >
            {text}
        </Link>
    )
}

export default MenuOption;
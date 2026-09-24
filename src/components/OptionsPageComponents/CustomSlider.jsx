import style from "/src/styles/CustomSlider.module.css"
import selectedStyle from "/src/styles/SelectedSlider.module.css"
import { play } from "/electron/utils/sound.js";

function CustomSlider(props) {
    console.log('selected:', props.selected, 'class:', props.selected ? 'selectedStyle' : 'baseStyle');
    const percent = Math.round(parseFloat(props.value) * 100) + "%";

    return (
        <div className={style.sliderRow}>
            <label className={style.containerLabelAlt}>
                {props.title}
            </label>
            <input
                type="range"
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                onMouseOver={() => play("hover")}
                onChange={(e) => {
                    props.onChange(e);
                    play('rollover');
                }}
                className={props.selected ? selectedStyle.containerSlider : style.containerSlider}
            />
            <span className={style.percentLabel}>
                {percent}
            </span>
        </div>
    );
}

export default CustomSlider;
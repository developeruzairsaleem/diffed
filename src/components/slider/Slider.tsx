import * as React from "react";
import { Slider, SliderTrack, SliderRange, SliderThumb } from "@radix-ui/react-slider";
import styles from "./styles.module.css";

interface sliderComponentProps {
	value: number[];
	onChange?: (value: number[]) => void;
}

const SliderComponent = ({value, onChange}: sliderComponentProps) => (
		<Slider className={styles.Root} value={value} onValueChange={onChange} max={5} step={1}>
			<SliderTrack className={styles.Track}>
				<SliderRange className={styles.Range} />
			</SliderTrack>
			<SliderThumb className={styles.Thumb} aria-label="Volume" />
		</Slider>
);

export default SliderComponent;
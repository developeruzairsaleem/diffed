import * as React from "react";
import { Slider, SliderTrack, SliderRange, SliderThumb } from "@radix-ui/react-slider";
import styles from "./styles.module.css";

const SliderComponent = () => (
		<Slider className={styles.Root} defaultValue={[50]} max={100} step={1}>
			<SliderTrack className={styles.Track}>
				<SliderRange className={styles.Range} />
			</SliderTrack>
			<SliderThumb className={styles.Thumb} aria-label="Volume" />
		</Slider>
);

export default SliderComponent;
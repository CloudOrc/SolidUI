/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import { isNil } from "lodash-es";
import SolidView, { SolidViewProps, SolidViewState } from "../SolidView";

// type Base64ImageSolidViewProps = {} & SolidViewProps;

type Base64ImageSolidViewState = {
	imageType?: string;
	imageData?: string;
} & SolidViewState;

export default class Base64ImageSolidView<
	T extends SolidViewProps,
	S extends Base64ImageSolidViewState,
> extends SolidView<T, S> {
	divRef: React.RefObject<HTMLDivElement>;

	resizeTimer?: any;

	constructor(props: T) {
		super(props);

		this.divRef = React.createRef();

		this.reFetchData = this.reFetchData.bind(this);
		this.reload = this.reload.bind(this);

		this.resize = this.resize.bind(this);
	}

	reFetchData() {
		// console.log("reFetchData");
		// this.setState({
		// 	imageType: "image/png",
		// 	imageData: "",
		// });
	}

	reload() {}

	protected reRender = async () => {
		const vm = this.getVM();
		const options = vm.options || {};
		if (!isNil(options)) {
			const { imageType, imageData } = options;
			this.setState({
				imageType,
				imageData,
			});
		}
	};

	// private pollResult = async (interval: number = 3000) => {
	// 	let retryCnt = 0;
	// 	let maxRetryCnt = 10;
	// 	let done = false;
	// 	while (!done) {
	// 		const response: ApiResult<string> = await Apis.modelui.result();
	// 		if (response.ok) {
	// 			try {
	// 				const content = response.data || "{}";
	// 				const resultsJa = JSON.parse(content);
	// 				if (resultsJa.results && resultsJa.results.length > 0) {
	// 					const imageType = resultsJa.results[0].type;
	// 					const imageData = resultsJa.results[0].value;
	// 					done = true;
	// 					return {
	// 						type: imageType,
	// 						data: imageData,
	// 					};
	// 				}
	// 			} catch (e) {
	// 				console.warn(e);
	// 				return {};
	// 			}
	// 		} else {
	// 			console.log("response failed", response);
	// 			return {};
	// 		}
	// 		let t: any = null;
	// 		await new Promise((resolve) => {
	// 			t = setTimeout(resolve, interval);
	// 		});
	// 		if (t) {
	// 			clearTimeout(t);
	// 		}
	// 	}
	// };

	protected baseViewDidMount(): void {
		window.addEventListener("resize", this.resize);

		const vm = this.getVM();
		const { options } = vm;
		if (!isNil(options)) {
			// const { imageType, imageData } = options;
			const imageType = "image/png";
			const imageData =
				"iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAAOXRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjcuMiwgaHR0cHM6Ly9tYXRwbG90bGliLm9yZy8pXeV/AAAACXBIWXMAAA9hAAAPYQGoP6dpAAAaeElEQVR4nO3de5CVBf3H8e/C6pEQVkEFNkEwHUlUvJtRv4GkkAHSGTNtvBCW5kio4ZiskxreVq0cMgjLMHTygs0IOTjSMHihJhWBUJtRlAl0RwRs1F3B3IQ9vz/6sT83wQtx9ln2+3rNnD/Oc86hj8/sGd895yxWlcvlcgAAkEaXogcAANC+BCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyVQXPWBX1tLSEmvXro0ePXpEVVVV0XMAgE+gXC7HO++8E7W1tdGlS85rYQLwv7B27dro379/0TMAgB3Q0NAQ+++/f9EzCiEA/ws9evSIiH//APXs2bPgNQDAJ9HU1BT9+/dv/fd4RgLwv7D1Y9+ePXsKQADYxWT++lbOD74BABITgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJBMddEDAMhl4JSHi55QiDU3jSl6ArRyBRAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQTKcNwMWLF8e4ceOitrY2qqqqYt68edt97oUXXhhVVVUxbdq0dtsHAFCUThuAmzZtiqFDh8aMGTM+8nlz586Np556Kmpra9tpGQBAsaqLHlApo0ePjtGjR3/kc1577bWYNGlS/PGPf4wxY8a00zIAgGJ12iuAH6elpSXOOeecuPzyy2PIkCFFzwEAaDed9grgx7n55pujuro6Lr744k/8mubm5mhubm6939TUVIlpAAAVlfIK4LJly+LnP/95zJ49O6qqqj7x6+rr66Ompqb11r9//wquBACojJQB+Kc//Sk2bNgQAwYMiOrq6qiuro5XXnklLrvsshg4cOB2X1dXVxeNjY2tt4aGhvYbDQCwk6T8CPicc86JkSNHtjk2atSoOOecc2LChAnbfV2pVIpSqVTpeQAAFdVpA3Djxo2xatWq1vurV6+OFStWRK9evWLAgAHRu3fvNs/fbbfdom/fvnHIIYe091QAgHbVaQNw6dKlMWLEiNb7kydPjoiI8ePHx+zZswtaBQBQvE4bgMOHD49yufyJn79mzZrKjQEA6EBS/hIIAEBmAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEim0wbg4sWLY9y4cVFbWxtVVVUxb9681sfef//9uOKKK+Lwww+P7t27R21tbZx77rmxdu3a4gYDALSTThuAmzZtiqFDh8aMGTM+9Ni7774by5cvj6uuuiqWL18eDz74YKxcuTK+/vWvF7AUAKB9VRc9oFJGjx4do0eP3uZjNTU1sXDhwjbHpk+fHscff3y8+uqrMWDAgPaYCABQiE57BfDTamxsjKqqqthrr72KngIAUFGd9grgp/Hee+/FFVdcEd/61reiZ8+e231ec3NzNDc3t95vampqj3kAADtV+gB8//3345vf/GaUy+WYOXPmRz63vr4+pk6d2k7LoP0MnPJw0RMKseamMUVPAChE6o+At8bfK6+8EgsXLvzIq38REXV1ddHY2Nh6a2hoaKelAAA7T9orgFvj7+WXX47HHnssevfu/bGvKZVKUSqV2mEdAEDldNoA3LhxY6xatar1/urVq2PFihXRq1ev6NevX3zjG9+I5cuXx/z582PLli2xbt26iIjo1atX7L777kXNBgCouE4bgEuXLo0RI0a03p88eXJERIwfPz5+/OMfx0MPPRQREUceeWSb1z322GMxfPjw9poJANDuOm0ADh8+PMrl8nYf/6jHAAA6s9S/BAIAkJEABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkum0Abh48eIYN25c1NbWRlVVVcybN6/N4+VyOa6++uro169fdOvWLUaOHBkvv/xyMWMBANpRpw3ATZs2xdChQ2PGjBnbfPyWW26J2267LW6//fZ4+umno3v37jFq1Kh477332nkpAED7qi56QKWMHj06Ro8evc3HyuVyTJs2LX70ox/FKaecEhERd999d/Tp0yfmzZsXZ555ZntOBQBoV532CuBHWb16daxbty5GjhzZeqympiZOOOGEePLJJwtcBgBQeZ32CuBHWbduXURE9OnTp83xPn36tD62Lc3NzdHc3Nx6v6mpqTIDAQAqKGUA7qj6+vqYOnVq0TMASGbglIeLnlCINTeNKXpCp5XyI+C+fftGRMT69evbHF+/fn3rY9tSV1cXjY2NrbeGhoaK7gQAqISUATho0KDo27dvLFq0qPVYU1NTPP3003HiiSdu93WlUil69uzZ5gYAsKvptB8Bb9y4MVatWtV6f/Xq1bFixYro1atXDBgwIC699NK4/vrr4+CDD45BgwbFVVddFbW1tXHqqacWNxoAoB102gBcunRpjBgxovX+5MmTIyJi/PjxMXv27PjhD38YmzZtigsuuCDefvvt+NKXvhQLFiyIPfbYo6jJAADtotMG4PDhw6NcLm/38aqqqrj22mvj2muvbcdVAADFS/kdQACAzAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQTNoA3LJlS1x11VUxaNCg6NatW3zuc5+L6667LsrlctHTAAAqqrroAUW5+eabY+bMmXHXXXfFkCFDYunSpTFhwoSoqamJiy++uOh5AAAVkzYA//KXv8Qpp5wSY8aMiYiIgQMHxn333RdLliwpeBkAQGWl/Qj4i1/8YixatCheeumliIh49tln489//nOMHj16u69pbm6OpqamNjcAgF1N2iuAU6ZMiaamphg8eHB07do1tmzZEjfccEOcddZZ231NfX19TJ06tR1X8mkNnPJw0RMKseamMUVPAGAXkvYK4AMPPBD33HNP3HvvvbF8+fK466674qc//Wncdddd231NXV1dNDY2tt4aGhracTEAwM6R9grg5ZdfHlOmTIkzzzwzIiIOP/zweOWVV6K+vj7Gjx+/zdeUSqUolUrtORMAYKdLewXw3XffjS5d2v7jd+3aNVpaWgpaBADQPtJeARw3blzccMMNMWDAgBgyZEj89a9/jVtvvTXOO++8oqcBAFRU2gD8xS9+EVdddVVcdNFFsWHDhqitrY3vfe97cfXVVxc9DQCgotIGYI8ePWLatGkxbdq0oqcAALSrtN8BBADISgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJpA7A1157Lc4+++zo3bt3dOvWLQ4//PBYunRp0bMAACqquugBRXnrrbdi2LBhMWLEiHjkkUdi3333jZdffjn23nvvoqcBAFRU2gC8+eabo3///vHb3/629digQYMKXAQA0D7SfgT80EMPxbHHHhunn3567LfffnHUUUfFHXfc8ZGvaW5ujqampjY3AIBdTdorgH//+99j5syZMXny5LjyyivjmWeeiYsvvjh23333GD9+/DZfU19fH1OnTm3npUBHNXDKw0VPKMSam8YUPQH4L6W9AtjS0hJHH3103HjjjXHUUUfFBRdcEOeff37cfvvt231NXV1dNDY2tt4aGhracTEAwM6RNgD79esXhx56aJtjn//85+PVV1/d7mtKpVL07NmzzQ0AYFeTNgCHDRsWK1eubHPspZdeigMOOKCgRQAA7SNtAP7gBz+Ip556Km688cZYtWpV3HvvvfHrX/86Jk6cWPQ0AICKShuAxx13XMydOzfuu+++OOyww+K6666LadOmxVlnnVX0NACAikr7W8AREWPHjo2xY8cWPQMAoF2lvQIIAJCVAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJBMddED2L6BUx4uekIh1tw0pugJANCpuQIIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYAAgAkIwABAJIRgAAAyQhAAIBkBCAAQDICEAAgGQEIAJCMAAQASEYA/p+bbropqqqq4tJLLy16CgBARQnAiHjmmWfiV7/6VRxxxBFFTwEAqLj0Abhx48Y466yz4o477oi999676DkAABWXPgAnTpwYY8aMiZEjR37sc5ubm6OpqanNDQBgV1Nd9IAi3X///bF8+fJ45plnPtHz6+vrY+rUqRVeBQBQWWmvADY0NMQll1wS99xzT+yxxx6f6DV1dXXR2NjYemtoaKjwSgCAnS/tFcBly5bFhg0b4uijj249tmXLlli8eHFMnz49mpubo2vXrm1eUyqVolQqtfdUAICdKm0AnnTSSfH888+3OTZhwoQYPHhwXHHFFR+KPwCAziJtAPbo0SMOO+ywNse6d+8evXv3/tBxAIDOJO13AAEAskp7BXBbHn/88aInAABUnCuAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACAZAQgAkIwABABIRgACACQjAAEAkhGAAADJCEAAgGQEIABAMgIQACCZ1AFYX18fxx13XPTo0SP222+/OPXUU2PlypVFzwIAqKjUAfjEE0/ExIkT46mnnoqF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mpoC13Vs3bt3j4MOOqj1/m9+85uoqamJO+64I66//voCl3VMBx98cFRVVcWLL75Y9JRO44UXXvDF/I/xn+9TPhnnrfPyGRWxefPmuPvuu+NnP/tZrFixovX27LPPRm1trd+U+5SqqqqiS5cu8c9//rPoKR1Sr169YtSoUTFjxozYtGnThx5/++2323/ULuzRRx+N559/Pk477bSipwC7EFcAifnz58dbb70V3/nOdz50pe+0006LWbNmxYUXXljQuo6vubk51q1bFxH//gh4+vTpsXHjxhg3blzByzquGTNmxLBhw+L444+Pa6+9No444ojYvHlzLFy4MGbOnBkvvPBC0RM7pK0/a1u2bIn169fHggULor6+PsaOHRvnnntu0fM6tA++T7eqrq6OffbZp6BFUCwBSMyaNStGjhy5zY95TzvttLjlllviueeeiyOOOKKAdR3fggULol+/fhER0aNHjxg8eHD8/ve/993Jj3DggQfG8uXL44YbbojLLrssXn/99dh3333jmGOO+dD3tPh/W3/WqqurY++9946hQ4fGbbfdFuPHj/dLRx/jg+/TrQ455BBfRSCtqrJvZAMApOL/MgIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQjAAEAEhGAAIAJCMAAQCSEYAAAMkIQACAZAQgAEAyAhAAIBkBCACQzP8Cbey6W0wkPEMAAAAASUVORK5CYII=";
			if (imageType && imageData) {
				const img = new Image();
				const imageSrc = `data:"${imageType}";base64,${imageData}`;
				// const self = this;
				// img.onload = function () {
				// 	const viewRef = self.getViewRef().current;
				// 	if (viewRef) {
				// 		viewRef.style.height = `${img.height + 20}px`;
				// 		viewRef.style.width = `${img.width + 50}px}`;
				// 	}
				// };
				img.src = imageSrc;

				this.setState({
					imageType,
					imageData,
				});
			}
		}
	}

	protected baseViewWillUnmount(): void {
		window.removeEventListener("resize", this.resize);
	}

	/// / ------------------------------------------------------------------
	/// / protected methods
	resize(): void {
		if (this.resizeTimer) {
			clearTimeout(this.resizeTimer);
		}

		// const that = this; @typescript-eslint/no-this-alias
		this.resizeTimer = setTimeout(() => {
			// this.ecInstance?.resize();
		}, 50);
	}

	protected renderView(): React.ReactNode {
		if (isNil(this.state)) {
			return null;
		}
		const { imageType, imageData } = this.state;
		const imageSrc = `data:"${imageType}";base64,${imageData}`;

		// console.log(imageSrc);
		return (
			<div
				ref={this.divRef}
				style={{
					position: "relative",
					userSelect: "none",
					width: "100%",
					height: "100%",
				}}
			>
				{imageSrc ? <img src={imageSrc} alt="base64" /> : <div>loading</div>}
			</div>
		);
	}
}

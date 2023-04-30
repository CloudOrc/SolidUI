import React, { useEffect, useState } from "react";
import { eventbus, mm } from "@/utils";
import { OnSelectViewEventData } from "@/types/eventbus";
import { useUpdate } from "react-use";

type TabItemDataType = {
	key: string;
	tab: string;
	content?: React.ReactNode;
};

type InitialData = {
	tabs?: TabItemDataType[];
};

function useProperties(initialData: InitialData) {
	const forceUpdate = useUpdate();
	const [propertyKey, setPropertyKey] = useState<
		"top" | "scene" | "page" | "view"
	>("top");
	const [currentTabKey, setCurrentTabKey] = useState<string>("Style");
	let mainRef = React.createRef<HTMLDivElement>();
	let asideRef = React.createRef<HTMLDivElement>();

	useEffect(() => {
		eventbus.on("onSelectViewInViewList", handleSelectViewEvent);

		eventbus.on("onSelectViewInViewport", handleSelectViewEvent);

		return () => {
			eventbus.off("onSelectViewInViewList", handleSelectViewEvent);
			eventbus.off("onSelectViewInViewport", handleSelectViewEvent);
		};
	}, []);

	function handleSelectViewEvent(data: OnSelectViewEventData) {
		setPropertyKey("view");
		forceUpdate();
	}

	function renderTabs() {
		return (
			<ul className="conf-header__tabs">
				{initialData.tabs?.map((tabItemData) => {
					let active = currentTabKey === tabItemData.key;
					return (
						<li
							key={tabItemData.key}
							className={`conf-header__tabs-item ${active ? "active" : ""}`}
							onClick={() => handleTabChange(tabItemData.key)}
						>
							{tabItemData.tab}
						</li>
					);
				})}
			</ul>
		);
	}

	function handleTabChange(key: string) {
		if (key === "Data") {
			asideRef.current && (asideRef.current.style.width = "500px");
		} else {
			asideRef.current && (asideRef.current.style.width = "326px");
		}
		setCurrentTabKey(key);
	}

	return {
		propertyKey,
		currentTabKey,
		mainRef,
		asideRef,
		renderTabs,
	};
}

export default useProperties;

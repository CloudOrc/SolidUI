export type MessageDict = {
	text: string;
	role: string;
	type: string;
};

export enum WaitingStates {
	GeneratingCode = "Generating code",
	RunningCode = "Running code",
	UploadingFile = "Uploading file",
	Idle = "Idle",
}

import mitt from "mitt";
import { EventBusType } from "@/types/eventbus";

const eventbus = mitt<EventBusType>();

export { eventbus };

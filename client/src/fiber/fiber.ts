import * as v4 from "uuid/v4";

type StreamID = string;
export interface Fiber {
  renderMethod: Function;
  priority: number;
  streamID: StreamID;
  frameID: string;
}

export enum Priority {
  backgroud,
  interaction
}

export default function createFiber(
  renderMethod: Function,
  priority?: Priority,
  streamID?: string,
  frameID?: string
) {
  const fiber: Fiber = Object.create(null);
  fiber.renderMethod = renderMethod;
  fiber.priority = priority ? priority : 0;
  fiber.streamID = streamID ? streamID : v4();
  fiber.frameID = frameID ? frameID : v4();
  return fiber;
}

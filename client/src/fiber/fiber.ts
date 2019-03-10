import * as v4 from "uuid/v4";
export interface Fiber {
  renderMethod: Function;
  priority: number;
  streamID: number | string;
  frameID: number | string;
}

export default function createFiber(
  renderMethod: Function,
  priority: number,
  streamID?: string,
  frameID?: string
) {
  const fiber: Fiber = Object.create(null);
  fiber.renderMethod = renderMethod;
  fiber.priority = priority;
  fiber.streamID = streamID ? streamID : v4();
  fiber.frameID = frameID ? frameID : v4();
  return fiber;
}

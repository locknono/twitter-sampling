export const SET_CUR_TOPIC = "SET_CUR_TOPIC";

export function setCurTopic(index: CurTopic) {
  return {
    type: SET_CUR_TOPIC,
    index
  };
}

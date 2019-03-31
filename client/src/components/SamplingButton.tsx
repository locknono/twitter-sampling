import * as React from "react";

interface Props {
  clickMethod: any;
  text: string;
  id?: string;
  selectFlag?: boolean;
}

export default function(props: Props) {
  const { id, text, clickMethod, selectFlag } = props;
  const color = selectFlag
    ? { backgroundColor: "rgb(233,233,233,0.8)", borderColor: "#adadad" }
    : {};

  const buttonRef = React.createRef<HTMLButtonElement>();

  return (
    <button
      id={id}
      onClick={clickMethod}
      className="btn btn-default btn-sm white-button"
      ref={buttonRef}
      style={color}
    >
      {text}
    </button>
  );
}

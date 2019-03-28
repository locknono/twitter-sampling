import * as React from "react";

interface Props {
  clickMethod: any;
  text: string;
  id?: string;
}

export default function(props: Props) {
  const { id, text, clickMethod } = props;
  return (
    <button
      id={id}
      onClick={clickMethod}
      className="btn btn-default btn-sm white-button"
    >
      {text}
    </button>
  );
}

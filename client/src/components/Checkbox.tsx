import * as React from "react";

interface Props {
  id: string;
  text: string;
}
export default function Checkbox(props: Props) {
  const { id, text } = props;
  return (
    <form role="form">
      <div className="checkbox">
        <input type="checkbox" id={id} />
        <label
          htmlFor={id}
          className="checkbox-label"
          style={{ paddingLeft: 0 }}
        >
          {text}
        </label>
      </div>
    </form>
  );
}

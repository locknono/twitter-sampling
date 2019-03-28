import * as React from "react";

interface Props {
  id: string;
  text: string;
  clickFunc: any;
}
export default function Checkbox(props: Props) {
  const { id, text, clickFunc } = props;
  return (
    <form role="form">
      <div className="checkbox">
        <input type="checkbox" id={id} onClick={clickFunc} />
        <label
          htmlFor={id}
          className="checkbox-label"
          style={{ paddingLeft: 0 }}
          onClick={clickFunc}
        >
          {text}
        </label>
      </div>
    </form>
  );
}

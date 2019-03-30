import * as React from "react";

interface Props {
  id: string;
  text: string;
  clickFunc: any;
  ifChecked?: boolean;
  labelStyle?: Object;
}
export default function Checkbox(props: Props) {
  const { id, text, clickFunc, ifChecked, labelStyle } = props;
  return (
    <form role="form">
      <div className="checkbox">
        <input
          type="checkbox"
          id={id}
          onClick={clickFunc}
          checked={ifChecked || false}
        />
        <label
          htmlFor={id}
          className="checkbox-label"
          onClick={clickFunc}
          style={Object.assign({}, { paddingLeft: 0 }, labelStyle)}
        >
          {text}
        </label>
      </div>
    </form>
  );
}

import * as React from "react";

interface Props {
  title: string;
}

export default function Heading(props: Props) {
  const { title } = props;
  return <div className="panel-heading heading">{title}</div>;
}

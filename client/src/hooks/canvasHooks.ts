import * as React from "react";

export function useCtxWithRef(ref: React.MutableRefObject<null>) {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useLayoutEffect(() => {
    setCtx((ref.current as any).getContext("2d"));
  }, []);

  return [ctx, setCtx];
}

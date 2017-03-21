import { Size } from "../Models/Size";

export function getWidthHeight(): Size {
    const w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName("body")[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight || e.clientHeight || g.clientHeight;
    return new Size(x, y);
}

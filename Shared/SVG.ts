
export class SVG {
    static element(tagName) {
        return document.createElementNS("http://www.w3.org/2000/svg", tagName);
    }

    static circle(r, x, y, className) {
        const el = SVG.element("circle");
        el.setAttribute("r", r);
        el.setAttribute("cx", x);
        el.setAttribute("cy", y);
        el.setAttribute("class", className);
        return el;
        //<circle id="stretch" r="300" cx="400" cy="400" />

    }
}
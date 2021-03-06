import { CATEGORIES } from "../../constants";

export const padding = {
  css: `
.container {
  padding: 20px;
}
`,
  html: `
<div class="container">
  <div class="some-box"></div>
</div>`,
  container: {
    selector: ".container",
    x: 0,
    y: 0,
    width: 400,
    height: 400,
  },
  boxes: [
    {
      className: "some-box",
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      resizable: false,
    },
  ],
  goal: [
    {
      className: "some-box",
      x: 20,
      y: 20,
      width: 200,
      height: 200,
    },
  ],
  category: CATEGORIES.SPACING,
};

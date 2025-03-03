AFRAME.registerComponent("move-forward", {
  schema: {
    to: { type: "vec3", default: { x: 0, y: 1.5, z: -2.5 } }, // Target position
    duration: { type: "number", default: 1000 }, // Duration in milliseconds
  },

  init: function () {
    let el = this.el;
    el.addEventListener("rope-visibility", () => {
      el.setAttribute("animation", {
        property: "position",
        to: `${this.data.to.x} ${this.data.to.y} ${this.data.to.z}`,
        dur: this.data.duration,
        easing: "easeOutQuad",
      });
    });
  },
});

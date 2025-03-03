AFRAME.registerComponent("track-me", {
  schema: {
    enable: { type: "boolean", default: false },
    target: { type: "selector" },
  },

  init: function () {
    this.lastPosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(this.lastPosition);
    //this.tick = AFRAME.utils.throttleTick(this.tick, 1000, this);
  },

  remove: function () {},

  update: function () {
    this.el.object3D.getWorldPosition(this.lastPosition);
  },

  tick: function () {
    if (!this.data.enable) return;

    const currentPosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(currentPosition);

    const delta = currentPosition.clone().sub(this.lastPosition);
    // apply the same delta to the target
    //this.data.target.object3D.position.sub(delta);
    //do i want it to move further than the hand ? the movement is quite slow
    this.data.target.object3D.position.x -= delta.x * 0.5;
    this.data.target.object3D.position.z -= delta.z * 1.1;

    this.lastPosition = currentPosition;
  },
});

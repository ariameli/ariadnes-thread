<script setup>
import { ref, watch } from "vue";

import TheCameraRig from "./TheCameraRig.vue";

import "../aframe/emit-when-near.js";
import "../aframe/event-set.js";
import "../aframe/listen-to.js";
import "../aframe/simple-grab.js";
import "../aframe/clickable.js";
import "../aframe/track-me.js";

defineProps({
  scale: Number,
  overlaySelector: String,
});

const allAssetsLoaded = ref(false);
const ropeIsTouched = ref(false);

function collisionStart(event) {
  console.log("Hand touched the rope!", event.detail);
  const rope = document.getElementById("rope");
  if (rope) {
    rope.setAttribute("material", "color: red");
    ropeIsTouched.value = true;
  }
}
function collisionEnd(event) {
  console.log("Hand left the rope!", event.detail);
  const rope = document.getElementById("rope");
  if (rope) {
    rope.setAttribute("material", "color: white");
  }
  ropeIsTouched.value = false;
}
function ropeAppears() {
  console.log("Rope bundle touched!");
  const rope = document.getElementById("rope");
  if (rope) {
    rope.setAttribute("visible", true);
    document.getElementById("rope-bundle").setAttribute("visible", false);
  }
}
</script>

<template>
  <a-scene
    stats
    background="color: black;"
    :webxr="`
      requiredFeatures: local-floor;
      referenceSpaceType: local-floor;
      optionalFeatures: dom-overlay;
      overlayElement: ${overlaySelector};
    `"
    xr-mode-ui="XRMode: xr"
    physx="
      autoLoad: true;
      delay: 1000;
      useDefaultScene: false;
      wasmUrl: lib/physx.release.wasm;
    "
    outline
    simple-grab
  >
    <a-assets @loaded="allAssetsLoaded = true">
      <!--  The rope -->
      <a-asset-item
        id="rope-bundle-model"
        src="assets/models/rope_bundle.glb"
      ></a-asset-item>
      <!-- The maze -->
      <a-asset-item id="maze-model" src="assets/models/maze.glb"></a-asset-item>
      <!-- The torches -->
      <a-asset-item
        id="torch-model"
        src="assets/models/burning_torch.glb"
      ></a-asset-item>
    </a-assets>

    <template v-if="allAssetsLoaded">
      <!-- cylinder that looks like a rope -->

      <a-cylinder
        obb-collider
        id="rope"
        position="-0.1 1 -2"
        rotation="90 0 0"
        radius="0.03"
        height="3"
        @obbcollisionstarted="collisionStart($event)"
        @obbcollisionended="collisionEnd($event)"
        visible="false"
        clickable
      ></a-cylinder>
      <!-- The maze -->
      <a-entity
        id="maze"
        gltf-model="#maze-model"
        position="0 -2.4 -26"
        rotation="0 90 0"
        scale="0.7 0.7 0.7"
      ></a-entity>
      <!-- The rope bundle -->
      <a-entity
        id="rope-bundle"
        gltf-model="#rope-bundle-model"
        position="0 0.4 -0.9"
        rotation="0 0 0"
        scale="1.8 1.8 1.8"
        visible="true"
        @obbcollisionstarted="ropeAppears()"
        obb-collider
        clickable
      ></a-entity>
      <a-entity
        light="type: point; intensity: 1.5; color: #FF8141"
        position="0 0.6 -0.9"
      ></a-entity>
      <!-- torches -->
      <a-entity
        id="torch-1"
        gltf-model="#torch-model"
        position="-0.9 1.3 -2"
        rotation="0 0 0"
        scale="0.08 0.08 0.08"
      ></a-entity>
      <a-entity
        light="type: point; intensity: 1.5; color: #FF8141"
        position="-0.9 2 -1.8"
      ></a-entity>
    </template>

    <TheCameraRig :collided="ropeIsTouched" />
  </a-scene>
</template>

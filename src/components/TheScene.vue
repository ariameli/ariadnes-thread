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
      <!-- The labyrinth -->
      <a-asset-item
        id="scene-model"
        src="assets/models/minoic_labyrinth.glb"
      ></a-asset-item>
      <!--  The rope -->
      <a-asset-item
        id="rope-model"
        src="assets/models/rope3d.glb"
      ></a-asset-item>
      <a-asset-item
        id="labyrinth-model"
        src="assets/models/labyrinth.glb"
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
        clickable
      ></a-cylinder>

      <!-- The rope
      <a-entity
        geometry="primitive: cylinder; radius: 0.02; height: 2"
        material="color: gold"
        position=" 1 -3"
        rotation="90 0 0"
      ></a-entity>           -->
      <!-- The labyrinth -->
      <!-- <a-entity
        id="scene"
        gltf-model="#scene-model"
        position="-17.3 -1 -2"
        scale="1 1 1"
      ></a-entity> -->
      <a-entity
        id="labyrinth"
        gltf-model="#labyrinth-model"
        position="-1 0 -12"
        rotation="0 180 0"
        scale="1 1 1"
      ></a-entity>
      <!-- The rope -->
      <!-- <a-entity
        id="rope"
        gltf-model="#rope-model"
        position="0 0.5 -3"
        rotation="0 90 0"
        scale="0.025 0.025 0.025"
        simple-grab
        clickable
      ></a-entity> -->
      <a-sky
        src="https://c7.staticflickr.com/1/661/21230969582_37cee367bd_k.jpg"
      >
      </a-sky>
    </template>

    <TheCameraRig :collided="ropeIsTouched" />
  </a-scene>
</template>

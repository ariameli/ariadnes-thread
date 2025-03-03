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
const lightBundleofRope = ref(false);

//after 5 seconds change the lightBundkeofRope to true
setTimeout(() => {
  lightBundleofRope.value = true;
}, 5000);

function handleCollision(event, isCollisionStart) {
  const rope = document.getElementById("rope");
  if (rope) {
    rope.setAttribute(
      "material",
      isCollisionStart ? "color: red" : "color: white"
    );
    ropeIsTouched.value = isCollisionStart;
  }
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
      <a-asset-item
        id="torch-anim"
        src="assets/models/torch_anim.glb"
      ></a-asset-item>
    </a-assets>

    <template v-if="allAssetsLoaded">
      <!-- cylinder that looks like a rope -->

      <a-cylinder
        obb-collider
        id="rope"
        position="0 1.3 -1.7"
        rotation="90 0 0"
        radius="0.03"
        height="3"
        @obbcollisionstarted="handleCollision($event, true)"
        @obbcollisionended="handleCollision($event, false)"
        visible="true"
        clickable
      ></a-cylinder>

      <!-- The maze -->
      <a-entity
        id="maze"
        gltf-model="#maze-model"
        position="0 -1.8 -18.3"
        rotation="0 90 0"
        scale="0.5 0.5 0.5"
      ></a-entity>
      <!-- The rope bundle -->
      <a-entity
        id="rope-bundle"
        gltf-model="#rope-bundle-model"
        position="0 0.15 -0.9"
        rotation="0 0 0"
        scale="1.8 1.8 1.8"
        visible="true"
        @obbcollisionstarted="ropeAppears()"
        obb-collider
        clickable
      ></a-entity>
      <a-entity
        :visible="lightBundleofRope"
        light="type: point; intensity: 4; color: #FF8141"
        position="0 0.4 -0.9"
      ></a-entity>
      <!-- torches -->
      <a-entity
        id="torch-1"
        gltf-model="#torch-anim"
        position="-0.65 1.3 -1"
        scale="0.08 0.08 0.08"
        animation-mixer
        ><a-entity
          light="type: point; intensity: 1; color: #fcba03"
          position="2 11 0"
        ></a-entity>
      </a-entity>
      <a-entity
        id="torch-2"
        gltf-model="#torch-anim"
        position="0.65 1.3 -5"
        scale="0.08 0.08 0.08"
        animation-mixer
        ><a-entity
          light="type: point; intensity: 1; color: #fcba03"
          position="-2 11 0"
        ></a-entity>
      </a-entity>
      <a-entity
        id="torch-3"
        gltf-model="#torch-anim"
        position="-0.65 1.3 -9"
        scale="0.08 0.08 0.08"
        animation-mixer
        ><a-entity
          light="type: point; intensity: 1; color: #fcba03"
          position="2 11 0"
        ></a-entity>
      </a-entity>
    </template>

    <TheCameraRig :collided="ropeIsTouched" />
  </a-scene>
</template>

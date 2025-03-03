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
  const rope = document.getElementById("rope");
  const ropeBundle = document.getElementById("rope-bundle");
  if (rope) {
    rope.setAttribute("visible", true);
    ropeBundle.setAttribute("visible", false);
  }
}

function ropeVisibility(visibility) {
  const rope = document.getElementById("rope");
  if (rope) {
    rope.setAttribute("visible", visibility);
  }
  const pinkSphere = document.getElementById("pink-sphere");
  const blueSphere = document.getElementById("blue-sphere");
  const purpleSphere = document.getElementById("purple-sphere");
  if (pinkSphere) {
    animateForward(pinkSphere, { x: 0, y: 1.3, z: -8 });
  }
  if (blueSphere) {
    animateForward(blueSphere, { x: -0.2, y: 1.3, z: -7.7 });
  }
  if (purpleSphere) {
    animateForward(purpleSphere, { x: 0.2, y: 1.3, z: -7.7 });
  }
}

// function thats ANIMATES an object to move forward by giving him a new position as argument
function animateForward(object, newPosition) {
  object.setAttribute("animation", {
    property: "position",
    to: newPosition,
    dur: 1000,
  });
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
        position="0 1.3 -3.3"
        rotation="90 0 0"
        radius="0.03"
        height="7"
        @obbcollisionstarted="handleCollision($event, true)"
        @obbcollisionended="handleCollision($event, false)"
        visible="true"
        clickable
      ></a-cylinder>

      <!-- make a very bright light that looks like its floating right in front of the box -->
      <a-sphere
        id="pink-sphere"
        position="0 1.3 -9.5"
        radius="0.1"
        color="pink"
        shader="flat"
        emit-when-near="event: rope-visibility; distance: 3;"
        @rope-visibility="ropeVisibility(false)"
      >
        <a-light type="point" intensity="0.1" color="pink" position="0 0 0">
        </a-light>
      </a-sphere>
      <a-sphere
        id="blue-sphere"
        position="-0.8 1.3 -7.7"
        radius="0.1"
        color="blue"
        shader="flat"
      >
        <a-light type="point" intensity="0.1" color="blue" position="0 0 0">
        </a-light>
      </a-sphere>
      <a-sphere
        id="purple-sphere"
        position="0.8 1.3 -7.7"
        radius="0.1"
        color="purple"
        shader="flat"
      >
        <a-light type="point" intensity="0.1" color="purple" position="0 0 0">
        </a-light>
      </a-sphere>
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

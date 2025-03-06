<script setup>
import { ref, watch } from "vue";

import TheCameraRig from "./TheCameraRig.vue";

import "../aframe/emit-when-near.js";
import "../aframe/event-set.js";
import "../aframe/listen-to.js";
import "../aframe/simple-grab.js";
import "../aframe/clickable.js";
import "../aframe/track-me.js";
import "../aframe/bloom.js";

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

function ropeVisibility() {
  const rope = document.getElementById("rope");
  if (rope) {
    rope.remove();
    console.log("rope removed");
  }
  animateSpheres();
}

function animateSpheres() {
  animateForward("pink", { x: 0, y: 1.3, z: -7.3 });
  animateForward("blue", { x: -0.25, y: 1.3, z: -7 });
  animateForward("purple", { x: 0.25, y: 1.3, z: -7 });
}

function animateForward(id, newPosition) {
  const object = document.getElementById(id);
  if (object) {
    object.setAttribute("animation", {
      property: "position",
      to: newPosition,
      dur: 1000,
    });
  }
}

function openText(open, id) {
  const texts = document.querySelectorAll(id);
  texts.forEach((text) => {
    text.setAttribute("visible", open);
  });
}

function wrongAnswer(id) {
  //turn the sphere red
  const sphere = document.getElementById(id);
  if (sphere) {
    sphere.setAttribute("material", `color: red; emissive: red`);
  }
  //wait 2 seconds and turn the color back to blue
  setTimeout(() => {
    sphere.setAttribute("material", `color: ${id}; emissive: ${id};`);
  }, 1000);
}
function correctAnswer(id) {
  //make the sphere more glowy
  const sphere = document.getElementById(id);
  if (sphere) {
    sphere.setAttribute("material", `emissiveIntensity: 6`);
  }

  //remove purple and blue sphere
  const purple = document.getElementById("purple");
  const blue = document.getElementById("blue");
  if (purple) {
    purple.remove();
  }
  if (blue) {
    blue.remove();
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
    bloom
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
      <a-asset-item
        id="fog-model"
        src="assets/models/fluffy_cloud.glb"
      ></a-asset-item>
    </a-assets>

    <template v-if="allAssetsLoaded">
      <!-- ROPE -->
      <a-cylinder
        obb-collider
        id="rope"
        position="0 1.2 -3.3"
        rotation="90 0 0"
        radius="0.03"
        height="7"
        @obbcollisionstarted="handleCollision($event, true)"
        @obbcollisionended="handleCollision($event, false)"
        visible="true"
        clickable
      ></a-cylinder>

      <!-- PINK SPHERE : CLOTHO -->
      <a-sphere
        id="pink"
        position="0 1.3 -9.5"
        radius="0.1"
        material="color: pink; emissive: #b52688; emissiveIntensity: 4"
        emit-when-near="event: rope-visibility; distance: 3;"
        @rope-visibility="ropeVisibility()"
        obb-collider
        @obbcollisionstarted="openText(true, '.pink-text')"
        @obbcollisionended="openText(false, '.pink-text')"
        simple-grab
        @grab="correctAnswer('pink')"
        clickable
      >
        <a-entity
          class="pink-text"
          text="align: center; color: pink; value: Clotho"
          position="0 0.20947 0"
          visible="false"
        ></a-entity>
        <a-entity
          class="pink-text"
          text="align: center; value: spins the thread of life"
          position="0 0.14662 0"
          scale="0.81 0.81 0.81"
          visible="false"
        ></a-entity>
        <a-light type="point" intensity="0.1" color="pink" position="0 0 0">
        </a-light>
      </a-sphere>

      <!-- BLUE SPHERE : LACHESIS -->
      <a-sphere
        id="blue"
        position="-0.8 1.3 -7.7"
        radius="0.1"
        material="color: blue; emissive: blue; emissiveIntensity: 4"
        obb-collider
        @obbcollisionstarted="openText(true, '.blue-text')"
        @obbcollisionended="openText(false, '.blue-text')"
        clickable
        @click="wrongAnswer('blue')"
      >
        <a-entity
          class="blue-text"
          text="align: center; color: blue; value: Lachesis"
          position="0 0.20947 0"
          visible="false"
        ></a-entity>
        <a-entity
          class="blue-text"
          text="align: center; value: measures the thread of life"
          position="0 0.14662 0"
          scale="0.81 0.81 0.81"
          visible="false"
        ></a-entity>
        <a-light type="point" intensity="0.1" color="blue" position="0 0 0">
        </a-light>
      </a-sphere>

      <!-- PURPLE SPHERE : ATROPOS -->
      <a-sphere
        id="purple"
        position="0.8 1.3 -7.7"
        radius="0.1"
        material="color: purple; emissive: purple; emissiveIntensity: 4"
        obb-collider
        @obbcollisionstarted="openText(true, '.purple-text')"
        @obbcollisionended="openText(false, '.purple-text')"
        clickable
        @click="wrongAnswer('purple')"
      >
        <a-entity
          class="purple-text"
          text="align: center; color: purple; value: Atropos"
          position="0 0.20947 0"
          visible="false"
        ></a-entity>
        <a-entity
          class="purple-text"
          text="align: center; value: cuts the thread of life"
          position="0 0.14662 0"
          scale="0.81 0.81 0.81"
          visible="false"
        ></a-entity>
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

      <!-- FOG -->
      <a-entity id="fog" gltf-model="assets/models/fluffy_cloud.glb" position="-0.63 -0.66 -13.98" scale="4 4 4"></a-entity>
      <a-entity id="fog-2" gltf-model="assets/models/fluffy_cloud.glb" position="0.41 0.01 -13.98" scale="4 4 4"></a-entity>

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

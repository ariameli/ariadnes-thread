<script setup>
import { ref, watch, onMounted } from "vue";

import TheCameraRig from "./TheCameraRig.vue";
import TheRope from "./TheRope.vue";
import TheSphere from "./TheSphere.vue";
import TheFog from "./TheFog.vue";

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
// const ropeIsTouched = ref(false);
const ropeIsTouchedByRight = ref(false);
const ropeIsTouchedByLeft = ref(false);
const lightBundleofRope = ref(false);

onMounted(() => {
  // Play the audio when VR mode starts
  document.querySelector("a-scene").addEventListener("enter-scene", () => {
    const soundEntity = document.querySelector("#sound-enter-entity");
    if (soundEntity) {
      soundEntity.components.sound.playSound();
    }
  });
});

setTimeout(() => {
  lightBundleofRope.value = true;
}, 5000);

function handleCollision(event, isCollisionStart, ropeId) {
  const rope = document.getElementById(ropeId);
  const hand = event.detail.withEl;
  console.log(hand.id);

  if (!(rope && hand)) return;

  const ropeTouchMap = {
    "hand-right-collider": ropeIsTouchedByRight,
    "hand-left-collider": ropeIsTouchedByLeft,
  };

  if (ropeTouchMap[hand.id]) {
    ropeTouchMap[hand.id].value = isCollisionStart;
    rope.setAttribute(
      "material",
      `color: ${isCollisionStart ? "red" : "white"}`
    );
  }
}

function deleteRope2() {
  playSound("wall-expl");
  document.getElementById("rope-2")?.remove();
}
//pass 1 or more id's to make them visible or invisible
function objectVisibility(id, visible) {
  const objects = document.querySelectorAll(id);
  objects?.forEach((object) => {
    object?.remove();
  });
}

function ropeAppears() {
  const rope = document.getElementById("rope");
  const ropeBundle = document.getElementById("rope-bundle");
  if (rope && ropeBundle) {
    rope?.setAttribute("visible", true);
    ropeBundle.remove();
    document.getElementById("light-bundle-of-rope")?.remove();
  }
}

function ropeVisibility() {
  const rope = document.getElementById("rope");
  rope?.remove();
  animateSpheres();
}

function animateSpheres() {
  animateForward("pink", { x: 0, y: 1.3, z: -6.8 });
  animateForward("blue", { x: -0.25, y: 1.3, z: -6.5 });
  animateForward("purple", { x: 0.25, y: 1.3, z: -6.5 });
  const soundEntity = document.querySelector("#sisters-entity");
  soundEntity?.components.sound.playSound();
}

function animateForward(id, newPosition) {
  const object = document.getElementById(id);
  object?.setAttribute("animation", {
    property: "position",
    to: newPosition,
    dur: 1000,
  });
}

function openText(event, open, id) {
  if (
    event.detail.withEl.id === "hand-right-collider" ||
    event.detail.withEl.id === "hand-left-collider"
  ) {
    const texts = document.querySelectorAll(id);
    texts.forEach((text) => {
      text.setAttribute("visible", open);
    });
  }
}
function handleAnswer(id, isCorrect) {
  const sphere = document.getElementById(id);
  if (!sphere) return;

  if (isCorrect) {
    const soundEntity = document.querySelector("#correct-sphere-entity");
    soundEntity?.components.sound.playSound();
    sphere.setAttribute("material", `emissiveIntensity: 6`);
    document.getElementById("rope-1")?.setAttribute("visible", true);
    document.getElementById("purple")?.remove();
    document.getElementById("blue")?.remove();
  } else {
    const soundEntity = document.querySelector("#wrong-sphere-entity");
    soundEntity?.components.sound.playSound();
    sphere.setAttribute("material", `color: red; emissive: red`);
    setTimeout(() => {
      sphere.setAttribute("material", `color: ${id}; emissive: ${id};`);
    }, 1000);
  }
}

function droppedSphere() {
  playSound("fog");
  objectVisibility(".fog", false);
  document.getElementById("rope-1")?.remove();
  document.getElementById("rope-2")?.setAttribute("visible", true);
}

function droppedOffering(event) {
  if (event.detail.el.id === "rope-offering") {
    playSound("correct-wall");

    document.getElementById("rope-offering")?.remove();
    document.getElementById("wall")?.remove();
    document.getElementById("rope-2")?.remove();
    document.getElementById("bull-offering")?.remove();
    document.getElementById("coin-offering")?.remove();
    document.getElementById("drop-zone-offerings")?.remove();
    document.getElementById("drop-zone-offering-spot")?.remove();
    document.getElementById("rope-3")?.setAttribute("visible", true);

    //wait 6 seconds to play the path audio
    setTimeout(() => {
      playSound("path");
    }, 6000);
  } else {
    playSound("wrong-wall");
  }
}

function playSound(id) {
  const soundEntity = document.querySelector(`#${id}-entity`);
  soundEntity?.components.sound.playSound();
}

function endGame() {
  playSound("end");
  console.log("Game ended.");
  if (document.querySelector("a-scene").is("vr-mode")) {
    document.querySelector("a-scene").exitVR();
    console.info("Exit VR mode… bye!");
  }
}
</script>

<template>
  <a-scene
    stats
    background="color: black;"
    xr-mode-ui="XRMode: xr"
    bloom
    simple-grab
  >
    <a-assets @loaded="allAssetsLoaded = true">
      <!-- AUDIOS -->
      <a-asset-item
        id="sound-enter"
        response-type="arraybuffer"
        src="assets/audio/theseus_enter.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="sisters"
        response-type="arraybuffer"
        src="assets/audio/sisters_fate.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="wrong-sphere"
        response-type="arraybuffer"
        src="assets/audio/wrong_sphere.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="correct-sphere"
        response-type="arraybuffer"
        src="assets/audio/correct_sphere.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="place-sphere"
        response-type="arraybuffer"
        src="assets/audio/place_sphere.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="fog"
        response-type="arraybuffer"
        src="assets/audio/fog_disappear.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="wall-expl"
        response-type="arraybuffer"
        src="assets/audio/wall_explanation.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="correct-wall"
        response-type="arraybuffer"
        src="assets/audio/correct_wall.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="wrong-wall"
        response-type="arraybuffer"
        src="assets/audio/wrong_wall.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="path"
        response-type="arraybuffer"
        src="assets/audio/path.mp3"
        preload="auto"
      ></a-asset-item>
      <a-asset-item
        id="end"
        response-type="arraybuffer"
        src="assets/audio/end.mp3"
        preload="auto"
      ></a-asset-item>
      <!--  The rope bundle -->
      <a-asset-item
        id="rope-bundle-model"
        src="assets/models/rope_bundle.glb"
      ></a-asset-item>
      <!-- offerings -->
      <a-asset-item
        id="rope-offering-model"
        src="assets/models/rope_knots.glb"
      ></a-asset-item>
      <a-asset-item
        id="coin-model"
        src="assets/models/golden_coin.glb"
      ></a-asset-item>
      <a-asset-item
        id="bull-model"
        src="assets/models/bull_head_sculpt.glb"
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
      <!-- The fog -->
      <a-asset-item
        id="fog-model"
        src="assets/models/cloud_test.glb"
      ></a-asset-item>
      <!-- The wall -->
      <a-asset-item id="wall-model" src="assets/models/Wall.glb"></a-asset-item>
    </a-assets>

    <TheRope
      id="rope"
      :position="{ x: 0, y: 1.3, z: -3.3 }"
      :rotation="{ x: 90, y: 0, z: 0 }"
      :height="5"
      :handleCollision="handleCollision"
    />
    <TheRope
      id="rope-1"
      :position="{ x: 0, y: 1.3, z: -9.3 }"
      :rotation="{ x: 90, y: 0, z: 0 }"
      :height="4.6"
      :handleCollision="handleCollision"
    />
    <TheRope
      id="rope-2"
      :position="{ x: 0.8, y: 1.3, z: -11.7 }"
      :rotation="{ x: 90, y: 90, z: 0 }"
      :height="1.07"
      :handleCollision="handleCollision"
    />
    <TheRope
      id="rope-3"
      :position="{ x: 2.9, y: 1.3, z: -11.7 }"
      :rotation="{ x: 90, y: 90, z: 0 }"
      :height="1.48"
      :handleCollision="handleCollision"
    />

    <TheSphere
      id="blue"
      :correct="false"
      :position="{ x: -0.8, y: 1.3, z: -7.7 }"
      color="blue"
      :openText="openText"
      :handleAnswer="handleAnswer"
      Title="Lachesis"
      Body="measures the thread of life"
    />
    <TheSphere
      id="purple"
      :correct="false"
      :position="{ x: 0.8, y: 1.3, z: -7.7 }"
      color="purple"
      :openText="openText"
      :handleAnswer="handleAnswer"
      Title="Atropos"
      Body="cuts the thread of life"
    />

    <template v-if="allAssetsLoaded">
      <!-- AUDIOS ENTITIES -->
      <a-entity
        id="sound-enter-entity"
        sound="src: #sound-enter; autoplay: false;"
      ></a-entity>
      <a-entity
        id="sisters-entity"
        sound="src: #sisters; autoplay: false;"
      ></a-entity>
      <a-entity
        id="wrong-sphere-entity"
        sound="src: #wrong-sphere; autoplay: false;"
      ></a-entity>
      <a-entity
        id="correct-sphere-entity"
        sound="src: #correct-sphere; autoplay: false;"
      ></a-entity>
      <a-entity
        id="place-sphere-entity"
        sound="src: #place-sphere; autoplay: false;"
      ></a-entity>
      <a-entity id="fog-entity" sound="src: #fog; autoplay: false;"></a-entity>
      <a-entity
        id="wall-expl-entity"
        sound="src: #wall-expl; autoplay: false;"
      ></a-entity>
      <a-entity
        id="correct-wall-entity"
        sound="src: #correct-wall; autoplay: false;"
      ></a-entity>
      <a-entity
        id="wrong-wall-entity"
        sound="src: #wrong-wall; autoplay: false;"
      ></a-entity>
      <a-entity
        id="path-entity"
        sound="src: #path; autoplay: false;"
      ></a-entity>
      <a-entity id="end-entity" sound="src: #end; autoplay: false;"></a-entity>

      <!-- exit button -->
      <a-cylinder
        material="color: red; emissive: red; emissiveIntensity: 4"
        primitive="cylinder"
        radius="0.15"
        rotation="90 90 0"
        height="0.2"
        position="4.8 1.4 -11.76"
        color="red"
        clickable
        @click="endGame()"
      >
        <a-light
          type="point"
          intensity="0.1"
          color="red"
          position="0 0 0"
        ></a-light>
      </a-cylinder>

      <!-- DROP ZONES -->
      <a-entity
        id="drop-zone-left"
        geometry="primitive: sphere; phiLength: 180; radius: 0.52; thetaLength: 90;"
        material="color: red; side: double"
        position="0 1.3 -12.6"
        rotation="90 0 0"
        clickable
        emit-when-near="event: audio; distance: 1.5;"
        @audio="playSound('place-sphere')"
      ></a-entity>
      <a-entity
        id="drop-zone-left-spot"
        position="0 1.3 -12.3"
        rotation="90 0 180"
        listen-to="target: #drop-zone-left;"
        simple-grab-drop-zone
        @drop="droppedSphere()"
      ></a-entity>

      <a-entity
        id="drop-zone-offerings"
        geometry="primitive: cylinder; radius: 0.15; rotation: 90 90 0; height: 0.2; position: 3 1.4 -11.82;"
        material="color: red; side: double"
        position="3 1.4 -11.7"
        rotation="90 -90 0"
        emit-when-near="event: delete-rope; distance: 1.5;"
        @delete-rope="deleteRope2()"
        clickable
      ></a-entity>
      <a-entity
        id="drop-zone-offering-spot"
        position="2.8 1.4 -11.7"
        rotation="90 0 0"
        listen-to="target: #drop-zone-offerings;"
        simple-grab-drop-zone
        @drop="droppedOffering($event)"
      ></a-entity>

      <!-- PINK SPHERE : CLOTHO -->
      <a-sphere
        id="pink"
        position="0 1.3 -9.5"
        radius="0.1"
        material="color: pink; emissive: #b52688; emissiveIntensity: 4"
        obb-collider
        @obbcollisionstarted="openText($event, true, '.pink-text')"
        @obbcollisionended="openText($event, false, '.pink-text')"
        simple-grab
        emit-when-near="event: rope-visibility; distance: 3.7;"
        @rope-visibility="ropeVisibility()"
        @grab="handleAnswer('pink', true)"
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

      <!-- The maze -->
      <a-entity
        id="maze"
        gltf-model="#maze-model"
        position="0 -1.6 -18.3"
        rotation="0 90 0"
        scale="0.5 0.5 0.5"
      ></a-entity>

      <!-- FOG -->
      <TheFog :position="{ x: 2.82, y: 0.75, z: -11.78 }" />
      <TheFog :position="{ x: 2.82, y: 1.3, z: -11.78 }" />
      <TheFog :position="{ x: 2.82, y: 0.9, z: -11.78 }" />

      <!-- The wall -->
      <a-entity
        id="wall"
        gltf-model="#wall-model"
        position="3.23 0.10659 -11.71"
        rotation="0 90 0"
        scale="1.2 1.2 1"
      ></a-entity>

      <!-- The offerings -->
      <a-entity
        id="rope-offering"
        gltf-model="#rope-offering-model"
        position="2.3 0.800 -12.17"
        rotation="0 0 0"
        scale="0.1 0.1 0.1"
        simple-grab
        clickable
      ></a-entity>
      <a-entity
        id="coin-offering"
        gltf-model="#coin-model"
        position="2.3 0.800 -11.84"
        rotation="0 90 0"
        scale="0.1 0.1 0.1"
        simple-grab
        clickable
      ></a-entity>
      <a-entity
        id="bull-offering"
        gltf-model="#bull-model"
        position="2.3 0.800 -11.38"
        rotation="0 -90 0"
        scale="0.1 0.1 0.1"
        simple-grab
        clickable
      ></a-entity>

      <!-- The rope bundle -->
      <a-entity
        id="rope-bundle"
        gltf-model="#rope-bundle-model"
        position="0 0.5 -0.9"
        rotation="0 0 0"
        scale="1.8 1.8 1.8"
        visible="true"
        @click="ropeAppears()"
        clickable
      ></a-entity>
      <a-entity
        id="light-bundle-of-rope"
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

    <TheCameraRig
      :collidedLeft="ropeIsTouchedByLeft"
      :collidedRight="ropeIsTouchedByRight"
    />
    <!-- <TheCameraRig :collided="ropeIsTouched" /> -->
  </a-scene>
</template>

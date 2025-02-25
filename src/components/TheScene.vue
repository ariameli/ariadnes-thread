<script setup>
import { ref } from "vue";

import TheCameraRig from "./TheCameraRig.vue";
import TheMainRoom from "./TheMainRoom.vue";
import TheLifeCubeRoom from "./TheLifeCubeRoom.vue";
import ThePhysicRoom from "./ThePhysicRoom.vue";

import "../aframe/simple-grab.js";
import "../aframe/outline.js";

defineProps({
  scale: Number,
  overlaySelector: String,
});

const allAssetsLoaded = ref(false);
</script>

<template>
  <a-scene
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
      <a-asset-item
        id="scene-model"
        src="assets/models/minoic_labyrinth.glb"
      ></a-asset-item>
    </a-assets>

    <template v-if="allAssetsLoaded">
      <a-entity
        id="scene"
        gltf-model="#scene-model"
        position="-12 0.1 -2"
        scale="0.7 0.7 0.7"
      ></a-entity>
    </template>

    <TheCameraRig />
  </a-scene>
</template>

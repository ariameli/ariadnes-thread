<script setup>
import { defineProps } from "vue";

defineProps({
  position: {
    type: Object,
    required: true,
  },
  scale: {
    type: Object,
    default: () => ({ x: 0.5, y: 0.5, z: 0.5 }),
  },
});
</script>

<template>
  <a-entity
    class="fog"
    gltf-model="#fog-model"
    :position="`${position.x} ${position.y} ${position.z}`"
    :scale="`${scale.x} ${scale.y} ${scale.z}`"
  ></a-entity>
</template>

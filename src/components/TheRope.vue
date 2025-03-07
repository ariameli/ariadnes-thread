<script setup>
import { defineProps } from "vue";

defineProps({
  id: String,
  position: Object,
  rotation: Object,
  height: Number,
  handleCollision: Function,
  visible: { type: Boolean, default: false },
});
</script>

<template>
  <a-cylinder
    obb-collider
    :id="id"
    :position="`${position.x} ${position.y} ${position.z}`"
    :rotation="`${rotation.x} ${rotation.y} ${rotation.z}`"
    radius="0.03"
    :height="height"
    @obbcollisionstarted="handleCollision($event, true, id)"
    @obbcollisionended="handleCollision($event, false, id)"
    :visible="visible"
  ></a-cylinder>
</template>

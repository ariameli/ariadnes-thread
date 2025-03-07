<script setup>
import { defineProps } from "vue";

defineProps({
  id: String,
  correct: Boolean,
  position: Object,
  color: String,
  openText: Function,
  handleAnswer: Function,
  Title: String,
  Body: String,
});
</script>

<template>
  <a-sphere
    :id="id"
    :correct="correct"
    :position="`${position.x} ${position.y} ${position.z}`"
    radius="0.1"
    :material="`color: ${color}; emissive: ${color}; emissiveIntensity: 4`"
    obb-collider
    @obbcollisionstarted="openText($event, true, `.${id}-text`)"
    @obbcollisionended="openText($event, false, `.${id}-text`)"
    clickable
    @click="handleAnswer(id, correct)"
  >
    <a-entity
      :class="`${id}-text`"
      :text="`align: center; color: ${color}; value: ${Title}`"
      position="0 0.20947 0"
      visible="false"
    ></a-entity>
    <a-entity
      :class="`${id}-text`"
      :text="`align: center; value: ${Body}`"
      position="0 0.14662 0"
      scale="0.81 0.81 0.81"
      visible="false"
    ></a-entity>
    <a-light type="point" intensity="0.1" :color="id" position="0 0 0">
    </a-light>
  </a-sphere>
</template>

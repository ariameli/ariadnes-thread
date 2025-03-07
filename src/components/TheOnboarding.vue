<script setup>
import { ref } from "vue";

defineProps({
  loaded: Boolean,
});

const showOnboarding = ref(true);

function enterScene() {
  showOnboarding.value = false;
  if (
    AFRAME.utils.device.checkHeadsetConnected() &&
    !AFRAME.utils.device.isMobile()
  ) {
    document.querySelector("a-scene").enterVR();
  }
  document.querySelector("a-scene").emit("enter-scene");
}
</script>

<template>
  <div id="onboarding" v-if="showOnboarding">
    <div>
      <h1>Ariadne's Thread</h1>
      <p>
        You are <strong>Theseus</strong>, trapped within the endless corridors
        of the Labyrinth. Deep within, the Minotaur lurks. But you are not
        alone. Ariadne’s voice will guide you. To escape, follow the golden
        thread and solve the Labyrinth’s mysteries. But be warned: the Minotaur
        is always watching.
      </p>
      <p v-if="!loaded">loading...</p>
      <button v-if="loaded" @click="enterScene()">Enter the Labyrinth</button>
      <div class="licences">
        <section>
          <h4>How to play</h4>
          <ul>
            <li>Follow the thread – It will show the way.</li>
            <li>Solve the puzzles – Only wisdom will open the path.</li>
            <li>Trust Ariadne – Her voice will guide you.</li>
          </ul>
          <h4>Movement modes support</h4>
          <ul>
            <li>
              Desktop – Keyboard for move (WASD or Arrows keys) + Mouse for look
              control (Drag and drop)
            </li>
            <li>
              Mobile – 1x Finger touch to go forward + 2x Fingers touch to go
              backward + Gaze cursor for click
            </li>
            <li>
              VR/AR – walk + touch rope and drag to move forward + Gaze cursor
              for click
            </li>
          </ul>
        </section>
        <section>
          <h4>Source code</h4>
          <blockquote>
            <a href="https://github.com/Chabloz/a-frame-vite-vue-boilerplate"
              >Github repo</a
            >
          </blockquote>
        </section>
        <dl>
          <dt>
            <i>Included</i>
          </dt>
          <dt>
            <a href="https://github.com/c-frame/aframe-extras" target="_blank"
              >aframe-extras controls and animation-mixer</a
            >
          </dt>
          <dd>
            <a
              href="https://github.com/c-frame/aframe-extras/blob/master/LICENSE"
              target="_blank"
              >MIT License</a
            >
          </dd>

          <dt>
            <a
              href="https://github.com/jure/aframe-blink-controls/"
              target="_blank"
              >aframe-blink-controls</a
            >
          </dt>
          <dd>
            <a
              href="https://github.com/jure/aframe-blink-controls/blob/main/LICENSE"
              target="_blank"
              >MIT License</a
            >
          </dd>

          <dt>
            <a
              href="https://github.com/diarmidmackenzie/aframe-multi-camera/"
              target="_blank"
              >aframe-multi-camera</a
            >
          </dt>
          <dd>
            <a
              href="https://github.com/diarmidmackenzie/aframe-multi-camera/blob/main/LICENSE"
              target="_blank"
              >MIT License</a
            >
          </dd>

          <dt>
            <a
              href=" https://github.com/AdaRoseCannon/aframe-xr-boilerplate"
              target="_blank"
              >simple-navmesh-constraint</a
            >
          </dt>
          <dd>By Ada Rose Cannon under MIT License</dd>

          <dt>
            <a href="https://skfb.ly/NK7C" target="_blank">Cloud Test</a>
          </dt>
          <dd>
            by Andrea Marziano under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
          <dt>
            <a href="https://skfb.ly/n5lj3h0" target="_blank"
              >Bull Head Sculpt</a
            >
          </dt>
          <dd>
            by FushiNoRyuu under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
          <dt>
            <a href="https://skfb.ly/oZIPw" target="_blank">Golden coin</a>
          </dt>
          <dd>
            by Kae Games Official under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
          <dt>
            <a href="https://skfb.ly/6pIRz" target="_blank">Rope Knots</a>
          </dt>
          <dd>
            by aneeqayounas under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
          <dt>
            <a href="https://skfb.ly/o77vy" target="_blank"
              >Non-textured burning torch (2)</a
            >
          </dt>
          <dd>
            by Nortenko Dmytro under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
          <dt>
            <a href="https://skfb.ly/oTAnA" target="_blank"
              >Rope LowPoly Model With Texture</a
            >
          </dt>
          <dd>
            by Md.saifulislam under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
          <dt>
            <a href="https://poly.pizza/m/CkF171SeTV" target="_blank">Wall</a>
          </dt>
          <dd>
            by Quaternius under
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              >CC BY 4.0</a
            >
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
}
a {
  color: #eee;
  text-decoration: none;
}
.licences {
  margin: 2rem 0;
  padding-bottom: 1rem;
  font-size: 1rem;
  text-align: left;
}
.licences dt {
  padding-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: bold;
}
.licences dd {
  margin-left: 0;
  font-size: 0.8rem;
}

#onboarding {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #351616;
  color: #ccc;
  width: 100vw;
  height: 100vh;
  padding: 1rem;
  font-family: monospace;
  z-index: 10000;
  overflow: auto;
}
#onboarding > * {
  margin: 0 auto;
  max-width: 50rem;
  width: calc(100vw - 10rem);
  text-align: center;
  border-radius: 0.3rem;
  padding: 1rem;
  font-size: 1.3rem;
}
#onboarding button {
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  background-color: white;
  color: black;
  border: none;
  cursor: pointer;
}
</style>
#onboarding li { #onboarding li { font-size: 1rem; text-align: left; }

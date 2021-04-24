<template>
  <div id="app">
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <router-view/>
  </div>
</template>

<style>
#app {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  width: 100%;
  height: 100%;
  max-height: fit-content;
  z-index: 0;
  background: #555554;
  text-align: center;
  color: #2c3e50;
  overflow-y: auto;
  overflow-x: hidden;
}

h1 {
  margin: 0 0 0.5em;
  font-size: 55px;
  color: white;
  letter-spacing: 0.1em;
}

.bg {
  animation:slide 3s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #6c3 50%, rgb(0, 60, 255) 50%);
  bottom:0;
  left:-50%;
  opacity:.5;
  position:fixed;
  right:-50%;
  top:0;
  z-index:-1;
}

.bg2 {
  animation-direction:alternate-reverse;
  animation-duration:4s;
}

.bg3 {
  animation-duration:5s;
}

@keyframes slide {
  0% {
    transform:translateX(-25%);
  }
  100% {
    transform:translateX(25%);
  }
}
</style>

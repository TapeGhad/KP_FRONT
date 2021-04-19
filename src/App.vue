<template>
  <div id="app">
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
  overflow: auto;
}

h1 {
  margin: 0 0 0.5em;
  font-size: 55px;
  color: white;
  letter-spacing: 0.1em;
}
</style>

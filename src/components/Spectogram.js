import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react';
import WebView from "react-native-webview";
import Recording from "react-native-recording";

const Spectogram = () => {
  const [loaded, setLoaded] = useState(false);
  const [webview, setWebview] = useState();
  useEffect(() => {

    Recording.init({
      bufferSize: 1024,
      sampleRate: 48000,
      bitsPerChannel: 16,
      channelsPerFrame: 2,
    });

    Recording.start();
    return () => {
      Recording.stop();
    };
  }, []);
  useEffect(() => {
    const listener = Recording.addRecordingEventListener((data) => {
      if (loaded) {
        webview.injectJavaScript(`
          spectogram.update("${data}".split(",").map(function (value) {
            return parseInt(value)
          }));
          true;
        `);
      }
    });
    return () => {listener.remove()}
  },[loaded])
  return (
    <WebView
      ref={(ref) => (setWebview(ref))}
      style={{ backgroundColor:'transparent'}}
      onLoad={() => {setLoaded(true); console.log('Load dd Completed')}}
      source={{
        html: `<!doctype html>
<meta name="viewport" content="width=device-width, user-scalable=no">
<style>
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<canvas id="canvas"></canvas>
<script>
const Spectogram = function (selector) {
  this.canvas = document.querySelector(selector)
  this.canvas.width = document.body.clientWidth * window.devicePixelRatio
  this.canvas.height = document.body.clientHeight * window.devicePixelRatio
  this.context = this.canvas.getContext('2d')
  this.context.strokeStyle = '#16e1ff'
}

Spectogram.prototype.update = function (data) {
  const slice = this.canvas.width / (data.length - 1)
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.context.beginPath()
  const step = Math.ceil(data.length / width);
  const amp = 300;
  this.context.moveTo(0, this.context.height/2 + data[0]);
  for (var i = 0; i < this.context.width; i++) {
      this.context.lineTo(i, this.context.height/2 + data[step*i] * amp);
  }
  this.context.closePath();
  this.context.stroke();
}

window.spectogram = new Spectogram('#canvas')

document.ontouchmove = function (event) {
  event.preventDefault()
}
</script>`,
      }}
    />
  )
}

export default Spectogram
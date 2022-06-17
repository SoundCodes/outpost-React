import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react';
import WebView from "react-native-webview";
import Recording from "react-native-recording";

const Waveform = () => {
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
          waveform.update("${data}".split(",").map(function (value) {
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
      onLoad={() => {setLoaded(true); console.log('Load Completed')}}
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
const Waveform = function (selector) {
  this.canvas = document.querySelector(selector)
  this.canvas.width = document.body.clientWidth * window.devicePixelRatio
  this.canvas.height = document.body.clientHeight * window.devicePixelRatio
  this.context = this.canvas.getContext('2d')
  this.context.strokeStyle = '#16e1ff'
}

Waveform.prototype.update = function (data) {
  const slice = this.canvas.width / (data.length - 1)
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.context.beginPath()
  data.reduce((function (x, value, index) {
    const y = (0.5 + value / 16384) * this.canvas.height
    if (index > 0) {
      this.context.lineTo(x, y)
    } else {
      this.context.moveTo(x, y)
    }
    return x + slice
  }).bind(this), 0)
  this.context.stroke()
}

window.waveform = new Waveform('#canvas')

document.ontouchmove = function (event) {
  event.preventDefault()
}
</script>`,
      }}
    />
  )
}

export default Waveform
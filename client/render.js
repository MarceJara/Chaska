import * as THREE from './threejs/three.module.js';
import {STLLoader} from './threejs/STLLoader.js';
import {OrbitControls} from './threejs/OrbitControls.js';

const socket = io();

let scene, camera, renderer, mesh, controls, light;

let angulos, x, y ,z;

let dataser;

//serial.navigator


document.getElementById('connectButton').addEventListener('click', () => {
    if (navigator.serial) {
      connectSerial();
    } else {
      alert('Web Serial API not supported.');
    }
  });
  
async function connectSerial() {
    const log = document.getElementById('target');
      
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      const decoder = new TextDecoderStream();
      
      port.readable.pipeTo(decoder.writable);
  
      const inputStream = decoder.readable;
      const reader = inputStream.getReader();
      
      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          log.textContent += value + '\n' + "a";}
        if (done) {
          console.log('[readLoop] DONE', done);
          reader.releaseLock();
          break;
        }
      }
    
    } catch (error) {
      log.innerHTML = error;
    }
}


init();

function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(75, 950 / 700, 0.1, 1000);
    camera.position.set(0,0.5,1);

    light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    let light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0,-0.75,0.75);
    scene.add(light2);

    let grid = new THREE.GridHelper(3, 10);
    scene.add(grid);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(950, 700);
    document.getElementById('contenedor').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
}

function render(){
    socket.on('datos-giro', (datos) => {
        document.getElementById('datos').innerHTML = datos; 

        angulos = datos.split(' ')

        x = parseInt(angulos[1], 10)
        y = parseInt(angulos[2], 10)
        z = parseInt(angulos[3], 10)

        mesh.rotation.set(z * Math.PI / 180,x * Math.PI / 180,y * Math.PI / 180)

    });

    scene.add(mesh);
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    scene.remove( mesh );
    //scene.clear();

	// clean up
	//geometry.dispose();
	//material.dispose();
	//texture.dispose();
    //render.dispose();
   
};

let loader = new STLLoader();
loader.load('./models/cansat3.stl', (geometry) =>{
    mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({color:0x5662F6})
    );
    mesh.scale.set(0.08, 0.08, 0.08);
    mesh.position.set(0,0,0);


    render();

})
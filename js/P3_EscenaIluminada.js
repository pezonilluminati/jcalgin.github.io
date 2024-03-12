/**
 * EscenaIluminada.js
 * 
 * Practica AGM #3. Escena basica con interfaz, animacion e iluminacion
 * Se trata de añadir luces a la escena y diferentes materiales
 * 
 * @author 
 * 
 */

// Modulos necesarios
/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/

import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/

let cameraControls, effectController;
let esferaCubo,cubo,esfera,suelo;
let video;
let angulo;
let xpos =2;
let zpos =1;
let palante = false;
// Acciones
init();
loadScene();
loadGUI();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    /*******************
    * TO DO: Completar el motor de render, el canvas y habilitar
    * el buffer de sombras
    *******************/
    document.getElementById('container').appendChild( renderer.domElement );
    renderer.antialias = true;
    renderer.shadowMap.enabled = true;

    // Escena
    scene = new THREE.Scene();
    
    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000);
    camera.position.set( 0.5, 2, 7 );
    /*******************
    * TO DO: Añadir manejador de camara (OrbitControls)
    *******************/
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(-5,5,0);
    camera.lookAt( new THREE.Vector3(0,1,0) );

    // Luces
    /*******************
     * TO DO: Añadir luces y habilitar sombras
     * - Una ambiental
     * - Una direccional
     * - Una focal
     *******************/
    const ambiental = new THREE.AmbientLight(0x222222);
    ambiental.castShadow = true; 
    scene.add(ambiental);
    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.3);
    direccional.position.set(-2,2,-2);
    direccional.castShadow = true;
    scene.add(direccional);
    const focal = new THREE.SpotLight(0xFFFFFF,0.3);
    focal.position.set(-2,7,4);
    focal.target.position.set(0,0,0);
    focal.angle= Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow= true;
    focal.shadow.camera.far = 10;
    focal.shadow.camera.fov = 80;
    scene.add(focal);
    scene.add(new THREE.CameraHelper(focal.shadow.camera));
    
}

function loadScene()
{
    // Texturas
    /*******************
     * TO DO: Cargar texturas
     * - De superposición
     * - De entorno
     *******************/
    const path ="./images/";
    const texbur = new THREE.TextureLoader().load(path+"burberry_256.jpg");
    const texearth = new THREE.TextureLoader().load(path+"metal_128.jpg");
    const texsuelo = new THREE.TextureLoader().load(path+"illuminati_triangle_eye.png");

    // Materiales
    /*******************
     * TO DO: Crear materiales y aplicar texturas
     * - Uno basado en Lambert
     * - Uno basado en Phong
     * - Uno basado en Basic
     *******************/
    const material = new THREE.MeshBasicMaterial({ color: 'green', map: texsuelo});
    const matcubo = new THREE.MeshLambertMaterial({color:'yellow',map:texbur});
    
    const matesfera = new THREE.MeshPhongMaterial({
        color: 'white',
        specular: 'gray',
        shininess: 30,
        map: texearth
    });

    /*******************
    * TO DO: Misma escena que en la practica anterior
    * cambiando los materiales y activando las sombras
    *******************/
    esfera = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), matesfera);
    cubo = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), matcubo);
    const piramide = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 4), material);
    esfera.position.x = 1;
    esfera.position.y = 6;
    esfera.castShadow = true;
    esfera.receiveShadow = true;
    cubo.castShadow = cubo.receiveShadow = true;
    piramide.position.y = 3;
    esferaCubo = new THREE.Object3D();
    esferaCubo.add(esfera);
    esferaCubo.add(cubo);
    esferaCubo.add(piramide);
    esferaCubo.position.y = 1.5;
    scene.add(esferaCubo);

    scene.add( new THREE.AxesHelper(3) );
    cubo.add( new THREE.AxesHelper(1) );
    
    /******************
     * TO DO: Crear una habitacion de entorno
     ******************/
    const paredes = [];
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"Earth.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"Earth.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"Earth.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"Earth.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"Earth.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
        map: new THREE.TextureLoader().load(path+"Earth.jpg")}) );
    const habitacion = new THREE.Mesh( new THREE.BoxGeometry(40,40,40),paredes);
    scene.add(habitacion);
    /******************
     * TO DO: Asociar una textura de vídeo al suelo
     ******************/
    video = document.createElement('video');
    video.src = './videos/Yugoslav.mp4';
    video.load();
    video.muted = true;
    video.play();
    const matsuelo = new THREE.VideoTexture(video);
    suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 100,100), new THREE.MeshBasicMaterial({map:matsuelo}) );
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.2;
    suelo.receiveShadow = true;
    scene.add(suelo);
}
function loadGUI()
{
    // Interfaz de usuario
    /*******************
    * TO DO: Crear la interfaz de usuario con la libreria lil-gui.js
    * - Funcion de disparo de animaciones. Las animaciones deben ir
    *   encadenadas
    * - Slider de control de radio del pentagono
    * - Checkbox para alambrico/solido
    * - Checkbox de sombras
    * - Selector de color para cambio de algun material
    * - Boton de play/pause y checkbox de mute
    *******************/
    effectController = {
		mensaje: 'Control',
		giroY: 0.0,
		separacion: 0,
		sombras: true,
		play: function(){video.play();},
		pause: function(){video.pause();},
        mute: true,
		colorsuelo: "rgb(150,150,150)"
        
	};

    const gui = new GUI();
    const h = gui.addFolder("Control sombras y cubo");
    h.add(effectController, "sombras")
      .onChange(v=>{
        cubo.receiveShadow = v;
        esfera.receiveShadow = v;
        cubo.castShadow = v;
        esfera.castShadow = v;
      });
    const videoa = gui.addFolder("Control video");
    videoa.add(effectController, "play");
    videoa.add(effectController, "pause");
    videoa.add(effectController, "mute").onChange(v=>{video.muted = v});

}

function update(delta)
{
    /*******************
    * TO DO: Actualizar tween
    *******************/
    /* angulo += 0.01;
    esfera.rotation.y = angulo;*/
    console.log(esfera.position.x)
    console.log(esfera.position.z)
    if (esfera.position.z > 10){
        palante = true;
    }
    if (esfera.position.z < 3){
        palante = false;
    }
    if(palante == true){
        xpos -= 0.1;
        zpos -= 0.1;
    }else{xpos += 0.1;
        zpos+= 0.1;}
    esfera.position.x = xpos;
    esfera.position.z = zpos;
    TWEEN.update();
}

function render(delta)
{
    requestAnimationFrame( render );
    update(delta);
    renderer.render( scene, camera );
}
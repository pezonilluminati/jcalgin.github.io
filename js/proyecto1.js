// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";
import {TextGeometry} from "../lib/three.module.js";
import { FontLoader } from '../lib/FontLoader.module.js';
// ...
const materialB = new THREE.MeshBasicMaterial({ color: 'white' });
const materialN = new THREE.MeshBasicMaterial({ color: 'black' });
const materialEmisivo = new THREE.MeshBasicMaterial({ color: 0xffa500, emissive: 0xffff00 });
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var renderer, scene, camera;
var rub = new Array(8);
var anteriorm;
var selectedPiece;
var ganar = 'x';
var loader = new THREE.FontLoader();
for (let i = 0; i < 8; i++) {
    rub[i] = new Array(8);
}
var circle1, circle2, circle3, circle4;
var cameraControls, effectController;
var esferaCubo,cubo,esfera;
var ultima;
var angulo = 0;
var turno = 'n'
let x=1.29;
let y=1.16;
let z=-2.18;
let distanciax = 0.87;
var musica;
// Acciones
init();
loadScene();
render();


function changeCameraPosition(t) {
    var previousText = document.getElementById('turnoText');
    if (previousText) {
        document.body.removeChild(previousText);
    }
    var turnoText = document.createElement('div');
    turnoText.id = 'turnoText';
    turnoText.textContent = "Turno: " + (turno === 'n' ? "Negras" : "Blancas");
    turnoText.style.position = 'absolute';
    turnoText.style.top = '30px';
    turnoText.style.left = '30px';
    turnoText.style.fontSize = '24px';
    turnoText.style.color = 'white';
    turnoText.style.fontWeight = 'bold';
    document.body.appendChild(turnoText);
    var newPosition;
    if (t  === 'n') {
         newPosition = { x: 0, y: 4, z: 5 };
    }
    if (t === 'b') {
        newPosition = { x: 0, y: 4, z: -5 };
    }
    new TWEEN.Tween(camera.position)
        .to(newPosition, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function() {
            //camera.position.copy(newPosition);
            camera.lookAt(0, 0, 0);
        })  
        .start();
}

function gana(){
    new TWEEN.Tween(camera.position)
    .to({x: 0, y: 7, z: 0}, 5000) // Mover a (0,7,0) en 7500ms
    .easing(TWEEN.Easing.Quadratic.Out) // Easing para suavizar la animación
    .onStart(function() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                scene.remove(rub[i][j]);
            }
          
        }
        circle1.visible = false;
        circle2.visible = false;
        circle3.visible = false;
        circle4.visible = false;
        
        cameraControls.enabled = false; // Deshabilitar los controles de la cámara
        var textElement = document.createElement('div');
        var titleElement = document.createElement('h1');
        titleElement.textContent = 'Ganaron las ' + ganar;
        if (ganar === 'blancas'){
        titleElement.style.color = 'white';}
        else{titleElement.style.color = 'black';}
        textElement.id = 'texs';
        titleElement.style.fontSize = '100px';

        // Establecer el estilo del elemento div para que se centre en la pantalla
        textElement.style.display = 'block';
        textElement.style.position = 'fixed';
        textElement.style.top = '50%';
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.style.textAlign = 'center';
        
        // Crear niebla
        const fog = new THREE.Fog(0x000000, 0.1, 20);
        scene.fog = fog;

        // Agregar el elemento h1 al elemento div
        textElement.appendChild(titleElement);

        // Agregar el elemento div al cuerpo del documento
        document.body.appendChild(textElement);
    })
    .onUpdate(function() {
        camera.lookAt(0,0,0); // Asegurarse de que la cámara sigue mirando al origen
    })
    .onComplete(function() {
})
    .start();
}

function init()
{

    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor( new THREE.Color(0x0000AA) );
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Camara
    camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,100);
    camera.position.set(0,1,0);
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,0,0);
    // ...
    camera.lookAt(0,0,0);

    // Añadir texto en la esquina inferior izquierda
    var textElement = document.createElement('div');
    textElement.textContent = "LLega al final del tablero para ganar!";
    textElement.style.position = 'absolute';
    textElement.style.bottom = '30px';
    textElement.style.left = '30px';
    textElement.style.fontSize = '36px';
    textElement.style.fontWeight = 'bold';
    textElement.style.color = 'red';
    document.body.appendChild(textElement);
    // Crear un objeto de audio

    
    new TWEEN.Tween(camera.position)
        .to({x: 0, y: 7, z: 0}, 7000) // Mover a (0,7,0) en 7500ms
        .easing(TWEEN.Easing.Quadratic.Out) // Easing para suavizar la animación
        .onStart(function() {
        
            cameraControls.enabled = false; // Deshabilitar los controles de la cámara
            var textElement = document.createElement('div');
            var titleElement = document.createElement('h1');
            titleElement.textContent = 'Damas Espaciales';
            titleElement.style.color = 'white';
            textElement.id = 'texs';
            titleElement.style.fontSize = '100px';

            // Establecer el estilo del elemento div para que se centre en la pantalla
            textElement.style.display = 'block';
            textElement.style.position = 'fixed';
            textElement.style.top = '50%';
            textElement.style.left = '50%';
            textElement.style.transform = 'translate(-50%, -50%)';
            textElement.style.textAlign = 'center';

            // Agregar el elemento h1 al elemento div
            textElement.appendChild(titleElement);

            // Agregar el elemento div al cuerpo del documento
            document.body.appendChild(textElement);
        })
        .onUpdate(function() {
            camera.lookAt(0,0,0); // Asegurarse de que la cámara sigue mirando al origen
        })
        .onComplete(function() {
            cameraControls.enabled = true; // Habilitar los controles de la cámara cuando la animación termine
            camera.position.set(0,4,5);
            camera.lookAt(0,0,0);
            var textElement = document.getElementById('texs');
            if (textElement) {
                document.body.removeChild(textElement);
            }
        })
        .start(); // Iniciar la animación

    // Crear un Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const geometry = new THREE.CircleGeometry(0.2, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
circle1 = new THREE.Mesh(geometry, material);
circle2 = new THREE.Mesh(geometry, material);
circle3 = new THREE.Mesh(geometry, material);
circle4 = new THREE.Mesh(geometry, material);
circle1.name = 'circle1';
circle2.name = 'circle2';
circle3.name = 'circle3';
circle4.name = 'circle4';
circle1.rotation.x = -Math.PI / 2;
circle2.rotation.x = -Math.PI / 2;
circle3.rotation.x = -Math.PI / 2;
circle4.rotation.x = -Math.PI / 2;
circle1.position.y = 1.1;
circle2.position.y = 1.1;
circle3.position.y = 1.1;
circle4.position.y = 1.1;
circle1.visible = false;
circle2.visible = false;
circle3.visible = false;
circle4.visible = false;
scene.add(circle1);
scene.add(circle2);
scene.add(circle3);
scene.add(circle4);
    var turnoText = document.createElement('div');
    turnoText.id = 'turnoText';
    turnoText.textContent = "Turno: " + (turno === 'n' ? "Negras" : "Blancas");
    turnoText.style.position = 'absolute';
    turnoText.style.top = '30px';
    turnoText.style.left = '30px';
    turnoText.style.color = 'white';
    turnoText.style.fontSize = '24px';
    turnoText.style.fontWeight = 'bold';
    document.body.appendChild(turnoText);


    
    }


function loadScene(){
    const path ="./images/";
    const texsuelo = new THREE.TextureLoader().load(path+"ches/tablero.jpg");
    const material = new THREE.MeshBasicMaterial({color:'white', map:texsuelo});
    const paredes = [];
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"espac.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"espac.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"espac.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"espac.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"espac.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"espac.jpg")}) );
    const habitacion = new THREE.Mesh( new THREE.BoxGeometry(40,40,40),paredes);
    scene.add(habitacion);
    musica = new Audio('../sounds/musica.mp3');
    musica.volume = 0.3  ; // Establecer el volumen al 10%
    // Reproducir la música en bucle
    musica.loop = true;
   musica.muted = false;
    musica.play();
// GUI
const gui = new GUI();
const soundFolder = gui.addFolder('Musica');
const soundController = {
Silenciar: false,
toggleMute: function() {
   musica.muted = !musica.muted;   
    
}
};


soundFolder.add(soundController, 'Silenciar').onChange(soundController.toggleMute);  
    // Crear un cilindro
 
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    
  
    //Primeras dos filas (blanca)
    for (let i = 0; i < 8; i++) {
      
        if (i%2==0){
            rub[0][i] = new THREE.Mesh(geometry, materialB);
            rub[0][i].position.y = 1.16;
            rub[0][i].position.x = -3.05 + distanciax*i;
            rub[0][i].position.z = -3.05;
            scene.add(rub[0][i]);
            rub[0][i].name = "blanco"
        }else{ 
            rub[1][i] = new THREE.Mesh(geometry, materialB);
            rub[1][i].position.z = -3.05+distanciax;
            rub[1][i].position.y = 1.16;
            rub[1][i].position.x = -3.05 + distanciax*i;
            scene.add(rub[1][i]);
            rub[1][i].name = "blanco"
    }}
    // 3  (blanca)
    for (let i = 0; i < 8; i++) {
  
        if (i%2==0){
            rub[2][i] = new THREE.Mesh(geometry, materialB);
            rub[2][i].position.y = 1.16;
            rub[2][i].position.x = -3.05 + distanciax*i;
            rub[2][i].position.z = -3.05+distanciax*2;
            scene.add(rub[2][i]);
            rub[2][i].name = "blanco"
        }}

    // 6 (negro)
    for (let i = 0; i < 8; i++) {
        
        if (i%2==1){
            rub[5][i] = new THREE.Mesh(geometry, materialN);
            rub[5][i].position.y = 1.16;
            rub[5][i].position.x = -3.05 + distanciax*i;
            rub[5][i].position.z = -3.05+distanciax*5;
            rub[5][i].name = "negro"
            scene.add(rub[5][i]);
    
        }}

        // 7 y 8 (negro)
        rub[6] = rub[6] || [];
        rub[7] = rub[7] || [];
        for (let i = 0; i < 8; i++) {
        
            if (i%2==0){
                rub[6][i] = new THREE.Mesh(geometry, materialN);
                rub[6][i].position.y = 1.16;
                rub[6][i].position.x = -3.05 + distanciax*i;
                rub[6][i].position.z = -3.05+distanciax*6;
                scene.add(rub[6][i]);
                rub[6][i].name = "negro"
            }else{ 
                rub[7][i] = new THREE.Mesh(geometry, materialN);
                rub[7][i].position.z = -3.05+distanciax*7;
                rub[7][i].position.y = 1.16;
                rub[7][i].position.x = -3.05 + distanciax*i;
                scene.add(rub[7 ][i]);
                rub[7][i].name = "negro"
        
        }}

        for(let i = 0; i < rub.length; i++) {
            rub[i] = rub[i] || [];
            for(let j = 0; j < rub[i].length; j++) {
            rub[i][j] = rub[i][j] || new THREE.Mesh();
            rub[i][j].userData = { i, j };
            if (!rub[i][j].name) {
                rub[i][j].name = "vacio";
            }
            }
        }

        const glloader = new GLTFLoader();
        glloader.load( 'models/checkers/scene.gltf', function ( gltf ) {
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.position.y = 1;
            gltf.scene.rotation.y = -Math.PI/2;
            gltf.scene.name = 'checkers';
            scene.add( gltf.scene );
            
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
}
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


    raycaster.setFromCamera(mouse, camera);
    console.log(rub[3][7]);
    // Calcular objetos que intersectan el rayo
    const intersects = raycaster.intersectObjects(rub.flat());
    const intersetablero = raycaster.intersectObjects(scene.children);
    const intersects2 = raycaster.intersectObjects([circle1, circle2, circle3, circle4]);
    if (intersects.length > 0 && ganar === 'x') {
        resetText();
        console.log(intersects[0].object.userData);
        console.log(intersects[0].object.name);
       console.log(turno);
        circle1.visible = false;
        circle2.visible = false;
        circle3.visible = false;
        circle4.visible = false;
        if (selectedPiece && selectedPiece.name === 'negro') {
            selectedPiece.material = materialN;
        }
        if (selectedPiece && selectedPiece.name === 'blanco') {
            selectedPiece.material = materialB;
        }

        if (turno === 'b' && intersects[0].object.name === 'blanco'){
        intersects[0].object.material = materialEmisivo;
        selectedPiece = intersects[0].object;}
        

        if (turno === 'n' && intersects[0].object.name === 'negro'){
            intersects[0].object.material = materialEmisivo;
            selectedPiece = intersects[0].object;

        }


       
        let selectedPiecePosition
        if (selectedPiece != null){
         selectedPiecePosition = selectedPiece.position;}
         

        let frontSquarePosition1;
        let frontSquarePosition2;
        let frontSquarePosition3;
        let frontSquarePosition4;
        if(selectedPiece){
        if (turno === 'b' ) {
        if (selectedPiece != null){
        frontSquarePosition1 = new THREE.Vector3(
            selectedPiecePosition.x+ 0.87,
           1.1,
            selectedPiecePosition.z + 0.87
        );
         frontSquarePosition2 = new THREE.Vector3(
            selectedPiecePosition.x- 0.87,
           1.1,
            selectedPiecePosition.z + 0.87
        );
            frontSquarePosition3 = new THREE.Vector3(
                selectedPiecePosition.x+ 0.87*2,
                1.1,
                selectedPiecePosition.z+0.87*2

            );
            frontSquarePosition4 = new THREE.Vector3(
                selectedPiecePosition.x- 0.87*2,
                1.1,
                selectedPiecePosition.z+0.87*2

            );
    
    }}else{
            if(selectedPiece!= null){
        frontSquarePosition1 = new THREE.Vector3(
                selectedPiecePosition.x+ 0.87,
               1.1,
                selectedPiecePosition.z - 0.87
            );
            frontSquarePosition2 = new THREE.Vector3(
                selectedPiecePosition.x- 0.87,
               1.1,
                selectedPiecePosition.z - 0.87
            );
            frontSquarePosition3 = new THREE.Vector3(
                selectedPiecePosition.x+ 0.87*2,
                1.1,
                selectedPiecePosition.z-0.87*2

            );
            frontSquarePosition4 = new THREE.Vector3(
                selectedPiecePosition.x- 0.87*2,
                1.1,
                selectedPiecePosition.z-0.87*2

            );
        }} }
        
            

        if (intersects[0].object.userData.j < 7 && selectedPiece && frontSquarePosition1 && circle1  ) {
            if(intersects[0].object.userData.i < 7 &&turno === 'b' && rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].name === 'vacio' ){
            circle1.visible = true;
            circle1.position.copy(frontSquarePosition1);}
            if(intersects[0].object.userData.i > 0 && turno === 'n' && rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].name == 'vacio' &&  intersects[0].object.userData.j < 7 ){
                circle1.visible = true;
                circle1.position.copy(frontSquarePosition1);}
        }
        if (intersects[0].object.userData.j > 0 && selectedPiece && frontSquarePosition2 && circle2 ) {
            if( intersects[0].object.userData.i < 7 && turno === 'b' && rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1].name === 'vacio' ){
                selectedPiece = intersects[0].object;
                circle2.visible = true;
                circle2.position.copy(frontSquarePosition2);
        }
            if(intersects[0].object.userData.i > 0 && turno === 'n' && rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].name === 'vacio' ){
                selectedPiece = intersects[0].object;
                circle2.visible = true;
                circle2.position.copy(frontSquarePosition2);
        }

        if( intersects[0].object.userData.j < 6 && selectedPiece && frontSquarePosition3 && circle3){
            
            if(intersects[0].object.userData.i < 6 && turno === 'b' && rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].name === 'negro'){
                if(( !rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2]) || (rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2].name === 'vacio')){
            selectedPiece = intersects[0].object;
            circle3.visible= true;
            circle3.position.copy(frontSquarePosition3);}
             }if(intersects[0].object.userData.i > 1 && turno ==='n'  && rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].name === 'blanco' ){
                if(( !rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2]) || (rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2].name === 'vacio')){
                selectedPiece = intersects[0].object;
                circle3.visible= true;
                circle3.position.copy(frontSquarePosition3);}
            }
}

        if(selectedPiece && frontSquarePosition4 && circle4 && intersects[0].object.userData.j > 1){
            if(intersects[0].object.userData.i < 6 && turno === 'b'&& rub[selectedPiece.userData.i + 1][selectedPiece.userData.j- 1].name === 'negro' ){
                if(( !rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2]) || (rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2].name === 'vacio')){
                selectedPiece = intersects[0].object;
                circle4.visible = true;
                circle4.position.copy(frontSquarePosition4);}
            } if(intersects[0].object.userData.i > 1 && turno === 'n' && rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].name=== 'blanco' ){
                if(( !rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2]) || (rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2].name === 'vacio')){
                selectedPiece = intersects[0].object;
                circle4.visible = true;
                circle4.position.copy(frontSquarePosition4);}
            }




        }



    }
       
        
      
    }
    if (intersetablero.length > 0 && ganar === 'x') {
       
        if (intersects.length == 0 && intersects2.length == 0) {
            resetText();
            circle1.visible = false;
            circle2.visible = false;
            circle3.visible = false;
            circle4.visible = false;
        if (selectedPiece){
            if (selectedPiece.name === 'blanco'){
                selectedPiece.material = materialB;}
            if (selectedPiece.name === 'negro'){
                selectedPiece.material = materialN
            }
        }
        selectedPiece = null;
    }}

    if (intersects2.length > 0 && selectedPiece && selectedPiece != ultima && ganar === 'x') {    
        const nuevaPosicionx = intersects2[0].object.position.x; 
        const nuevaPosicionz = intersects2[0].object.position.z;
       
        if(selectedPiece.name === 'blanco' && intersects2[0].object.name === 'circle1' && turno === 'b' && circle1.visible == true){
            console.log()
            console.log(materialB);
            console.log(materialN)
            var copia = new THREE.Mesh(selectedPiece.geometry, materialB);
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1] = copia;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].userData = { i: selectedPiece.userData.i + 1, j: selectedPiece.userData.j + 1 };
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1].name = "blanco"
            copia.material = materialB;
          
            console.log(copia.material);
            console.log(copia.name);
            console.log(rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1]);
            scene.add(rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            var vacio = new THREE.Mesh();
            vacio.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio;
            turno = 'n';
            if (selectedPiece.userData.i + 1 === 7){  ganar = 'blancas';
            gana();}else{changeCameraPosition('n');}
            }

        if(selectedPiece.name === 'blanco' && intersects2[0].object.name === 'circle2' && turno === 'b'  && circle2.visible == true){
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1] = copia;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1].userData = { i: selectedPiece.userData.i + 1, j: selectedPiece.userData.j - 1 };
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1].name = "blanco"
            copia.material = materialB;
            scene.add(rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            var vacio = new THREE.Mesh();
            vacio.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio;
            turno = 'n';
            if (selectedPiece.userData.i + 1 === 7){  ganar = 'blancas';
            gana();}else{changeCameraPosition('n');}}

        if(selectedPiece.name ==='negro'&& intersects2[0].object.name === 'circle1' && turno === 'n'  && circle1.visible == true){
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1] = copia;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].userData = { i: selectedPiece.userData.i - 1, j: selectedPiece.userData.j + 1 };
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1].name = "negro"
            copia.material = materialN;
            scene.add(rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            var vacio = new THREE.Mesh();
            vacio.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio;
            turno = 'b';
            if (selectedPiece.userData.i - 1 === 0){  ganar = 'negras';
            gana();}else{changeCameraPosition('b');}
        }
        if(selectedPiece.name === 'negro' && intersects2[0].object.name === 'circle2' && turno === 'n'  && circle2.visible == true){
        
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1] = copia;
        
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].userData = { i: selectedPiece.userData.i - 1, j: selectedPiece.userData.j - 1 };
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1].name = "negro"
            copia.material = materialN;
            scene.add(rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            var vacio = new THREE.Mesh();
            vacio.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio;
            turno = 'b';
            if (selectedPiece.userData.i - 1 === 0){  ganar = 'negras';
            gana();}else{changeCameraPosition('b');}
            }
        if(selectedPiece.name === 'blanco' && intersects2[0].object.name == 'circle3' && turno === 'b'  && circle3.visible == true){
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2] = copia;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2 ].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2].userData = { i: selectedPiece.userData.i + 2, j: selectedPiece.userData.j + 2 };
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2].name = "blanco"
            copia.material = materialB;
            scene.add(rub[selectedPiece.userData.i + 2][selectedPiece.userData.j + 2]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            scene.remove(rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1]);
            var vacio1 = new THREE.Mesh();
            vacio1.name = "vacio";
            var vacio2 = new THREE.Mesh();
            vacio2.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio1;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1] = vacio2;
            turno = 'n';
            // Add sound effect
            const sound = new Audio('../sounds/sonido1.mp3');
            sound.play();
            if (selectedPiece.userData.i + 2 === 7){  ganar = 'blancas';
            gana();}else{changeCameraPosition('n');}
         }

         if(selectedPiece.name === 'blanco' && intersects2[0].object.name == 'circle4' && turno === 'b'  && circle4.visible == true){
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2] = copia;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2 ].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2].userData = { i: selectedPiece.userData.i + 2, j: selectedPiece.userData.j - 2 };
            rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2].name = "blanco"
            copia.material = materialB;
            scene.add(rub[selectedPiece.userData.i + 2][selectedPiece.userData.j - 2]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            scene.remove(rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1]);
            var vacio1 = new THREE.Mesh();
            vacio1.name = "vacio";
            var vacio2 = new THREE.Mesh();
            vacio2.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio1;
            rub[selectedPiece.userData.i + 1][selectedPiece.userData.j - 1] = vacio2;
            turno = 'n';
            const sound = new Audio('../sounds/sonido1.mp3');
            sound.play();
            if (selectedPiece.userData.i + 2 === 7){  ganar = 'blancas';
            gana();}else{changeCameraPosition('n');}
         }
         if(selectedPiece.name === 'negro' && intersects2[0].object.name == 'circle3' && turno === 'n'  && circle3.visible == true){
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2] = copia;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2 ].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2].userData = { i: selectedPiece.userData.i - 2, j: selectedPiece.userData.j + 2 };
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2].name = "negro"
            copia.material = materialN;
            scene.add(rub[selectedPiece.userData.i - 2][selectedPiece.userData.j + 2]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            scene.remove(rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1]);
            var vacio1 = new THREE.Mesh();
            vacio1.name = "vacio";
            var vacio2 = new THREE.Mesh();
            vacio2.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio1;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j + 1] = vacio2;
            turno = 'b';
            const sound = new Audio('../sounds/sonido1.mp3');
            sound.play();
            if (selectedPiece.userData.i -2 === 0){  ganar = 'negras';
            gana();}else{changeCameraPosition('b');}
         }
         if(selectedPiece.name === 'negro' && intersects2[0].object.name == 'circle4' && turno === 'n' && circle4.visible == true){
            var copia = new THREE.Mesh(selectedPiece.geometry, selectedPiece.material);
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2] = copia;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2 ].position.x = nuevaPosicionx;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2].position.z = nuevaPosicionz;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2].position.y = selectedPiece.position.y;
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2].userData = { i: selectedPiece.userData.i - 2, j: selectedPiece.userData.j - 2 };
            rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2].name = "negro"
            copia.material = materialN;
            scene.add(rub[selectedPiece.userData.i - 2][selectedPiece.userData.j - 2]);
            scene.remove(rub[selectedPiece.userData.i][selectedPiece.userData.j]);
            scene.remove(rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1]);
            var vacio1 = new THREE.Mesh();
            vacio1.name = "vacio";
            var vacio2 = new THREE.Mesh();
            vacio2.name = "vacio";
            rub[selectedPiece.userData.i][selectedPiece.userData.j] = vacio1;
            rub[selectedPiece.userData.i - 1][selectedPiece.userData.j - 1] = vacio2;
            turno = 'b';
            const sound = new Audio('../sounds/sonido1.mp3');
            sound.play();
            if (selectedPiece.userData.i - 2 === 0){  ganar = 'negras';
            gana();}else{changeCameraPosition('b');}
         }
        
         console.log(rub[selectedPiece.userData.i + 1][selectedPiece.userData.j + 1]);
        circle1.visible = false;
        circle2.visible = false;
        circle3.visible = false;
        circle4.visible = false;
        ultima = selectedPiece.clone();
        selectedPiece = null;
        para();
    }}
    

, false);
async function para(){
    await sleep(1000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetText(){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (rub[i][j].name === 'blanco'){
                rub[i][j].material = materialB;
            }
            if (rub[i][j].name === 'negro'){
                rub[i][j].material = materialN;
            }
        }
    
}}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

function onChange(){

  
}

function render()
{
    requestAnimationFrame( render );

    TWEEN.update();
    onChange();
    animate();
    renderer.render( scene, camera );
}

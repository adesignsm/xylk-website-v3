import { Suspense } from 'react';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DeviceOrientationControls } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import { useGLTF, DeviceOrientationControls } from '@react-three/drei';

//MODEL
import FIGURE from "../models/xylky.glb";

const ModelScene = () => {

    var scene, camera, renderer, controls;
    var model, neck, waist, left_arm, right_arm;
    var possible_anim, mixer, idle;
    var sphere;
    
    var clock = new THREE.Clock;
    var currently_anim = false;
    var raycaster = new THREE.Raycaster();
    
    var viewport_mobile = window.matchMedia("(max-width: 600px)");
    var viewport_desktop = window.matchMedia("(min-width:1025px)");
    
    function init() {
    
        var loader = new GLTFLoader();
                    
        loader.load(FIGURE, function(model) {
    
            var object = model.scene;
    
            object.traverse((node) => {
    
                if (node.isBone) {
                    // console.log(node.name);
                }
    
                if (node.isBone && node.name === "Bone003_2") {
    
                    neck = node;
                }
    
                if (node.isBone && node.name === "Bone_41") {
    
                    waist = node;
                }
    
                if (node.isBone && node.name === "Bone005_20") {
    
                    left_arm = node;
            
                    left_arm.rotation.z = -1;
                    left_arm.rotation.y = -6.2;
                    left_arm.rotation.x = -25;
                }
    
                if (node.isBone && node.name === "Bone029_38") {
    
                    right_arm = node;
    
                    right_arm.rotation.z = 1;
                    right_arm.rotation.y = 6.2;
                    right_arm.rotation.x = 25;
                }
    
                if (!node.isMesh) return;
    
                    node.material.wireframe = false;
                });

                scene.add(object);
    
                object.scale.set(3, 3, 3);
                object.position.y = -11;
            });
        //setup
    
        scene = new THREE.Scene();
    
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 18;
    
        renderer = new THREE.WebGLRenderer({antialis: true, alpha: true});
        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("figure-canvas").appendChild(renderer.domElement);
    
        //lighting
        var hemi_light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemi_light.position.set(0, 50, 0);
        scene.add(hemi_light);
    
        var d = 8.25;
        var direction_light = new THREE.DirectionalLight(0xffffff, 0.54);
        direction_light.position.set(-8, 12, 8);
        direction_light.castShadow = true;
        direction_light.shadow.mapSize = new THREE.Vector2(1024, 1024);
    
        direction_light.shadow.camera.near = 0.1;
        direction_light.shadow.camera.far = 1500;
        direction_light.shadow.camera.left = d * -1;
        direction_light.shadow.camera.right = d;
        direction_light.shadow.camera.top = d;
        direction_light.shadow.camera.bottom = d * -1;
    
        scene.add(direction_light);
    
        animate();
    
    }
    
    //animate function
    function animate() {
    
        //updates clock so animation doesnt slow down or drop in fps
        if (mixer) {
            mixer.update(clock.getDelta());
        }
    
        if (resize_render_size(renderer)) {
    
            var canvas = renderer.domElement;
    
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    //resize function called in animate function
    function resize_render_size(renderer) {
    
        var canvas = renderer.domElement;
        var w = window.innerWidth;
        var h = window.innerHeight;
    
        var c_w = canvas.width / window.devicePixelRatio;
        var c_h = canvas.height / window.devicePixelRatio;
    
        var needs_resize = c_w !== w || c_h !== h;
    
        if (needs_resize) {
    
            renderer.setSize(w, h, false);
        }
    
        return needs_resize;
    }
    
    setTimeout(() => {
        init();
    }, 1000);
    
    function onClick() {
        // feature detect
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          
          DeviceMotionEvent.requestPermission().then(permissionState => {
              
              if (permissionState === 'granted') {
                
                window.addEventListener('devicemotion', () => {});
              }
              
            }).catch(console.error);
            
        } else {
          // handle regular non iOS 13+ devices
        }
    }
    
    
    window.onload = function() {
    
        if (viewport_mobile.matches) {
    
            window.addEventListener("deviceorientation", deviceMove, false);
            // console.log("mobile");
    
        } else if (viewport_desktop.matches) {
    
            window.removeEventListener("deviceorientation", deviceMove, false);
            // console.log("desktop");
        }
    }
    
    function deviceMove(event) {
    
        controls = new DeviceOrientationControls(camera, true);
    
        if (window.DeviceOrientationEvent) {
    
            // console.log(event);
            // console.log(event.beta + ", " + event.gamma);
        
            neck.rotation.y = event.gamma / 100;
            neck.rotation.x = event.beta / 100;
        
            waist.rotation.y = event.gamma / 100;
            waist.rotation.x = event.beta / 100;
        }
    }
    
    //mouse interactions
    document.addEventListener("mousemove", function(e) {
    
        var mouse_coords = getMousePos(e);
    
        if (neck && waist) {
    
            move_joints(mouse_coords, neck, 50);
            move_joints(mouse_coords, waist, 50);
        }
    });
    
    function getMousePos(e) {
    
        return {
            x: e.clientX, 
            y: e.clientY
        };
    }
    
    //mouse joints movement
    function move_joints(mouse, joint, degree_limit) {
    
        var degrees = getMouseDegrees(mouse.x, mouse.y, degree_limit);
    
        joint.rotation.y = MathUtils.degToRad(degrees.x);
        joint.rotation.x = MathUtils.degToRad(degrees.y);
    }
    
    function getMouseDegrees(x, y, degree_limit) {
    
        var dx = 0, dy = 0, xdiff, xPercentage, ydiff, yPercentage;
      
        var w = { x: window.innerWidth, y: window.innerHeight };
      
        if (x <= w.x / 2) {
          
          xdiff = w.x / 2 - x;  
          xPercentage = (xdiff / (w.x / 2)) * 100;
          dx = ((degree_limit * xPercentage) / 100) * - 1; 
        }
    
        if (x >= w.x / 2) {
    
          xdiff = x - w.x / 2;
          xPercentage = (xdiff / (w.x / 2)) * 100;
          dx = (degree_limit * xPercentage) / 100;
        }
        
        if (y <= w.y / 2) {
    
          ydiff = w.y / 2 - y;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          dy = (((degree_limit * 0.5) * yPercentage) / 100) * - 1;
        }
        
        if (y >= w.y / 2) {
          ydiff = y - w.y / 2;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          dy = (degree_limit * yPercentage) / 100;
        }
        return { x: dx, y: dy };
      }
}

export default ModelScene;

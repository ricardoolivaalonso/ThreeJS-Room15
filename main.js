import './styles/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false

const bakedMaterial = new THREE.MeshBasicMaterial({ 
    map: bakedTexture,
    side: THREE.DoubleSide
})

bakedMaterial.userData.outlineParameters = {
	thickness: 0.0025,
	color: new THREE.Color().setHSL(0, 0,0).toArray(),
	alpha: 1,
	visible: true
};

gltfLoader.load(
    'model.glb',
    (gltf) => {
        gltf.scene.traverse( child => {
            child.material = bakedMaterial 
        })
        scene.add(gltf.scene)
        
    }
)


const camera = new THREE.PerspectiveCamera(10, sizes.width / sizes.height, 0.1, 500)
camera.position.x = 50
camera.position.y = 30
camera.position.z = 100
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = true
controls.minPolarAngle = Math.PI / 5
controls.maxPolarAngle = Math.PI / 2


const minPan = new THREE.Vector3( -5, -2, -5 )
const maxPan = new THREE.Vector3( 5, 2, 5 )
const effect = new OutlineEffect( renderer )

const tick = () => {
    controls.update()
    controls.target.clamp( minPan, maxPan )
    // renderer.render(scene, camera)
	effect.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})


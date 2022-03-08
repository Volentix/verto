import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// import envTexture from '../animation/textures/reading_room_1k.hdr'
import envModel from '../animation/model/scene_2.glb'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { addPostProcessing } from './helpers/postprocessing'

export default function init () {
  let mixer, composer, logo, abstract, greenLight, blueLight, purpleLight
  const scene = new THREE.Scene()
  let camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(11, 2.4, 49)
  camera.rotation.y = 0.6
  const clock = new THREE.Clock()
  // const gui = new GUI()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById('abstract_aniamtion') })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // document.querySelector('#abstract_aniamtion').appendChild(renderer.domElement)
  // const controls = new OrbitControls(camera, renderer.domElement);
  const container = renderer.domElement

  // const envmaploader = new THREE.PMREMGenerator(renderer)

  // new RGBELoader()
  //   .setPath('/img/')
  //   .load('reading_room_1k.hdr', function (hdrmap) {
  //     envmap = envmaploader.fromCubemap(hdrmap)

  //   })
  const loader = new GLTFLoader()

  const metalBaseMaterialParams = {
    color: 0xffe25d,
    metalness: 1,
    roughness: 0.1
    // envMapIntensity: 2,
    // envMap: envmap.texture
  }

  loader.load(envModel,
    function (gltf) {
      abstract = gltf.scene.children[0].children[1]
      logo = gltf.scene.children[0].children[0]
      blueLight = gltf.scene.children[1]
      purpleLight = gltf.scene.children[2]
      greenLight = gltf.scene.children[3]

      console.log(gltf)
      logo.children[0].material = new THREE.MeshPhysicalMaterial({
        ...metalBaseMaterialParams,
        color: 0xcccccc
      })
      logo.children[1].material = new THREE.MeshPhysicalMaterial(
        metalBaseMaterialParams
      )
      logo.material = new THREE.MeshPhysicalMaterial(metalBaseMaterialParams)
      abstract.material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.7,
        roughness: 0.1
      })
      scene.add(abstract)
      scene.add(logo)
      scene.add(greenLight)
      scene.add(blueLight)
      scene.add(purpleLight)

      mixer = new THREE.AnimationMixer(abstract)

      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play()
      })
      composer = addPostProcessing(renderer, scene, camera, container)
      mixer.timeScale = 0.001 // animation speed
      animate()
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    function () {
      console.log('An error happened')
    }
  )
  // Camera GUI controls
  // const cameraFolder = gui.addFolder("Camera");
  // cameraFolder.add(camera.position, "x", -100, 100);
  // cameraFolder.add(camera.position, "y", -100, 100);
  // cameraFolder.add(camera.position, "z", -100, 100);
  // cameraFolder.add(camera.rotation, "x", 0, 10);
  // cameraFolder.add(camera.rotation, "y", 0, 10);
  // cameraFolder.add(camera.rotation, "z", 0, 10);
  // cameraFolder.open();

  window.addEventListener('resize', onWindowResize)

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
  }

  function animate () {
    requestAnimationFrame(animate)
    // logo.rotation.y += clock.getDelta() * 0.1;
    abstract.rotation.x += 0.0009
    abstract.rotation.y += 0.0009
    // abstract.rotation.z += 0.005
    mixer.update(clock.getDelta())
    renderer.render(scene, camera)
    if (composer) {
      // composer.render();
    }
  }
}

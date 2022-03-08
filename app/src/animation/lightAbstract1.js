import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import envModel from '../animation/model/scene_2.glb'
import gsap from 'gsap'
import px from './textures/px.png'
import nx from './textures/nx.png'
import py from './textures/py.png'
import ny from './textures/ny.png'
import pz from './textures/pz.png'
import nz from './textures/nz.png'

let mixer,
  logo,
  abstract,
  greenLight,
  blueLight,
  purpleLight,
  lastIndex = 0,
  envmap2,
  camera

export default function init () {
  const scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(-30, 0, 80)
  // camera.position.set(-20, 2.4, 39)
  const clock = new THREE.Clock()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById('abstract_aniamtion') })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // document.body.appendChild(renderer.domElement)

  envmap2 = new THREE.CubeTextureLoader().load([
    px,
    nx,
    py,
    ny,
    pz,
    nz
  ])

  const loader = new GLTFLoader()

  const metalBaseMaterialParams = {
    color: 0xffe25d,
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1,
    envMap: envmap2,
    transparent: true
  }

  loader.load(
    envModel,
    function (gltf) {
      console.log(gltf)
      abstract = gltf.scene.children[0].children[1]
      logo = gltf.scene.children[0].children[0]
      blueLight = gltf.scene.children[1]
      purpleLight = gltf.scene.children[2]
      greenLight = gltf.scene.children[3]

      logo.children[0].material = new THREE.MeshPhysicalMaterial({
        ...metalBaseMaterialParams,
        color: 0xFFFFFF
      })
      logo.children[1].material = new THREE.MeshPhysicalMaterial(
        metalBaseMaterialParams
      )
      logo.material = new THREE.MeshPhysicalMaterial(metalBaseMaterialParams)
      abstract.material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.3,
        side: THREE.DoubleSide
      })

      abstract.rotation.y = -0.15
      abstract.rotation.x = 0
      abstract.rotation.z = 0
      abstract.opacity = 0.75
      logo.rotation.y = -0.1
      logo.rotation.x = -0.1
      blueLight.intensity = 0.6
      purpleLight.intensity = 0.6
      greenLight.intensity = 0.6
      // logo.position.y = 0
      // logo.position.x = 0
      // abstract.rotation.x = -0.4

      scene.add(abstract)
      scene.add(logo)
      scene.add(greenLight)
      scene.add(blueLight)
      scene.add(purpleLight)

      mixer = new THREE.AnimationMixer(abstract)

      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play()
      })
      mixer.timeScale = 0.01 // animation speed
      animate()
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    function () {
      console.log('An error happened')
    }
  )

  window.addEventListener('resize', onWindowResize)

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
  }

  function animate () {
    requestAnimationFrame(animate)
    const delta = clock.getDelta()
    // logo.rotation.y += delta * 0.1;
    // abstract.rotation.x += 0.0009;
    // abstract.rotation.y += 0.0009;
    mixer.update(delta)
    renderer.render(scene, camera)
  }
}

export const transateAnimationTo = (animationIndex) => {
  const isValidIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(animationIndex)
  if (isValidIndex) {
    switch (animationIndex) {
      case 0:
        gsap.to(abstract.rotation, {
          duration: 1 * lastIndex,
          z: 0,
          y: 0
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          x: 0,
          y: 0,
          z: 0
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.rotation, {
          x: -0.1,
          y: -0.1
        })
        gsap.to(logo.position, {
          x: 0,
          y: 0,
          z: 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -30,
          y: 0,
          z: 80
        })
        gsap.to(blueLight, {
          intensity: 1
        })
        gsap.to(purpleLight, {
          intensity: 1
        })
        gsap.to(greenLight, {
          intensity: 1
        })
        break
      case 1:
        gsap.to(abstract.rotation, {
          duration: 2 * animationIndex,
          z: 3,
          y: 2
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          z: 8
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          intensity: 0.6
        })
        gsap.to(purpleLight, {
          intensity: 0.6
        })
        gsap.to(greenLight, {
          intensity: 0.6
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 4.6,
          z: 39
        })
        break
      case 2:
        gsap.to(abstract.rotation, {
          duration: 2 * animationIndex,
          z: 4,
          y: 2.5
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          z: 7
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          intensity: 0.6
        })
        gsap.to(purpleLight, {
          intensity: 0.6
        })
        gsap.to(greenLight, {
          intensity: 0.6
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 39
        })
        break

      case 3:
        gsap.to(abstract.rotation, {
          duration: 1 * animationIndex,
          z: 2,
          y: 2
        })
        gsap.to(abstract.material, {
          duration: 2 * animationIndex,
          metalness: 0.9,
          roughness: 0.3,
          opacity: 0.2
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          z: 2
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          duration: 1 * animationIndex,
          intensity: 1
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 39
        })
        break

      case 4:
        gsap.to(abstract.rotation, {
          duration: 2 * animationIndex,
          z: 1,
          y: 0.5
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          z: 10
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 39
        })
        break

      case 5:
        gsap.to(abstract.rotation, {
          duration: 2 * animationIndex,
          z: 3,
          y: 2
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          z: 8
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 29
        })
        break
      case 6:
        gsap.to(abstract.rotation, {
          duration: 1 * animationIndex,
          z: 0,
          x: 0,
          y: -0.5
        })
        gsap.to(abstract.material, {
          duration: 2 * animationIndex,
          metalness: 2,
          roughness: 0.3,
          opacity: 1
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          y: -10,
          x: 10,
          z: 0
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          duration: 1 * animationIndex,
          intensity: 1
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -40,
          y: 0,
          z: 70
        })
        break
      case 7:
        gsap.to(abstract.rotation, {
          duration: 2 * animationIndex,
          z: 3,
          y: 1
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          y: 11,
          x: 10,
          z: 8
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          intensity: 0.6
        })
        gsap.to(purpleLight, {
          intensity: 0.6
        })
        gsap.to(greenLight, {
          intensity: 0.6
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 29
        })
        break
      case 8:
        gsap.to(abstract.rotation, {
          duration: 10 * animationIndex,
          z: 10,
          x: 10,
          y: -0.5
        })
        gsap.to(abstract.material, {
          duration: 2 * animationIndex,
          metalness: 2,
          roughness: 0.3,
          opacity: 1
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          y: -10,
          x: 10,
          z: 0
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          duration: 1 * animationIndex,
          intensity: 1
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -40,
          y: 0,
          z: 70
        })
        break
      case 9:
        gsap.to(abstract.rotation, {
          duration: 2 * animationIndex,
          z: 1,
          y: 1
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          z: 1
        })
        gsap.to(logo.children[0].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5,
          opacity: 0
        })
        gsap.to(blueLight, {
          intensity: 0.6
        })
        gsap.to(purpleLight, {
          intensity: 0.6
        })
        gsap.to(greenLight, {
          intensity: 0.6
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 29
        })
        break
    }
    lastIndex = animationIndex
  }
}

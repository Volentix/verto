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
  camera,
  abstractMaterial,
  abstractMaterialDark

export default function init (themeMode) {
  window.removeEventListener('mousemove', e => {
    const y = -((window.innerWidth - e.pageX * 2) / 90) / 100
    const x = -((window.innerHeight - e.pageY * 2) / 90) / 100
    // let y = e.offsetY
    // console.log(x, y)
    if (logo) {
      gsap.to(logo.rotation, {
        duration: 1,
        x: x,
        y: y
      })
    }
  })
  console.log('init themeMode', themeMode)
  const scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  if (window.innerWidth < 768) {
    camera.position.set(-5, 0, 90)
  } else {
    camera.position.set(-30, 0, 80)
  }
  // camera.position.set(-20, 2.4, 39)
  const clock = new THREE.Clock()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById('abstract_aniamtion') })
  renderer.sortObjects = false
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
  const metalBaseMaterialParamsLightMode = {
    color: 0xffffff,
    metalness: 0,
    roughness: 4.4,
    envMapIntensity: 5,
    envMap: envmap2,
    transparent: true
  }

  loader.load(
    envModel,
    (gltf) => {
      console.log(gltf)
      abstract = gltf.scene.children[0].children[1]
      logo = gltf.scene.children[0].children[0]
      blueLight = gltf.scene.children[1]
      purpleLight = gltf.scene.children[2]
      greenLight = gltf.scene.children[3]
      blueLight.color.r = 255
      blueLight.color.g = 255
      blueLight.color.b = 0
      purpleLight.color.r = 0
      purpleLight.color.g = 0
      purpleLight.color.b = 0
      greenLight.color.r = 0
      greenLight.color.g = 0
      greenLight.color.b = 0
      logo.children[0].material = new THREE.MeshPhysicalMaterial({
        ...metalBaseMaterialParams,
        color: 0xFFFFFF
      })
      logo.children[1].material = new THREE.MeshPhysicalMaterial(
        metalBaseMaterialParams
      )
      // console.log('logo', logo)
      abstractMaterialDark = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.0,
        roughness: 0,
        side: THREE.DoubleSide
      })
      abstractMaterial = new THREE.MeshPhysicalMaterial(
        metalBaseMaterialParamsLightMode
      )
      logo.material = new THREE.MeshPhysicalMaterial(metalBaseMaterialParams)

      abstract.material = themeMode === 'dark' ? abstractMaterialDark : abstractMaterial

      abstract.rotation.y = -0.15
      abstract.rotation.x = 0
      abstract.rotation.z = 0
      abstract.opacity = 0.75
      logo.rotation.y = -0.1
      logo.rotation.x = -0.1
      blueLight.intensity = themeMode === 'dark' ? 0.6 : 0.8
      purpleLight.intensity = themeMode === 'dark' ? 0.6 : 0
      greenLight.intensity = themeMode === 'dark' ? 0.6 : 0
      // logo.position.y = 0
      // logo.position.x = 0
      // abstract.rotation.x = -0.4

      scene.add(abstract)
      scene.add(logo)
      scene.add(greenLight)
      scene.add(blueLight)
      scene.add(purpleLight)
      /*
      let counterX = 0
      let counterZ = 0
      let counterY = 0
      setInterval(() => {
        gsap.to(abstract.rotation, {
          duration: 4,
          x: counterX,
          z: counterZ,
          y: counterY
        })
        counterX += 0.01
        counterZ += 0.01
        counterY += 0.01
      }, 100)
*/
      mixer = new THREE.AnimationMixer(abstract)

      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play()
      })
      mixer.timeScale = 0.01 // animation speed
      animate()
    },
    (xhr) => {
      const total = 6343222
      // xhr.total
      console.log((xhr.loaded / total) * 100 + '% loaded')
      if ((xhr.loaded / total) * 100 >= 102) {
        if (abstract) {
          gsap.to(abstract.rotation, {
            duration: 10000,
            x: 100,
            z: 200,
            y: 150
          })
        }
        if (window.outerWidth < 768) {
          gsap.to(camera.position, {
            duration: 4,
            x: -5,
            y: 0,
            z: 80
          })
        }
      }
      // console.log('xhr', xhr)
    },
    (error) => {
      console.log(error)
    }
  )

  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', e => {
    const y = -((window.innerWidth - e.pageX * 2) / 90) / 100
    const x = -((window.innerHeight - e.pageY * 2) / 90) / 100
    // let y = e.offsetY
    // console.log(x, y)
    if (logo) {
      gsap.to(logo.rotation, {
        duration: 1,
        x: x,
        y: y
      })
      // gsap.to(abstract.rotation, {
      //   duration: 10000,
      //   x: 100,
      //   z: 200,
      //   y: 150
      // })
    }
  })

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    console.log(window.innerWidth, window.innerHeight)
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
  document.getElementById('abstract_aniamtion').classList.add('rendered_done')
  document.getElementById('abstract_aniamtion').classList.add('class1')
  document.getElementById('abstract_aniamtion').classList.add('class2')
}

export const transateAnimationTo = (animationIndex, themeMode) => {
  const isValidIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(animationIndex)
  if (isValidIndex) {
    switch (animationIndex) {
      case 0:
        if (abstract) {
          // gsap.to(abstract.rotation, {
          //   duration: 1 * lastIndex,
          //   z: 0,
          //   y: 0
          // })
          gsap.to(abstract.position, {
            duration: 1 * animationIndex,
            x: 0,
            y: 0,
            z: 0
          })
          gsap.to(abstract.rotation, {
            duration: 10000,
            x: 100,
            z: 200,
            y: 150
          })
        }
        if (logo) {
          gsap.to(logo.children[0].material, {
            duration: 0.5 * lastIndex,
            opacity: 1
          })
          gsap.to(logo.children[1].material, {
            duration: 0.5 * lastIndex,
            opacity: 1
          })
          gsap.to(logo.rotation, {
            duration: 1 * lastIndex,
            x: -0.1,
            y: -0.1
          })
          gsap.to(logo.position, {
            duration: 1 * lastIndex,
            x: 0,
            y: 0,
            z: 0
          })
        }
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -30,
          y: 0,
          z: 80
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        break
      case 1:
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 4,
        //   y: 2.5
        // })
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
        gsap.to(logo.material, {
          duration: 0.5 * lastIndex,
          opacity: 0
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -30,
          y: 1.4,
          z: 70
        })
        break
      case 2:
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 4,
        //   y: 2.5
        // })
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
        gsap.to(logo.material, {
          duration: 0.5 * lastIndex,
          opacity: 0
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 39
        })
        break
      case 3:
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 2,
        //   y: 2
        // })
        // gsap.to(abstract.material, {
        //   duration: 1 * animationIndex,
        //   metalness: 0.9,
        //   roughness: 0.3,
        //   opacity: 0.2
        // })
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
          intensity: themeMode === 'dark' ? 0.1 : 0.8
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 39
        })
        break
      case 4:
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 1,
        //   y: 0.5
        // })
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
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 3,
        //   y: 2
        // })
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
        if (abstract) {
          // gsap.to(abstract.rotation, {
          //   duration: 1 * lastIndex,
          //   z: 0,
          //   y: 0
          // })
          gsap.to(abstract.position, {
            duration: 1 * animationIndex,
            x: 0,
            y: 0,
            z: 0
          })
        }
        gsap.to(logo.children[0].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.rotation, {
          duration: 1 * lastIndex,
          x: -0.1,
          y: -0.1
        })
        gsap.to(logo.position, {
          duration: 1 * lastIndex,
          x: 0,
          y: 0,
          z: 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -50,
          y: 0,
          z: 80
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        break
      case 7:
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 3,
        //   y: 1
        // })
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
          intensity: themeMode === 'dark' ? 0.6 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 0.6 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 0.6 : 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 29
        })
        break
      case 8:
        if (abstract) {
          // gsap.to(abstract.rotation, {
          //   duration: 1 * lastIndex,
          //   z: 0,
          //   y: 0
          // })
          gsap.to(abstract.position, {
            duration: 1 * animationIndex,
            x: 0,
            y: 0,
            z: 0
          })
        }
        gsap.to(logo.children[0].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.rotation, {
          duration: 1 * lastIndex,
          x: -0.1,
          y: -0.1
        })
        gsap.to(logo.position, {
          duration: 1 * lastIndex,
          x: 0,
          y: 0,
          z: 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -40,
          y: 0,
          z: 90
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        break
      case 9:
        // gsap.to(abstract.rotation, {
        //   duration: 1 * animationIndex,
        //   z: 1,
        //   y: 1
        // })
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
          intensity: themeMode === 'dark' ? 0.6 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 0.6 : 0.8
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 0.6 : 0.8
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -20,
          y: 2.4,
          z: 29
        })
        break
      case 10:
        // alert(10)
        if (abstract) {
          // gsap.to(abstract.rotation, {
          //   duration: 1 * lastIndex,
          //   z: 0,
          //   y: 0
          // })
          gsap.to(abstract.position, {
            duration: 1 * animationIndex,
            x: 0,
            y: 0,
            z: 0
          })
          gsap.to(abstract.rotation, {
            duration: 10000,
            x: 100,
            z: 200,
            y: 150
          })
        }
        if (logo) {
          gsap.to(logo.children[0].material, {
            duration: 0.5 * lastIndex,
            opacity: 1
          })
          gsap.to(logo.children[1].material, {
            duration: 0.5 * lastIndex,
            opacity: 1
          })
          gsap.to(logo.rotation, {
            duration: 1 * lastIndex,
            x: -0.1,
            y: -0.1
          })
          gsap.to(logo.position, {
            duration: 1 * lastIndex,
            x: 0,
            y: 0,
            z: 0
          })
        }
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -30,
          y: 0,
          z: 80
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        break
      case 11:
        // alert(11)
        // if (abstract) {
        gsap.to(abstract.rotation, {
          duration: 1 * lastIndex,
          z: 0,
          y: 0,
          x: 0
        })
        gsap.to(abstract.position, {
          duration: 1 * animationIndex,
          x: 0,
          y: 0,
          z: 0
        })
        // gsap.to(abstract.rotation, {
        //   duration: 10000,
        //   x: 100,
        //   z: 200,
        //   y: 150
        // })
        console.log('----------------- transateAnimationTo 10 -----------------')
        // }
        gsap.to(logo.children[0].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.children[1].material, {
          duration: 0.5 * lastIndex,
          opacity: 1
        })
        gsap.to(logo.rotation, {
          duration: 1 * lastIndex,
          x: -0.1,
          y: -0.1
        })
        gsap.to(logo.position, {
          duration: 1 * lastIndex,
          x: 0,
          y: 0,
          z: 0
        })
        gsap.to(camera.position, {
          duration: 1 * animationIndex,
          x: -5,
          y: 0,
          z: 80
        })
        gsap.to(blueLight, {
          intensity: themeMode === 'dark' ? 1 : 0.8
        })
        gsap.to(purpleLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        gsap.to(greenLight, {
          intensity: themeMode === 'dark' ? 1 : 0
        })
        break
    }
    lastIndex = animationIndex
  }
}
export const toggleDarkMode = (themeMode) => {
  if (abstract) {
    abstract.material = themeMode === 'dark' ? abstractMaterialDark : abstractMaterial
  }
}

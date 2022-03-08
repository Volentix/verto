import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

export function addPostProcessing (renderer, scene, camera, container, gui) {
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)

  let bloomPassParams = {
    exposure: 1,
    bloomThreshold: 0.3,
    bloomStrength: 0.8,
    bloomRadius: 1
  }
  const bloomPass = new UnrealBloomPass()
  bloomPass.threshold = bloomPassParams.bloomThreshold
  bloomPass.strength = bloomPassParams.bloomStrength
  bloomPass.radius = bloomPassParams.bloomRadius
  renderer.toneMappingExposure = bloomPassParams.exposure

  const fxaaPass = new ShaderPass(FXAAShader)
  const pixelRatio = renderer.getPixelRatio()
  fxaaPass.material.uniforms['resolution'].value.x =
    1 / (container.offsetWidth * pixelRatio)
  fxaaPass.material.uniforms['resolution'].value.y =
    1 / (container.offsetHeight * pixelRatio)
  composer.addPass(renderPass)
  composer.addPass(fxaaPass)
  composer.addPass(bloomPass)

  if (gui) {
    const bloomFolder = gui.addFolder('bloom')

    bloomFolder
      .add(bloomPassParams, 'exposure', 0.1, 2)
      .onChange(function (value) {
        renderer.toneMappingExposure = Math.pow(value, 4.0)
      })

    bloomFolder
      .add(bloomPassParams, 'bloomThreshold', 0.0, 1.0)
      .onChange(function (value) {
        bloomPass.threshold = Number(value)
      })
      .step(0.1)

    bloomFolder
      .add(bloomPassParams, 'bloomStrength', 0.0, 3.0)
      .onChange(function (value) {
        bloomPass.strength = Number(value)
      })

    bloomFolder
      .add(bloomPassParams, 'bloomRadius', 0.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        bloomPass.radius = Number(value)
      })
    bloomFolder.open()
  }

  return composer
}

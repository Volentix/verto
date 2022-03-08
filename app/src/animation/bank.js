/* eslint-disable */
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import px from "./textures/bank/px2.png";
import nx from "./textures/bank/nx2.png";
import py from "./textures/bank/py2.png";
import ny from "./textures/bank/ny2.png";
import pz from "./textures/bank/pz2.png";
import nz from "./textures/bank/nz2.png";
import coin from './textures/coin.png';
import bankLightImg from './textures/bank_lighting.png';
import staiderBoxLightImg from './textures/staider_box_lighting.png';
import roll01LightImg from './textures/Roll01_lighting.png';
import roll02LightImg from './textures/Roll02_lighting.png';
import investorsLightImg from './textures/investors_lighting.png';
import bankFbx from "./model/bank2.fbx";


let mixer;
let canvas
let scene
let frustumSize = 130;
let aspect
let camera
let wire
let deposit

export default function init (themeMode) {
  canvas = document.getElementById("method1");
  scene = new THREE.Scene();
  // aspect = window.innerWidth / window.innerHeight;
  aspect = canvas.width / canvas.height;
  camera  = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0,
    1000
  );
  camera.position.set(50, 30, 100)
  camera.rotation.set(-0.3, .4, .1)
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas
  });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // ------------------------------------
  const envmap2 = new THREE.CubeTextureLoader().load([px, nx, py, ny, pz, nz]);
  const light = new THREE.HemisphereLight(0xff00ff, 0x080820, .6);
  light.position.set(1, 1, 5);

  const loader = new FBXLoader();

  const metalBaseMaterialParams = {
    color: 0xffe25d,
    metalness: 1,
    roughness: 0,
    envMapIntensity: 1,
    envMap: envmap2,
    transparent: true,
  };

  const coinTexture = new THREE.TextureLoader().load(coin);
  const bankLightMap = new THREE.TextureLoader().load(bankLightImg);
  const staiderBoxLightMap = new THREE.TextureLoader().load(staiderBoxLightImg);
  const roll01LightMap = new THREE.TextureLoader().load(roll01LightImg);
  const roll02LightMap = new THREE.TextureLoader().load(roll02LightImg);
  const investorsLightMap = new THREE.TextureLoader().load(investorsLightImg);

  loader.load(
    bankFbx,
    (fbx) => {
      fbx.position.x = -30;
      fbx.position.y = -30;
      const [
        bank,
        bank_coin,
        investors,
        staider_box,
        wi,
        de,
        bank_portal,
        staider_portal,
        ...rest
      ] = fbx.children;
      wire = fbx.children[4];
      deposit = fbx.children[5];
      const roll02 = rest.pop();
      const roll01 = rest.pop();
      const logo = rest.pop();
      const sif_coins = rest;

      const portal_material = new THREE.MeshPhysicalMaterial({
        emissive: 0x00ffff,
        emissiveIntensity: 1,
        roughness: 1,
      });
      const isLight = themeMode === 'light' ? true : false
      let txtMaterial = isLight ? {
        color: 0x000000,
        metalness: 1,
        roughness: 1
      } : {
        emissive: 0xFFFFFF
      };
      const text_material = new THREE.MeshPhysicalMaterial(txtMaterial);


      const lightMapBaseMaterial = {
        color: 0x888888,
        roughness: 1,
        reflectivity: 0,
        metalness: 0,
        lightMapIntensity: 1.5
      }

      bank.material = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: bankLightMap});
      staider_box.material = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: staiderBoxLightMap});
      investors.material = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: investorsLightMap, lightMapIntensity: 2});
      roll01.material[0] = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: roll01LightMap});
      roll01.material[1] = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: roll01LightMap, color: 0x555555});
      roll02.material[0] = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: roll02LightMap});
      roll02.material[1] = new THREE.MeshPhysicalMaterial({...lightMapBaseMaterial, lightMap: roll01LightMap, color: 0x555555});




      bank_coin.material = new THREE.MeshPhysicalMaterial(
        metalBaseMaterialParams
      );
      logo.material[0] = new THREE.MeshPhysicalMaterial(
        metalBaseMaterialParams
      );
      logo.material[1] = new THREE.MeshPhysicalMaterial(
        {...metalBaseMaterialParams, color: 0xffffff}
      );

      const sif_coin_material = new THREE.MeshPhysicalMaterial({
        ...metalBaseMaterialParams,
        map: coinTexture,
        envMapIntensity: 10,
      });
      sif_coins.forEach((coin) => {
        coin.material = sif_coin_material;
      });

      bank_portal.material = portal_material;
      staider_portal.material = portal_material;

      wire.material = text_material;
      deposit.material = text_material;

      scene.add(fbx);
      mixer = new THREE.AnimationMixer(fbx);
      fbx.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      animate();
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      // console.log('xhr', xhr)
    },
    (error) => {
      console.log(error);
    }
  );
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const smaaPass = new SMAAPass(
    canvas.width * renderer.getPixelRatio(),
    canvas.height * renderer.getPixelRatio()
  );
  composer.addPass(renderPass);
  composer.addPass(smaaPass);


  window.addEventListener("resize", onWindowResize);

  function onWindowResize() {
    var aspect = canvas.height / canvas.width;

    camera.left = frustumSize / -2;
    camera.right = frustumSize / 2;
    camera.top = (frustumSize * aspect) / 2;
    camera.bottom = (-frustumSize * aspect) / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    composer.render();
    // renderer.render(scene, camera);
  }
}
export const toggleDarkModeBank = (themeMode) => {
  const isLight = themeMode === 'light' ? true : false
  const materialParams = isLight ? {
    color: 0x000000,
    metalness: 1,
    roughness: 1
  } : {
    emissive: 0xFFFFFF
  };
  wire.material = new THREE.MeshPhysicalMaterial(materialParams);
  deposit.material = new THREE.MeshPhysicalMaterial(materialParams);
}

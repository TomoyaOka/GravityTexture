import { ShaderMaterial,PlaneGeometry,Mesh ,TextureLoader,Vector2,Vector3,Raycaster, BoxGeometry,MeshNormalMaterial} from "three";
import vertexShader from "../shader/vertex.glsl?raw";
import fragmentShader from "../shader/fragment.glsl?raw";

import { gsap,Power4 } from "gsap";

export default class Model {
  constructor(stage) {
    this.stage = stage;
    this.geometry;
    this.material;
    this.mesh;
    this.loader = new TextureLoader();
    this.raycaster = new Raycaster();
    this.mouse = new Vector2()

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.size;

  }

  _init() {
    this.createMesh();
    this._ray();
  
  }

  createMesh() {
    let x,y;
    let size;
    if(this.width < 768) {
      x = 1;
      y = 1.7;

      size = 0.8;
    } else {
      x = 1.7;
      y = 1;

      size = 2.0;
    }


    this.size ={
      x:x,
      y:y
    }

    const texture = this.loader.load("./img01.jpg");
    const noise = this.loader.load("./noise.jpeg");

    const uniforms = {
      uResolution: {
        value: new Vector2(this.width,this.height),
      },
      uImageResolution: {
        value: new Vector2(2048, 1356),
      },
      uTexture: {
        value: texture,
      },
      disp: {
        value: noise,
      },
      uProgress:{
        value:0.6
      },
      uSize:{
        value:size
      },
      uMouse:{
        value:new Vector3()
      },
      uTime:{
        value:0.0
      }
    }
    
    this.geometry = new PlaneGeometry(this.size.x,this.size.y);
    this.material = new ShaderMaterial({
      uniforms:uniforms,
      vertexShader: vertexShader,
      fragmentShader:fragmentShader
    });
    this.mesh = new Mesh(this.geometry,this.material);
    this.stage.scene.add(this.mesh);

    console.log(this.mesh.geometry.parameters)

    let mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", ()=>{
      window.location.reload(true);
    });
  }


  _ray (){    
    const canvas = document.querySelector('#canvas canvas');
    canvas.addEventListener('mousemove',(e)=>{
    
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  
      this.raycaster.setFromCamera(this.mouse,this.stage.camera);
      let intersects = this.raycaster.intersectObjects(this.stage.scene.children);    
      
      if(intersects.length > 0) {
        this.mesh.material.uniforms.uMouse.value = intersects[0].point;
      }
    });
  }

  onLoop() {
    this.mesh.material.uniforms.uTime.value += 0.01;
  }


  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mesh.material.uniforms.uResolution.value.set(this.width,this.height);
  }
}
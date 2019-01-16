<template>
  <div
    id="viewer"
    style="height:100vh; position: absolute; top: 0; left:0; right: 0; bottom: 0;"
  ></div>
</template>

<script as="ts">

  import * as Three from "three";
  import {buildRoom, createCube, drawLine, loadOBJ, setUpLights} from "./ViewerService";

  var OrbitControls = require("three-orbit-controls")(Three);


  export default {
    name: "Viewer",
    data() {
      return {
        camera: null,
        scene: null,
        renderer: null,
        controls: null,
        mesh: null,
        cube: null,
        raycaster: null,
        mouse: null,
        objects: [],
        rollOver: null,
        line: null
      };
    },
    mounted() {
      this.init();
      this.animate();
    },
    methods: {
      init: function () {
        let container = document.getElementById("viewer");

        this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);

        this.scene = new Three.Scene();
        this.scene.background = new Three.Color(0xf0f0f0);

        this.line = drawLine();
        this.scene.add(this.line);

        const cube = createCube();
        cube.name = "cube";
        cube.position.x = 200;

        this.scene.add(cube);
        this.objects.push(cube);

        this.scene.add(buildRoom());

        loadOBJ().then((o) => {
          o.scale.set(5, 5, 5);

          const colors = o.children[0].geometry.getAttribute("position").array.map(() => Math.random() * 255);

          o.children[0].material.vertexColors = Three.VertexColors;
          o.children[0].geometry.addAttribute("color", new Three.BufferAttribute(new Uint8Array(colors), 3, true));

          this.scene.add(o);
          this.objects.push(...o.children);
        });


        var raycaster = new Three.Raycaster();
        var mouse = new Three.Vector2();

        document.addEventListener("click", onDocumentMouseDown.bind(this), false);

        function onDocumentMouseDown(event) {
          event.preventDefault();

          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(mouse, this.camera);

          var intersects = raycaster.intersectObjects(this.objects);

          if (intersects.length > 0) {
            this.line.position = intersects[0].point;
          }

        }

        this.scene.add(setUpLights());

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1000;
        this.controls.maxDistance = 5;
        this.controls.maxPolarAngle = Math.PI / 2;

        container.appendChild(this.renderer.domElement);
      },

      animate: function () {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      }
    },
  };

</script>

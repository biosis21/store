import * as Three from "three";

const OBJLoader = require("three-obj-loader");
OBJLoader(Three);

export const createCube = ({x, y, z} = {x: 60, y: 60, z: 60}) => {
  const geometry = new Three.BoxBufferGeometry(x, y, z);
  const material = new Three.MeshBasicMaterial({vertexColors: Three.VertexColors});

  return new Three.Mesh(geometry, material);
};

export const drawLine = () => {
  const geometry = new Three.Geometry();
  geometry.vertices.push(new Three.Vector3(0, 0, 0));
  geometry.vertices.push(new Three.Vector3(200, 200, 0));

  const material = new Three.LineBasicMaterial({color: 0x0000ff, linewidth: 5});
  return new Three.Line(geometry, material);
};

export const createWall = () => {
  const geometry = new Three.PlaneBufferGeometry(1, 1, 0, 0);
  const material = new Three.MeshBasicMaterial({color: 0xffffff, wireframe: true});
  return new Three.Mesh(geometry, material);
};

export const setUpLights = () => {
  const lights = new Three.Group();

  const ambientLight = new Three.AmbientLight(0x555555);
  lights.add(ambientLight);

  const directionalLight = new Three.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  lights.add(directionalLight);

  return lights;
};

export const move = (obj) => {
  const xSpeed = 0.0001;
  const ySpeed = 0.0001;

  document.addEventListener("keydown", onDocumentKeyDown, false);

  function onDocumentKeyDown(e) {
    e.preventDefault();
    const keyCode = e.which;
    if (keyCode === 87) {
      obj.position.y += ySpeed;
    } else if (keyCode === 83) {
      obj.position.y -= ySpeed;
    } else if (keyCode === 65) {
      obj.position.x -= xSpeed;
    } else if (keyCode === 68) {
      obj.position.x += xSpeed;
    } else if (keyCode === 32) {
      obj.position.set(0, 0, 0);
    }
  }
};

export const buildRoom = (width = 1000, height = 500, depth = 800) => {
  const group = new Three.Group();

  // const floor = createWall();
  // floor.name = "floor";
  // floor.scale.y = depth;
  // floor.scale.y = depth;
  // floor.scale.x = width;
  // floor.rotateX(-Math.PI / 2);

  const gridHelper = new Three.GridHelper(width, 20);
  group.add(gridHelper);

  const rightWall = createWall();
  rightWall.name = "right-wall";
  rightWall.position.x = width / 2;
  rightWall.position.y = height / 2;
  rightWall.scale.x = depth;
  rightWall.scale.y = height;
  rightWall.rotateY(-Math.PI / 2);
  group.add(rightWall);

  const leftWall = createWall();
  leftWall.name = "left-wall";
  leftWall.position.x = -width / 2;
  leftWall.position.y = height / 2;
  leftWall.scale.x = depth;
  leftWall.scale.y = height;
  leftWall.rotateY(-Math.PI / 2);
  group.add(leftWall);

  const backWall = createWall();
  backWall.name = "back-wall";
  backWall.position.z = -depth / 2;
  backWall.position.y = height / 2;
  backWall.scale.x = width;
  backWall.scale.y = height;
  group.add(backWall);

  return group;
};


export const loadOBJ = async () => {
  var loader = new Three.OBJLoader();

  return await new Promise((resolve, reject) => {
    loader.load(
      "/tshirts.obj",
      resolve,
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
        reject(error);
      }
    );
  });
};

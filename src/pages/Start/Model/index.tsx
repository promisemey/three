import city from '@/assets/model/city.glb';
import duck from '@/assets/model/Duck.glb';
import hdr from '@/assets/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr';
import watercover from '@/assets/texture/watercover/CityNewYork002_COL_VAR1_1K.png';
import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { Scene } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';

// 颜色
const sphereColor = [0x112233, 0x445566, 0x889900];

// 坐标线
const Fog: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [rendererInstance, setRendererInstance] =
    useState<Three.WebGLRenderer | null>(null);

  const [cameraInstance, setCameraInstance] =
    useState<Three.PerspectiveCamera | null>(null);

  const [sceneInstance, setSceneInstance] = useState<Three.Scene | null>(null);

  const [container, setContainer] = useState({
    width: 0,
    height: 0,
  });

  // 初始化
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const width = (rect?.width || 0) + 80 || 500;
    const height = rect?.height || 500;
    // 创建场景
    const scene = new Scene();

    // 创建相机
    // fov 视野角度
    // aspect ratio 长宽比
    // near  far
    const camera = new Three.PerspectiveCamera(45, width / height, 0.1, 1000);

    // 渲染器
    const renderer = new Three.WebGLRenderer();

    renderer?.setSize(width, height);

    // 创建纹理加载器
    const textureLoader = new Three.TextureLoader();
    const watercoverTexture = textureLoader.load(watercover);
    // 色彩空间
    watercoverTexture.colorSpace = Three.SRGBColorSpace;

    // 加载城市模型
    // 实例化
    const gltfLoader = new GLTFLoader();

    // 加载环境贴图
    const rgbeLoader = new RGBELoader();

    rgbeLoader.load(hdr, (envMap) => {
      //
      envMap.mapping = Three.EquirectangularReflectionMapping;
      //
      scene.environment = envMap;
    });

    // 加载鸭子模型
    gltfLoader.load(duck, (glb) => {
      // scene.environment = Three.EquirectangularReflectionMapping;
      scene.add(glb.scene);
    });

    // 加载解码器
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(city, (glb) => {
      console.log(glb);
      scene.add(glb.scene);
    });

    // 相机向外移动
    camera.position.set(0, 0, 20);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    // 设置阻尼
    // 启用
    controls.enableDamping = true;
    // 阻尼强度
    controls.dampingFactor = 0.01;
    // 关闭滚动缩放
    // controls.enableZoom = false;
    controls.enablePan = true;

    function animate() {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.001;
      // cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);

      TWEEN.update();
    }

    animate();
    containerRef.current?.appendChild(renderer.domElement);
    // 渲染

    setContainer({
      width,
      height,
    });
    setRendererInstance(renderer);
    setCameraInstance(camera);
    setSceneInstance(scene);

    const observer = new ResizeObserver((target) => {
      setContainer({
        width: target[0].contentRect.width,
        height: target[0].contentRect.height,
      });
    });

    observer.observe(containerRef.current);

    return () => {
      // window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!sceneInstance || !cameraInstance) return;
    rendererInstance?.setSize(container.width, container.height);
    // rendererInstance?.render(sceneInstance, cameraInstance);
    // 更新画布大小
    cameraInstance.aspect = container.width / container.height;
    cameraInstance.updateProjectionMatrix();
  }, [container]);

  useEffect(() => {
    if (
      !container.width ||
      !container.height ||
      !sceneInstance ||
      !cameraInstance
    )
      return;

    // 创建3个球体
    const sphereItems = sphereColor.map(
      (item) =>
        new Three.Mesh(
          new Three.SphereGeometry(1, 32, 16),
          new Three.MeshBasicMaterial({
            color: item,
          }),
        ),
    );
    sphereItems.forEach((sphere, key) => {
      sphere.position.set((key - 1) * 4, 2, 2);
      sphere.name = key.toString();
      sceneInstance.add(sphere);
    });

    // 创建二维向量
    const vector = new Three.Vector2();

    const handleClick = (ev: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      console.log(ev, rect);
      // 获取容器
      // 创建射线
      const raycaster = new Three.Raycaster();
      // 划分坐标轴
      const x = ((ev.clientX - rect!.left) / container.width) * 2 - 1;
      const y = -((ev.clientY - rect!.top) / container.height) * 2 + 1;

      vector.set(x, y);
      console.log(x, y);
      // 通过相机和鼠标位置更新射线
      raycaster.setFromCamera(vector, cameraInstance);
      // 相交
      const intersects = raycaster.intersectObjects(sphereItems);
      // intersects[0].object.material.color.set(0x0000ff);
      // console.log(intersects);
      // 为点击的物体设置蓝色
      // for (let i = 0; i < intersects.length; i++) {
      //   intersects[i].object.material.color.set(0x0000ff20);
      // }
      intersects.forEach((intersect) => {
        const mesh = intersect.object as Three.Mesh;
        console.log(mesh);
        if (mesh.material instanceof Three.Material) {
          if (mesh.material.select) {
            mesh.material.color.set(mesh.material.originColor);
            mesh.material.select = false;
            return;
          }

          const originColor = (mesh.material.color as Three.Color).getHex();
          mesh.material.originColor = originColor;
          mesh.material.color.set(0x0000ff);
          mesh.material.select = true;
        }
      });
    };

    containerRef.current?.addEventListener('click', handleClick);

    return () => {
      containerRef.current?.removeEventListener('click', handleClick);
    };
  }, [container, sceneInstance, cameraInstance]);

  const onTo = () => {
    const model = sceneInstance?.getObjectByName('1');
    // model?.forEach((item) => {
    const tween = new TWEEN.Tween(model!.position);
    tween.to({ x: 6 }, 1000);
    // tween.repeat(Infinity);
    // tween.yoyo(true);
    const tween2 = new TWEEN.Tween(model!.position);
    tween2.to({ y: 6 }, 1000);

    tween.chain(tween2);

    tween.start();
    // });
  };

  return (
    <PageContainer
      style={{
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 'calc(100vh - 152px)',
          background: 'skyblue',
          overflow: 'hidden',
        }}
        ref={containerRef}
      ></div>
      <Button onClick={onTo}>滚动</Button>
    </PageContainer>
  );
};

export default Fog;

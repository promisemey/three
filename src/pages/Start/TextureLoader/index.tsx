import { PageContainer } from '@ant-design/pro-components';
import watercover from 'public/assets/texture/watercover/CityNewYork002_COL_VAR1_1K.png';
import { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { Scene } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 坐标线

const TextureLoader: React.FC = () => {
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

    // // 加载环境贴图
    // const waterAO = textureLoader.load(watercoverAo);
    // // 透明度贴图
    // const alphaMap = textureLoader.load(alpha);
    // // 光照贴图
    // const lightMap = textureLoader.load(waterLight);
    // // 高光贴图
    // const hightMap = textureLoader.load(waterhight);

    const axesHelper = new Three.AxesHelper(10);

    scene.add(axesHelper);

    // 相机向外移动
    camera.position.set(0, 0, 2);

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

  //

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
    </PageContainer>
  );
};

export default TextureLoader;

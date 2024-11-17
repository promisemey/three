import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { Scene } from 'three';
// 坐标线

const RoughlyPage: React.FC = () => {
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

    // 创建一个几何体
    const geometry = new Three.BoxGeometry(1, 1, 1);
    // 材质
    const material = new Three.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
    });
    // 创建网格
    const cube = new Three.Mesh(geometry, material);

    scene.add(cube);

    // 相机向外移动
    camera.position.set(1, 1, 10);

    containerRef.current?.appendChild(renderer.domElement);

    renderer.render(scene, camera);

    setContainer({
      width,
      height,
    });
    setRendererInstance(renderer);
    setCameraInstance(camera);
    setSceneInstance(scene);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const onResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect?.width || rect?.height)
        setContainer({
          width: rect?.width,
          height: rect?.height,
        });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (!sceneInstance || !cameraInstance) return;
    rendererInstance?.setSize(container.width, container.height);
    rendererInstance?.render(sceneInstance, cameraInstance);
  }, [container]);

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

export default RoughlyPage;

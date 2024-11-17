import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { Scene } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 坐标线

const BufferGeometry: React.FC = () => {
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

    // 创建一个几何体
    const geometry = new Three.BufferGeometry();
    // 创建定点数据  逆时针正面
    const vertices = new Float32Array([
      -1.0, -1.0, 1.0,

      1.0, -1.0, 1.0,

      1.0, 1.0, 1.0,

      // 1.0, 1.0, 1.0,

      -1.0, 1.0, 1.0,

      // -1.0, -1.0, 1.0,
    ]);
    geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3));

    // 创建索引数据
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    geometry.setIndex(new Three.BufferAttribute(indices, 1));

    // 设置两个顶点组
    geometry.addGroup(0, 3, 0);
    geometry.addGroup(3, 3, 1);
    // 创建材质
    const materialT = new Three.MeshBasicMaterial({
      color: 0xff0000,
    });

    const material = new Three.MeshBasicMaterial({
      color: 0x0000ff80,
      // wireframe: true,
    });

    console.log(geometry);

    const cube = new Three.Mesh(geometry, [material, materialT]);

    const axesHelper = new Three.AxesHelper(10);

    scene.add(axesHelper);
    scene.add(cube);

    // 相机向外移动
    camera.position.set(0, 0, 10);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    // 设置阻尼
    // 启用
    controls.enableDamping = true;
    // 阻尼强度
    controls.dampingFactor = 0.01;
    // 关闭滚动缩放
    controls.enableZoom = false;
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

  // loader

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

export default BufferGeometry;
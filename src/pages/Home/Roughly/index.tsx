import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';
import * as Three from 'three';
// 坐标线

const RoughlyPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    // 创建场景
    const scene = new Three.Scene();

    // 添加坐标系
    const axesHelper = new Three.AxesHelper(5);
    scene.add(axesHelper);

    // 创建相机
    const camera = new Three.PerspectiveCamera(
      45,
      width / height, // 宽高比
      0.1, // 近平面
      1000, // 远平面
    );

    // 设置相机位置
    camera.position.set(
      1, // x
      5, // y
      5,
    );
    camera.lookAt(0, 0, 0);

    // 创建球体
    const geometry = new Three.BoxGeometry(
      1, // 半径
      1, // 宽度
      1, // 高度
    );

    // 材质
    const material = new Three.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    // 创建网格
    const cube = new Three.Mesh(geometry, material);

    scene.add(cube);

    cube.rotation.x += 0.1;

    // 创建渲染器
    const renderer = new Three.WebGLRenderer();
    renderer.setSize(
      width,
      height, // 宽高比
    );
    // 添加到DOM
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 渲染
    renderer.render(scene, camera);

    const animate = () => {
      cube.rotation.x += 0.1;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <PageContainer>
      <div
        style={{
          width: '1100px',
          height: '550px',
          background: 'skyblue',
          overflow: 'hidden',
        }}
        ref={containerRef}
      ></div>
    </PageContainer>
  );
};

export default RoughlyPage;

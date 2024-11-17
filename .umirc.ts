import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '入门',
      path: '/home',
      component: '@/layouts/index',
      routes: [
        {
          name: '快速上手',
          path: '/home/roughly',
          component: '@/pages/Home/Roughly',
        },
      ],
    },
    {
      name: '开发入门与调试',
      path: '/start',
      component: '@/layouts/index',
      routes: [
        {
          name: '基础页面',
          path: '/start/debug',
          component: '@/pages/Start/Debug',
        },
        {
          name: '旋转',
          path: '/start/rotate',
          component: '@/pages/Start/Rotate',
        },
        {
          name: '几何体_顶点_索引_面之BufferGeometry',
          path: '/start/buffergeometry',
          component: '@/pages/Start/BufferGeometry',
        },
        {
          name: '纹理加载',
          path: '/start/textureloader',
          component: '@/pages/Start/TextureLoader',
        },
        {
          name: '雾霾',
          path: '/start/fog',
          component: '@/pages/Start/Fog',
        },
        {
          name: '加载模型',
          path: '/start/model',
          component: '@/pages/Start/Model',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});

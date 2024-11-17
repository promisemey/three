import '@umijs/max/typings';

declare module '*.png' {
  const value: string;
  export default value;
}

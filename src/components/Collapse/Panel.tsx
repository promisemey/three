/*
 * @Date: 2023-08-21 13:40:50
 * @Auth: 463997479@qq.com
 * @LastEditors: 463997479@qq.com
 * @LastEditTime: 2023-08-22 17:04:21
 * @FilePath: \reactui\src\Collapse\Panel.tsx
 */
import { RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
type PanelType = {
  children?: any;
  title?: string;
  activeKey: string | number;
  active?: string | string[];
  handleActive?: (arg: string | number) => void;
  extra?: React.ReactNode;
};

const Panel: React.FC<PanelType> = (props) => {
  const { children, title, activeKey, active, handleActive, extra } = props;
  const [onlyKey, setOnlyKey] = useState<string | number>(activeKey);
  const [show, setShow] = useState<boolean>(false);
  const [domShow, setDomShow] = useState<boolean>(false);

  useEffect(() => {
    let flag =
      active === onlyKey ||
      ((Array.isArray(active) && active?.indexOf(onlyKey) > -1) as boolean);
    setOnlyKey(activeKey);
    setShow(flag);
  }, [activeKey, active, domShow]);
  const contentRef = useRef();
  const contentClass = classNames('panel-content-item', {
    ['panel-content-item-active']: domShow,
  });
  const wrapperClass = classNames('panel-content-item-wrapper', {
    ['panel-content-item-wrapper-active']: domShow,
  });
  const onEnter = (el: HTMLElement) => {
    el.style.height = '0px';
    el.style.overflow = 'hidden';
    setDomShow(true);
  };

  const onEntering = (el: HTMLElement) => {
    el.style.height = el.scrollHeight + 'px';
  };

  const onEntered = (el: HTMLElement) => {
    el.style.transition = '';
    el.style.height = '';
  };

  const onExit = (el: HTMLElement) => {
    el.style.overflow = 'hidden';
    el.style.height = el.scrollHeight + 'px';
  };

  const onExiting = (el: HTMLElement) => {
    if (el.scrollHeight !== 0) {
      el.style.height = '0';
    }
  };
  // 为什么要加el.scrollHeight !== 0的判断呢？
  //试一下，如果不加这个判断，直接变化height,paddingTop,paddingBottom的值到0，这个时候，收缩时并不会有过渡动画，元素马上就消失了。

  //setTimeout(() => {el.style.height = 0;el.style.paddingTop = 0;el.style.paddingBottom = 0;}, 20)
  const onExited = (el: HTMLElement) => {
    el.style.transition = '';
    el.style.height = '';
    setDomShow(false);
  };
  return (
    <>
      <div className={contentClass}>
        <div
          onClick={() => {
            handleActive?.(onlyKey);
          }}
          className="collapse-header"
        >
          <span className="collapse-header-img">
            <RightOutlined />
          </span>
          <span className="collapse-header-title">{title}</span>
          <span>{extra}</span>
        </div>
        <CSSTransition
          in={show}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={onEntered}
          onExit={onExit}
          onExiting={onExiting}
          onExited={onExited}
          classNames={'collapse'}
          timeout={200}
        >
          <div ref={contentRef}>
            <div className={wrapperClass}>{children}</div>
          </div>
        </CSSTransition>
      </div>
    </>
  );
};
export default Panel;

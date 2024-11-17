import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const CollapseContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f7f7f7;
  cursor: pointer;
`;

const ContentWrapper = styled.div<{ contentHeight: number | null }>`
  overflow: hidden;

  /* transition class names from CSSTransition */
  &.collapse-enter {
    height: 0;
  }
  &.collapse-enter-active {
    height: ${({ contentHeight }) =>
      contentHeight !== null ? `${contentHeight}px` : 'auto'};
    transition: height 300ms ease-in;
  }
  &.collapse-enter-done {
    height: auto; /* 动画结束后设置为自动高度，以便支持动态内容 */
  }
  &.collapse-exit {
    height: ${({ contentHeight }) =>
      contentHeight !== null ? `${contentHeight}px` : 'auto'};
  }
  &.collapse-exit-active {
    height: 0;
    transition: height 300ms ease-in;
  }
`;

const Button = styled.button`
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Collapse = ({ title, children, isOpenDefault = false }: any) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [contentHeight, setContentHeight] = useState<number | null>(null); // 初始为 null
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  // 在进入时测量内容的高度
  const onEnter = () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  };

  // 动画结束后重置高度，以支持动态内容
  const onEntered = () => {
    setContentHeight(null); // 动画结束后设置高度为 null，使高度自适应内容变化
  };

  // 在退出时保留当前高度，避免动画跳跃
  const onExit = () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  };

  return (
    <CollapseContainer>
      <Header onClick={toggleCollapse}>
        <h2>{title}</h2>
        <Button>{isOpen ? '-' : '+'}</Button>
      </Header>

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="collapse"
        unmountOnExit
        onEnter={onEnter}
        onEntered={onEntered} // 动画结束时重置高度
        onExit={onExit}
      >
        <ContentWrapper contentHeight={contentHeight}>
          <div ref={contentRef}>{children}</div>
        </ContentWrapper>
      </CSSTransition>
    </CollapseContainer>
  );
};

export default Collapse;

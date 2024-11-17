import React from 'react';
import { SketchPicker } from 'react-color';

interface Props {
  color?: string; // 默认颜色值
  onChange?: (newColor: string) => void; // 当颜色改变时调用的回调函数
}

interface State {
  displayColorPicker: boolean; // 控制颜色选择器是否显示
  color: string; // 当前选中的颜色
}

class ColorPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayColorPicker: true,
      color: props.color || '#6A8F2E00',
    };
  }

  handleClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({ displayColorPicker: !displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = ({ hex }: { hex: string }) => {
    const { onChange } = this.props;
    this.setState({ color: hex });
    onChange?.(hex);
  };

  render() {
    const { displayColorPicker, color } = this.state;

    return (
      <div>
        <div
          style={{
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          }}
          onClick={this.handleClick}
        >
          <div
            style={{
              width: '36px',
              height: '14px',
              borderRadius: '2px',
              background: color,
            }}
          />
        </div>
        {displayColorPicker ? (
          <div
            style={{
              position: 'absolute',
              zIndex: '2',
            }}
          >
            <div
              style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              }}
              onClick={this.handleClose}
            />
            <SketchPicker
              styles={{}}
              color={color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorPicker;

import React, { Component } from 'react';
import SpinInjector from './SpinInjector';

class SpinContainer extends Component {
  render() {
    let {isSpinShow} = this.state;
    let {style, className} = this.props;
    let boxStyle = style ? style : {paddingTop:0,backgroundColor:'#f1f1f1',opacity:0.6,zIndex:100000};
    let classNames = className ? 'loading-box ' +className : 'loading-box';

    if(isSpinShow){
      return (
        <div className={classNames} style={boxStyle}>
          <p>
            처리중입니다.<br />
            잠시만 기다려 주세요.<br />
            <img src="https://s.wink.co.kr/app/parents/images/img_loading.png" alt="" className="loading" />
          </p>
        </div>
      );
    }
    else{
      return null;
    }
    
  }
}

export default SpinInjector(SpinContainer);
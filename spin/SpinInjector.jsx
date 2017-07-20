
export default function SpinInjector(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    constructor(props){
      super(props);

      this.netWorkCustomEventListener = this.netWorkCustomEventListener.bind(this);
      this.onRequest = this.onRequest.bind(this);
      this.onResponse = this.onResponse.bind(this);
      this.onReqError = this.onReqError.bind(this);
      this.onResError = this.onResError.bind(this);

      this.showSpinSetTimeout = this.showSpinSetTimeout.bind(this);
      this.showSpinClearTimeout = this.showSpinClearTimeout.bind(this);
      this.hideSpinSetTimeout = this.hideSpinSetTimeout.bind(this);
      this.hideSpinClearTimeout = this.hideSpinClearTimeout.bind(this);
      this.forceHideSpinTimeout = this.forceHideSpinTimeout.bind(this);
      this.forceHideSpinClear = this.forceHideSpinClear.bind(this);
      this.reset = this.reset.bind(this);
      this.remote = this.remote.bind(this);
      this.setSpin = this.setSpin.bind(this);
      this.spinControl = this.spinControl.bind(this);
      this.option = this.option.bind(this);
      this.forceShow = this.forceShow.bind(this);
      this.foreceHide = this.foreceHide.bind(this);
      this.timerReset = this.timerReset.bind(this);
      this.sleep = this.sleep.bind(this);

      this.state = {
        isSpinShow:false
      }
      
      window.addEventListener('spin_control',this.spinControl);
      window.addEventListener('network_event',this.netWorkCustomEventListener);
    }

    delay = 100;
    forceHideTime = 5000;
    
    isOperate = true;
    reqResCount = 0;
    showSpinTimer = null;
    hideSpinTimer = null;
    forceHideTimer = null;
    reqCount = 0;
    resCount = 0;

    componentWillUnmount() {
      window.removeEventListener('network_event',this.netWorkCustomEventListener);
      this.reset();
    }

    spinControl(e){
      switch (e.detail.type) {
        case 'option':
          this.option(e.detail.payload.option);
          break;
        case 'forceShow':
          //스핀을 보여주고 forceHideTime 동안 모든 요청을 무시
          this.forceShow(e.detail.payload.time);
          break;
        case 'foreceHide':
          //스핀을 숨기고 forceHideTime 동안 모든 요청을 무시
          this.foreceHide(e.detail.payload.time);
          break;
        case 'reset':
          this.reset();
          break;
        case 'sleep':
          this.sleep(e.detail.payload.time)
          break;
        default:
          break;
      }
    }

    forceShow(time){
      let showSpin = true;
      this.timerReset();
      
      this.setSpin(showSpin);
      this.sleep(time);
      setTimeout(()=>{
        showSpin = false;
        this.setSpin(showSpin);
      }, time);
    }
    
    foreceHide(time){
      let showSpin = false;
      this.timerReset();
      this.setSpin(showSpin);
      this.sleep(time);
    }

    sleep(time){
      let sleepTime = time ? time :this.forceHideTime ;
      this.isOperate = false;
      setTimeout(()=>{
        this.isOperate = true;
      }, sleepTime)
    }
    
    netWorkCustomEventListener(e){
      switch (e.detail.type) {
        case 'req':
          this.onRequest();
          break;
        case 'res':
          this.onResponse();
          break;
        case 'reqError':
          this.onReqError();
          break;
        case 'resError':
          this.onResError();
          break;
        default:
          break;
      }
    }
    
    onRequest(){
      if(!this.isOperate){
        return;
      }
      this.reqResCount++;
      this.showSpinSetTimeout();
      this.hideSpinClearTimeout();
    }

    onResponse(){
      if(!this.isOperate){
        return ;
      }
      this.reqResCount--;
      if(0 > this.reqResCount){
        this.reqResCount=0;
      }

      if(0 === this.reqResCount){
        this.showSpinClearTimeout();
        this.hideSpinSetTimeout();
      }
    }
    
    onReqError(){
      this.reqResCount--;
      if(0 > this.reqResCount){
        this.reqResCount = 0;
      }

      if(0 === this.reqResCount){
        this.showSpinClearTimeout();
        this.hideSpinSetTimeout();
      }
    }
    onResError(){
      this.reqResCount--;
      if(0 > this.reqResCount){
        this.reqResCount = 0;
      }

      if(0 === this.reqResCount){
        this.showSpinClearTimeout();
        this.hideSpinSetTimeout();
      }
    }


    showSpinSetTimeout(){
      if(this.showSpinTimer){
        this.showSpinClearTimeout();
      }
      this.showSpinTimer = setTimeout(()=>{
        this.setSpin(true);
        this.forceHideSpinTimeout();
      }, this.delay);
    }

    showSpinClearTimeout(){
      if(this.showSpinTimer){
        clearTimeout(this.showSpinTimer);
        this.showSpinTimer = null;
      }
    }

    hideSpinSetTimeout(){
      if(this.hideSpinTimer){
        this.hideSpinClearTimeout();
      }
      this.hideSpinTimer = setTimeout(()=>{
        this.setSpin(false);
        this.forceHideSpinClear();
      }, this.delay);
    }

    hideSpinClearTimeout(){
      if(this.hideSpinTimer){
        clearTimeout(this.hideSpinTimer);
        this.hideSpinTimer = null;
      }
    }
    
    forceHideSpinTimeout(){
      if(this.forceHideTimer){
        this.forceHideSpinClear();
      }
      this.forceHideTimer = setTimeout(()=>{
        this.setSpin(false);
      }, this.forceHideTime);
    }

    forceHideSpinClear(){
      if(this.forceHideTimer){
        clearTimeout(this.forceHideTimer);
        this.forceHideTimer = null;
      }
    }

    reset(){
      this.isOperate = true;
      this.reqResCount = 0;
      this.timerReset();
      let spinShow = false; 
      this.setSpin(spinShow);
    }

    timerReset(){
      if(this.showSpinTimer){
        this.showSpinClearTimeout();
      }
      if(this.hideSpinTimer){
        this.hideSpinClearTimeout();
      }
      if(this.forceHideTimer){
        this.forceHideSpinClear();
      }
    }

    setSpin(value){
      this.setState({
        isSpinShow:value
      })
    }

    remote(mode){
      if('start' === mode){
        if(!this.isOperate){
          this.reset();
        }
      }
      else if('stop' === mode){
        if(this.isOperate){
          this.reset();
          this.isOperate = false;
        }
      }
    }

    option(setting){
      if('object' !== typeof setting || !setting){
        return ;
      }
      Object.keys(setting).forEach((item, index)=>{
        if(this.hasOwnProperty(item)){
          this[item] = setting[item];
        }
      })
    }
    render() {
      return super.render()
    }
  }
}
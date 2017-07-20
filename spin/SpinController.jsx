export default class SpinController {
  static networkCustomEvent(type){
    let event = new CustomEvent('network_event', {
      detail: {type:type}
    });
    window.dispatchEvent(event);
  }

  static spinControlCustomEvent(type, data){
    let payload = data ? data : {}
    let event = new CustomEvent('spin_control', {
      detail: {type:type, payload:payload}
    });
    window.dispatchEvent(event);
  }
  //before request
  static request(req){
    SpinController.networkCustomEvent('req');
    return req;
  }

  static requestError(err){
    SpinController.networkCustomEvent('reqError');
    return Promise.reject(err);
  }
  //after response
  static response(res){
    SpinController.networkCustomEvent('res');  
    return res;
  }

  static responseError(err){
    SpinController.networkCustomEvent('resError');
    return Promise.reject(err);
  }
  
  static option(data){
    if('object' !== typeof data){
      return;
    }
    let payload = {option:data};
    let type = 'option';
    SpinController.spinControlCustomEvent(type, payload);
  }

  //time ms
  static forceShow(time){
    let type = 'forceShow';
    time = time ? time : 0;
    if(0 > time){ return ;}

    let payload = {time:time};
    SpinController.spinControlCustomEvent(type, payload);
  }
  //time ms
  static foreceHide(time){
    let type = 'foreceHide';
    time = time ? time : 0;
    
    let payload = {time:time};
    SpinController.spinControlCustomEvent(type, payload);
  }

  static reset(){
    let type = 'reset';
    SpinController.spinControlCustomEvent(type);
  }

  static sleep(time){
    time = time ? time : 0;
    if(0 > time){ return ;}

    let payload = {time:time};
    let type = 'sleep';
    SpinController.spinControlCustomEvent(type, payload);
  }
}

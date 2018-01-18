import Schedule from './components/schedule';

const componentPrefix = 'Cw';

const components = {
  // 日程组件
  Schedule
};

const install = function(Vue, options = {}) {
  var prefix = options.componentPrefix || componentPrefix;
  Object.keys(components).forEach(key => {
    Vue.component(prefix + key, components[key]);
  });
};

let componentArray = {};

Object.keys(components).forEach(key => {
  componentArray[componentPrefix + key] = components[key];
});

export default {
  install,
  ...componentArray
};

// components/navi-tab/index.js
import {getParents, getParentBehavior} from '../../utils/realtion'

Component({
  /**
   * 组件的行为
   */
  behaviors: [getParentBehavior('navi-tabs')],

  /**
   * 组件的关系
   */
  relations: getParents('navi-tabs'),

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      observer: 'update'
    },
    iconName: {
      type: String,
      observer: 'update'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateRender(active, parent){
      const {data: parentData} = parent;
      this.inited = this.inited || active;
      this.setData({
        active
      });
    },

    update() {
      if(this.parent) {
        this.parent.updateTabs();
      }
    }
  }
})

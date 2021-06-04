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
    },
    name :{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: false,
    gap: 20,
    feeds: [{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'aaa'
      },{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'aaa'
      },{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
      },{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
      },{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
      },{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
      },{
        src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        title: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getComputedName() {
      if(this.data.name !== '') {
        return this.data.name;
      }
      return this.index;
    },
    updateRender(active, parent) {
      this.setData({
        active,
        shouldRender: active,
        shouldShow: active,
      });
    },
    update() {
      if(this.parent) {
        this.parent.updateTabs();
      }
    }
  }
})

// components/my-popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    position: {
      type: String,
      value: 'bottom'
    },
    useIcon: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    size: '45rpx'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      let myEventDetail = {};
      let myEventOption = {};
      this.triggerEvent('onClose', myEventDetail, myEventOption);
    },
    onConfirm() {
      let myEventDetail = {};
      let myEventOption = {};
      this.triggerEvent('onConfirm', myEventDetail, myEventOption);
    }
  }
})

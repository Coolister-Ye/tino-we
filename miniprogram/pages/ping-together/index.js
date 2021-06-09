// miniprogram/pages/ping-together/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    date: '',
    showDatePicker: false,
    showStartTimePicker: false,
    showEndRTimeRicker: false,
    currentDate: '12:00',
    minHour: 8,
    maxHour: 22,
    headerImageSrc: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    duration: [{
      value: 1,
      message: "1小时"
    },{
      value: 1.5,
      message: "1.5小时"
    },{
      value: 2,
      message: "2小时"
    }]
  },

  onDisplay({currentTarget: {dataset: {name}}}) {
    if (name === 'date-picker') {
      this.setData({ showDatePicker: true });
    } else if (name === 'start-time-picker') {
      this.setData({ showStartTimePicker: true });
    } else if (name === 'end-time-picker') {
      this.setData({ showEndRTimeRicker: true});
    }
  },
  onClose({currentTarget: {dataset: {name}}}) {
    if (name === 'date-picker') {
      this.setData({ showDatePicker: false });
    } else if (name === 'start-time-picker') {
      this.setData({ showStartTimePicker: false });
    } else if (name === 'end-time-picker') {
      this.setData({ showEndRTimeRicker: false});
    }
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: `选择了 ${event.detail.length} 个日期`,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
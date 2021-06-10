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
    duration: {
      min: 0.5,
      max: 3,
      value: 1,
      step: 0.5,
      activeColor: 'green'
    },
    deadline: [
      {info: '12小时前'},
      {info: '24小时前'},
      {info: '48小时前'},
    ],
    header: {
      textFirst: '早上好，亲爱的朋友～',
      textSecond: '快来一起流汗吧！'
    }
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

  updateHeaderText(suffix = '亲爱的朋友～') {
    let date = new Date();
    let hour = date.getHours();
    var text = '';
    if (hour >= 6 && hour < 12) {
      text = '早上好';
    } else if (hour >= 12 && hour < 19) {
      text = '下午好';
    } else if (hour >= 19 && hour < 24) {
      text = '晚上好';
    } else {
      text = '夜深了';
    }
    this.data.header.textFirst = text + '，' + suffix;
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.updateHeaderText();
    this.setData({
      header: this.data.header
    });
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
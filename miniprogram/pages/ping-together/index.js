// miniprogram/pages/ping-together/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    date: '',
    showDatePicker: false,
    showTimePicker: false
  },

  onDisplay({currentTarget: {dataset: {name}}}) {
    if (name === 'date-picker') {
      this.setData({ showDatePicker: true });
    } else if (name === 'time-picker') {
      this.setData({ showTimePicker: true });
    }
  },
  onClose({currentTarget: {dataset: {name}}}) {
    if (name === 'date-picker') {
      this.setData({ showDatePicker: false });
    } else if (name === 'time-picker') {
      this.setData({ showTimePicker: false });
    }
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
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
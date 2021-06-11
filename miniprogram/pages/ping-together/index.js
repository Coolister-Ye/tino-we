// miniprogram/pages/ping-together/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    date: '',
    activityValue: '',
    showExplainTab: false,
    showActivityTab: false,
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
    },
    explainTabs: [
      '系统可以同时在多个场地，日期和时间段的组合进行拼单',
      '系统在订单提交后会在选择的最晚日期+时间段组合的前N个小时（可选）停止拼单，请合理规划行程，避免资源浪费',
      '订单提交后，后台服务将会持续进行监控和拼单'
    ],
    activityActions: [
      {
        name: '羽毛球'
      },
      {
        name: '篮球',
      },
      {
        name: '其他活动'
      }
    ]
  },

  onDisplay({currentTarget: {dataset: {name}}}) {
    if (name === 'date-picker') {
      this.setData({ showDatePicker: true });
    } else if (name === 'start-time-picker') {
      this.setData({ showStartTimePicker: true });
    } else if (name === 'end-time-picker') {
      this.setData({ showEndRTimeRicker: true });
    } else if (name === 'explainCell') {
      this.setData({ showExplainTab: true });
    } else if (name === 'activityCell') {
      this.setData({ showActivityTab: true });
    }
  },
  
  onClose({currentTarget: {dataset: {name}}}) {
    if (name === 'date-picker') {
      this.setData({ showDatePicker: false });
    } else if (name === 'start-time-picker') {
      this.setData({ showStartTimePicker: false });
    } else if (name === 'end-time-picker') {
      this.setData({ showEndRTimeRicker: false});
    } else if (name === 'explainPopUp') {
      this.setData({ showExplainTab: false });
    } else if (name === 'activityPopUp') {
      this.setData({ showActivityTab: false });
    }
  },

  onSelect(event) {
    this.setData({
      showActivityTab: false,
      activityValue: event.detail.name
    });
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
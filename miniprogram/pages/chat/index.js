// import { CONNECTING } from 'ws';
// import {WxWebSocket} from './wxws';

// miniprogram/pages/chat/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tinode: null,
    check: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // function tnMeContactUpdate(what, cont) {
    //   if (what == 'msg') {
    //     tinode.getMeTopic().contacts((c) => {
    //       console.log(c.action);
    //       console.log(c.latestMessage(true));
    //     });
    //   }
    // };
    // const Tinode = require('./tinode.prod');
    // const tinode = new Tinode({appName: 'test', host: '101.34.12.89:6060', transport: 'ws', apiKey: 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K', secure: true}, ()=> console.log('Success'));
    // this.setData({tinode: tinode});
    // // Register onConnect listener
    // tinode.onConnect = () => { 
    //   console.log("here");
    //   let promise = tinode.loginBasic('tinode4', 'passwd');
    //   promise.then((res) => {
    //     console.log("here2");
    //     const me = tinode.getMeTopic();
    //     me.onContactUpdate = tnMeContactUpdate;
    //     me.subscribe(
    //       me.startMetaQuery().withLaterSub().withDesc().withTags().withCred().build()
    //     );
    //   }); 
    // };
    // tinode.connect();
    // console.log("tinode:", tinode);
    // console.log("tinode:", tinode.getTopic("tinode5"));
    // console.log(Tinode);
    // tinode.hello();
    // console.log(this.tinode.hello());
    // console.log(tinode.isConnected());
    // console.log(this.tinode);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const Tinode = require('./tinode.prod');
    // const tinode = new Tinode({appName: 'test', host: '101.34.12.89:6060', transport: 'ws', apiKey: 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K', secure: true, platform: 'web'}, ()=> console.log('Success'));
    // tinode.enableLogging(true);
    // //  tinode.hello();
    // //  console.log(tinode.isConnected());
    //  tinode.onConnect = () => { console.log("here"); };
    //  tinode.connect();   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
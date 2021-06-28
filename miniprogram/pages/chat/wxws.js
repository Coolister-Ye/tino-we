class WxWebSocket {
  constructor(url) {
    this.url = url;
    this.onerror = null;
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    wx.connectSocket({
      url: this.url,
    });
    wx.onSocketError(this.onerror);
    wx.onSocketOpen(this.onopen);
    wx.onSocketClose(this.onclose);
    wx.onSocketMessage(this.onmessage);
  };
}

export {WxWebSocket};
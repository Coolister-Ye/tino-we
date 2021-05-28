function getRect(content, selector) {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
      .in(content)
      .select(selector)
      .boundingClientRect()
      .exec((rect = []) => resolve(rect[0]));
  });
}

function getAllRect(context, selector) {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
    .in(context)
    .selectAll(selector)
    .boundingClientRect()
    .exec((rect = []) => resolve(rect[0]));
  });
}

export {getRect, getAllRect};
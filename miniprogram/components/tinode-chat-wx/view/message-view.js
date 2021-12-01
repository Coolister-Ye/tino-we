class MessageView {
  constructor(prop) {

  }

  static getDerivedStateFromProps(nextPorps, prevState) {
    let nextState = {};
    if (!nextPorps.topic) {
      // Default state: no topic.
      nextState = {
        latestMsgSeq: -1,
        latestClearId: -1,
        onlineSubs: [],
        topic: null,
        title: '',
        avatar: null,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        peerMessagingDisabled: false,
        channel: false
      };
    } else if (nextPorps.topic != prevState.topic) {
      const topic = nextPorps.tinode.get
    }
  }
}
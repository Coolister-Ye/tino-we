import {
  makeImageDataUrl
} from '../tinode-chat-wx/lib/blob-helpers';

// components/tinode-message-view/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    check: {
      type: Number,
      observer: function (newVal, oldValue) {
        console.log("Prop Check", newVal, oldValue);
      }
    },
    tinode: Object,
    connected: Boolean,
    myUserId: String,
    acs: Object,
    topic: {
      type: String,
      observer: function (newVal, oldValue) {
        console.log("Obser topic", newVal, oldValue)
      },
    }

  },

  /**
   * Component initial data
   */
  data: {
    latestMsgSeq: -1,
    latestMsgSeq: -1,
    onlineSubs: [],
    title: '',
    avatar: null,
    docPreview: null,
    imagePreview: null,
    imagePostview: null,
    typingIndicator: false,
    scrollingPosition: 0,
    fetchingMessages: false,
    peerMessagingDisabled: false,
    channel: false,
    connected: true
  },

  /**
   * Component methods
   */
  methods: {
    // render message view
    render: function () {
      const topic = this.data.tinode.getTopic("tinode5")
      const isChannel = topic.isChannelType()
      const groupTopic = topic.isGroupType() && !isChannel
      let messageNodes = []
      let previousFrom = null
      topic.message((msg, prev, next, i) => {
        let nextFrom = next ? (next.from || null) : 'chan'
        let sequence = 'single'
        let thisFrom = msg.from || 'chan'
        if (thisFrom == previousFrom) {
          if (thisFrom == nextFrom) {
            sequence = 'middle'
          } else {
            sequence = 'last'
          }
        } else if (thisFrom == nextFrom) {
          sequence = 'first'
        }
        previousFrom = thisFrom

        const isReply = !(thisFrom == this.data.myUserId)
        const deliveryStatus = topic.msgStatus(msg, true)

        let userName, userAvatar, userFrom;
        if (groupTopic) {
          const user = topic.userDesc(thisFrom)
          if (user && user.public) {
            userName = user.public.fn
            userAvatar = user.public.photo
          }
          userFrom = thisFrom
        }

        messageNodes.push({
          "tinode": this.data.tinode,
          "content": msg.content,
          "deleted": msg.hi,
          "mimeType": msg.head ? msg.head.mime : null,
          "timestamp": msg.ts,
          "response": isReply,
          "seq": msg.seq,
          "userFrom": userFrom,
          "userName": userName,
          "userAvatar": userAvatar,
          "sequence": sequence,
          "received": defaultStatus,
          "key": msg.seq
        })
      })
      this.setData({"messageNodes": messageNodes})
      console.log(this.data.messageNodes)
    }
  },

  lifetimes: {
    ready: function () {
      console.log("Check: ", this.data.check);
      console.log("Ppt: ", this.data.tinode.getTopic("tinode5"));
      console.log("Topic", this.data.topic)
      this.render()
    },

    // attached: function () {
    //   console.log("Check: ", this.data.check);
    //   console.log("Ppt: ", this.data.tinode);
    // }
  }
})
import {
  KNOWN_HOSTS,
  DEFAULT_HOST,
  MESSAGES,
  APP_NAME,
  API_KEY,
  LOGGING_ENABLED,
  PIC_DIR
} from './config';
import {
  secondToTime
} from './lib/strformat';
import {
  base64ReEncode,
  makeImageDataUrl
} from './lib/blob-helpers.js';

const Tinode = require('./tinode.prod');
const Drafty = Tinode.Drafty;

// components/tinode-chat-wx/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLocalHost: {
      type: Boolean,
      value: true
    },
    myServerAddress: {
      type: String,
      value: null
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    connected: false,
    // Connected and subscribed to 'me'
    ready: false,
    // Try to re-login on new connection.
    autoLogin: false,
    // Only support webstock now.
    transport: 'ws',
    // Tinode chat server address.
    serverAddress: null,
    // Tinode chat server version.
    serverVersion: 'no connection',
    // Error Info
    errorText: '',
    errorLevel: null,
    // Connection status
    liveConnection: false,
    // Client UI language, like "en_US" or "zh-Hans".
    locale: 'zh-Hans',
    // Show loading spinner
    loadSpinnerVisible: false,
    sidePanelSelected: 'login',
    // Login Info
    login: '',
    password: null,
    credMethod: undefined,
    credCode: undefined,
    // Topic Info
    myUserId: null,
    topicSelected: '',
    topicSelectedAcs: null,
    topicSelectedOnline: false,
    newTopicParams: null,
    // Chats as shown in the ContactsView
    chatList: [],
    // Value in input field
    messageValue: '',
    archive: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // Handle network status changed
    handleOnline(online) {
      console.log('handleOnline', online);
      if (online) {
        clearInterval(this.reconnectCountdown);
        this.tinode.reconnect();
      } else {
        this.setData({
          errorText: MESSAGES.no_connection.defaultMessage,
          errorLevel: 'warn'
        });
      }
      this.setData({
        liveConnection: true
      });
    },
    // Setup transport (only websocket) and server address. This will terminate connection with the server.
    tnSetup(serverAddress, transport, locale, persistentCache, onSetupCompleted, secure = true) {
      console.log("New tinode:", {
        appName: APP_NAME,
        host: serverAddress,
        apiKey: API_KEY,
        transport: transport,
        persist: persistentCache,
        secure: secure,
        onComplete: onSetupCompleted
      })
      const tinode = new Tinode({
        appName: APP_NAME,
        host: serverAddress,
        apiKey: API_KEY,
        transport: transport,
        persist: persistentCache,
        secure: secure,
        onComplete: onSetupCompleted
      });
      tinode.setHumanLanguage(locale);
      tinode.enableLogging(LOGGING_ENABLED, true);
      onSetupCompleted(true);
      return tinode;
    },
    // Connection succeeded
    handleConnected() {
      // Just to be sure.
      clearInterval(this.reconnectCountdown);
      this.handleError();

      const params = this.tinode.getServerInfo();
      this.setData({
        serverVersion: params.ver + ' ' + (params.build ? params.build : 'none')
      });

      if (this.data.autoLogin) {
        this.doLogin(this.data.login, this.data.password, {
          meth: this.data.credMethod,
          resp: this.data.credCode
        });
      }
    },
    /* Handle Login
     ** params login: username
     ** params password: password
     ** params cred: second level Credential (optional)
     */
    doLogin(login, password, cred) {
      if (this.tinode.isAuthenticated()) {
        console.log('Already logged in.');
        return;
      }
      // Sanitize and package credential. 
      cred = Tinode.credential(cred);
      // Try to login with login/password. If they are not available, try token.
      let promise = null;
      const token = this.tinode.getAuthToken();
      if (login && password) {
        this.setData({
          password: null
        });
        promise = this.tinode.loginBasic(login, password, cred);
      } else if (token) {
        promise = this.tinode.loginToken(token.token, cred);
      }

      if (promise) {
        promise.then((ctrl) => {
          if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
            this.setData({
              loadSpinnerVisible: false
            });
            if (cred) {
              this.handleError(MESSAGES.code_doesnot_match.defaultMessage, 'warn');
            }
            this.handleCredentialsRequest(ctrl.params);
          } else {
            this.handleLoginSuccessful();
          }
        }).catch((error) => {
          console.log("doLogin-error", error)
          this.setData({
            loginDisabled: false,
            credMethod: undefined,
            credCode: undefined,
            autoLogin: false
          });
          this.handleError(error, 'err')
          wx.removeStorage({
            key: 'auth-token',
            success(res) {
              console.log(res);
            }
          });
        });
      } else {
        // No login credentials provided.
        this.setData({
          loginDisabled: false
        });
      }
    },
    // Connection lost
    handleDisconnect(err) {
      this.setData({
        connected: false,
        ready: false,
        topicSelectedOnline: false,
        errorText: err && err.message ? err.message : 'Disconnected',
        errorLevel: err && err.message ? 'err' : 'warn',
        loginDisabled: false,
        serverVersion: 'no connection'
      });
    },
    // Called for each auto-reconnect iteration
    handleAutoreconnectIteration(sec, porm) {
      clearInterval(this.reconnectCountdown);

      if (sec < 0) {
        console.log('clear error');
        return;
      }

      if (porm) {
        // Reconnecting now
        porm.then(() => {
          // Reconnected: clear error
          console.log('clear error');
        }).catch((err) => {
          this.setData({
            errorText: err.message,
            errorLevel: 'err'
          });
        });
        return;
      }

      const {
        formatMessage
      } = null;
      let count = sec / 1000;
      count = count | count;
      this.reconnectCountdown = setInterval(() => {
        const timeLeft = (count > 99) ? secondToTime(count) : count;
        this.setData({
          errorText: "reconnecting",
          errorLevel: 'warn',
          errorAction: () => {
            clearInterval(this.reconnectCountdown);
            this.tinode.reconnect();
          }
        });
        count -= 1;
      }, 1000);
    },
    // Merge search results and contact list to create a single flat
    // list of known contacts for GroupManager to use.
    prepareSearchableContacts(chatList, foundContacts) {
      const merged = {};

      // For chatList topics merge only p2p topics and convert them to the
      // same format as foundContacts.
      for (const c of chatList) {
        if (Tinode.isP2PTopicName(c.topic)) {
          merged[c.topic] = {
            user: c.topic,
            updated: c.updated,
            public: c.public,
            private: c.private,
            acs: c.acs
          };
        }
      }

      // Add all foundCountacts if they have not been added already.
      for (const c of foundConracts) {
        if (!merged[c.user]) {
          merged[c.user] = c;
        }
      }

      return Object.values(merged);
    },
    /* Makr avatar url
     */
    makeImageUrl(extractChat) {
      if (extractChat.public && extractChat.public.photo) {
        return extractChat.public.photo;
      } else {
        return PIC_DIR + "cat" + extractChat.public.fn.charAt(1).charCodeAt().toString().charAt(1) + ".png";
      }
    },
    /* Extract useful prop from chat list object.
     */
    extractFromChat(chat) {
      const useProp = ["acs", "name", "online", "private", "public", "topic", "unread"];
      const extractChat = {};
      for (var i=0; i<useProp.length; i++) {
        extractChat[useProp[i]] = chat[useProp[i]];
      }
      extractChat.avatar = this.makeImageUrl(extractChat);
      return extractChat;
    },
    /* Derive State from chatlist object
     */
    deriveStateFromChatlist(chatlist) {
      const contacts = [];
      let unreadThreads = 0;
      let archivedCount = 0;
      chatlist.map((c) => {
        const blocked = c.acs && !c.acs.isJoiner();
        // Show only blocked contacts only when props.blocked == true.
        if (blocked) {
          return;
        } else {
          contacts.push(this.extractFromChat(c));
        }
        if (c.private && c.private.arch) {
          if (this.data.archive) {
            contacts.push(this.extractFromChat(c));
          } else {
            archivedCount++;
          }
        }
      });
      console.log("Contacts", contacts);
      return {
        contactList: contacts,
        unreadThreads: unreadThreads
      };
    },

    /* Helper function to set or read contact from local
     */
    resetContactList() {
      const newState = {
        chatList: []
      };

      if (!this.data.ready) {
        newState.ready = true;
      }

      this.tinode.getMeTopic().contacts((c) => {
        if (!c.topic && !c.user) {
          // Contacts expect c.topic to be set
          c.topic = c.name;
        }
        newState.chatList.push(c);
        if (this.data.topicSelected == c.topic) {
          newState.topicSelectedOnline = c.online;
          newState.topicSelectedAcs = c.acs;
        }
        // Merge search result and chat list. 
        // newState.searchableContacts = this.prepareSearchableContacts(newState.chatList, this.data.searchResults);
      });
      this.setData({
        chatList: this.deriveStateFromChatlist(newState.chatList),
        ready: true
      });
    },
    // Handle error
    handleError(err = '', errorLevel = null, errorAction = undefined, errorActionText = null) {
      this.setData({
        err,
        errorLevel,
        errorAction,
        errorActionText
      });
    },
    // User clicked login button in the side panel
    handleLoginRequest() {
      this.setData({
        loginDisabled: true,
        autoLogin: true
      });
      this.handleError('', null);

      if (this.tinode.isConnected()) {
        this.doLogin(this.data.login, this.data.password, {
          meth: this.credMethod,
          resp: this.credCode
        })
      } else {
        this.tinode.connect().catch((err) => {
          this.setData({
            loginDisabled: false,
            autoLogin: false
          });
          this.handleError(err.message, 'err');
        });
      }
    },

    /* Handle login in successfully
     */
    handleLoginSuccessful() {
      this.handleError();
      // Refresh authentication token.
      if (wx.getStorageSync('keep-logged-in')) {
        wx.setStorageSync('auth-token', this.tinode.getAuthToken());
      }

      // Logged in fine, subscribe to 'me' attaching callbacks from the contacts view.
      const me = this.tinode.getMeTopic();
      me.onMetaDesc = this.tnMeMetaDesc;
      me.onContactUpdate = this.tnMeContactUpdate;
      me.onSubsUpdated = this.tnMeSubsUpdated;
      this.setData({
        connected: true,
        credMethod: undefined,
        credCode: undefined,
        myUserId: this.tinode.getCurrentUserID(),
        autoLogin: true,
        requestedTopic: undefined
      });
      // Subscribe, fetch topic desc, the list of subscriptions. Messages are not fetched.
      me.subscribe(
        me.startMetaQuery().withLaterSub().withDesc().withTags().withCred().build()
      ).catch((err) => {
        this.tinode.disconnect();
        wx.removeStorageSync('auto-token');
        this.handleError(err.message, 'err');
      }).finally(() => {
        this.setData({
          sidePanelSelected: 'contacts'
        });
      });
    },

    /* Setup me topic
     */
    tnMeMetaDesc(desc) {
      if (desc) {
        if (desc.public) {
          this.setData({
            sidePanelTitle: desc.public.fn,
            sidePanelAvatar: makeImageDataUrl(desc.public.photo)
          });
        }
        if (desc.acs) {
          this.setData({
            incognitoMode: !desc.acs.isPresencer()
          });
        }
      }
    },

    // Reactions to updates to the contact list.
    // Condition: on/off: 'P' permission 
    tnMeContactUpdate(what, cont) {
      if (what == 'on' || what == 'off') {
        this.resetContactList();
        if (this.data.topicSelected == cont.topic) {
          this.setData({ topicSelectedOnline: (what == 'on') });
        }
      } else if (what == 'read') {
        this.resetContactList();
      } else if (what == 'msg') {
        // Check if the topic is archived. If so, don't play a sound.
        const topic = this.tinode.getTopic(cont.topic);
        const archived = topic && topic.isArchived();

        // New message received. Maybe the message is from the current user, then unread is 0.
        if (cont.unread > 0 && this.data.messageSounds && !archived) {
          // Skip update if the topic is currently open, otherwise the badge will annoyingly flash.
          if (this.state.topicSelected != cont.topic) {
            //TODO: Sound effect
            console.log('play update sound');
          }
        }
        // Reorder contact list to use possibly updated 'touched'.
        this.resetContactList();
      } else if (what == 'recv') {
        // Explicitly ignoring "recv" -- it causes no visible updates to contact list.
      } else if (what == 'gone' || what == 'unsub') {
        // Topic deleted or user unsubscribed. Remove topic from view.
        // If the currently selected topic is gone, clear the selection.
        if (this.data.topicSelected == cont.topic) {
          this.handleTopicSelected(null);
        }
        // Redraw without the deleted topic.
        this.resetContactList();
      } else if (what == 'acs') {
        // Permissions changed. If it's for the currently selected topic,
        // update the views.
        if (this.state.topicSelected == cont.topic) {
          this.setData({
            topicSelectedAcs: cont.acs
          });
        }
      } else if (what == 'del') {
        // TODO: messages deleted (hard or soft) -- update pill counter
      } else if (what == 'upd') {
        // upd - handled by the SDK. Explicitly ignoring here.
      } else {
        // TODO(gene): handle other types of notifications:
        // * ua -- user agent changes (maybe display a pictogram for mobile/desktop).
        console.log("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
      }
    },

    /* Setup contact list
     */
    tnMeSubsUpdated() {
      this.resetContactList();
    },

    // User clicked on a contact in the side panel or deleted a contact.
    handleTopicSelected(event) {
      const item = event.currentTarget.dataset.item;
      const topicName = item.topic;
      // Clear newTopicParams after use.
      if (this.data.newTopicParams && this.data.newTopicParams.topicName != topicName) {
        this.setData({
          newTopicParams: null
        });
      }

      if (topicName) {
        this.setData({
          errorText: '',
          errorLevel: null,
          sidePanelSelected: 'message-view'
        });
        // Different contact selected.
        if (this.data.topicSelected != topicName) {
          this.setData({
            topicSelected: topicName,
            prevTopicSelected: this.data.topicSelected,
            topicSelectedOnline: this.tinode.isTopicOnline(topicName),
            topicSelectedAcs: this.tinode.getTopicAccessMode(topicName)
          });
        }
      } else {
        // Currently selected contact deleted
        this.setData({
          errorText: '',
          errorLevel: null,
          topicSelectedOnline: null,
          topicSelectedAcs: null
        });
      }
      this.renderMessageView(null);
    },

    // User is sending a message, either plain text or a drafty object, possibly
    // with attachments.
    //  - msg - Drafty message with content
    //  - promise - Promise to be resolved when the upload is completed
    //  - uploader - for tracking progress
    handleSendMessage(msg, promise, uploader) {
      const topic = this.tinode.getTopic(this.data.topicSelected);

      msg = topic.createMessage(msg, false);
      // The uploader is used to show progress.
      msg._uploader = uploader;

      if (!topic.isSubscribed()) {
        if (!promise) {
          promise = Promise.resolve();
        }
        promise = promise.then(() => {
          return topic.subscribe();
        });

        if (promise) {
          promise = promise.catch((err) => {
            this.handleError(err.message, 'err');
          });
        }

        topic.publishDraft(msg, promise)
          .then((ctrl) => {
            if (topic.isArchived()) {
              return topic.archive(false);
            }
          })
          .catch((err) => {
            this.handleError(err.message, 'err');
          });
      }
    },
    /* Leave the old topic
    */
    level(oldTopicName) {
      if (!oldTopicName || !this.tinode.isTopicCached(oldTopicName)) {
        return;
      }
      const oldTopic = this.tinode.getTopic(oldTopicName);
      if (oldTopic && oldTopic.isSubscribed()) {
        oldTopic.leave(false)
          .catch(() => {/* do nothing here */})
          .finally(() => {
            oldTopic.onData = undefined;
            oldTopic.onAllMessagesReceived = undefined;
            oldTopic.onInfo = undefined;
            oldTopic.onMetaDesc = undefined;
            oldTopic.onSubsUpdated = undefined;
            oldTopic.onPres = undefined;
          });
      }
    },
    /* Render messgae page
    */
    renderMessageView(msg) {
      const topic = this.data.topicSelected ? this.tinode.getTopic(this.data.topicSelected) : undefined;

      if (this.data.topicSelected != this.data.prevTopicSelected) {
        if (this.data.prevTopicSelected && !Tinode.isNewGroupTopicName(this.data.prevTopicSelected)) {
          this.leave(this.data.prevTopicSelected);
        }

        if (topic) {
          topic.onData = this.renderMessageView;
        }
      }

      if (topic && !topic.isSubscribed() && this.data.ready) {
        const newTopic = this.data.topicSelected != this.data.prevTopicSelected;
        let getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub();
        if (newTopic) {
          getQuery = getQuery.withLaterData(24);
        }
        topic.subscribe(getQuery.build())
        .then((ctrl) => {
          console.log("HERE MAN!", ctrl);
          if (ctrl.code == 303) {
            this.setData({
              topicSelected: ctrl.params.topic,
              prevTopicSelected: this.data.topicSelected
            });
            return;
          }
        }).catch((err) => {
          console.log("Failed subscription to", this.data.topicSelected);
        });
      }
    
      const isChannel = topic.isChannelType();
      const groupTopic = topic.isGroupType() && !isChannel;
      let messageNodes = [];
      let previousFrom = null;
      let chatBoxClass = null;

      // Get cached messages
      topic.messages((msg, prev, next, i) => {
        let nextFrom = next ? (next.from || null) : 'chan';
        let sequence = 'single';
        let thisFrom = msg.from || 'chan';
        chatBoxClass
        if (thisFrom == previousFrom) {
          if (thisFrom == nextFrom) {
            sequence = 'middle';
          } else {
            sequence = 'last';
          }
        } else if (thisFrom == nextFrom) {
          sequence = 'first';
        }
        previousFrom = thisFrom;

        const isReply = !(thisFrom == this.data.myUserId);
        const deliveryStatus = topic.msgStatus(msg, true);

        let userName, userAvatar, userFrom;
        if (groupTopic) {
          const user = topic.userDesc(thisFrom);
          if (user && user.public) {
            userName = user.public.fn;
            userAvatar = makeImageDataUrl(user.public.photo);
          }
          userFrom = thisFrom;
          chatBoxClass = 'chat-box group';
        } else {
          chatBoxClass = 'chat-box';
        }
        messageNodes.push({
          userName: userName,
          content: msg.content,
          deteted: msg.hi,
          miniType: msg.head ? msg.head.mime: null,
          timestamp: msg.ts,
          reponse: isReply,
          seq: msg.seq,
          userFrom: userFrom,
          userName: userName,
          userAvatar: userAvatar,
          sequence: sequence,
          received: deliveryStatus,
          uploader: msg._uploader,
          key: msg.seq
        });
      });
      console.log("messageNodes", messageNodes);
      this.setData({ messageNodes });
    },
  },

  /**
   * 组件的生命流程函数
   */
  lifetimes: {
    attached: function () {
      // Init data
      this.data.serverAddress = this.data.isLocalHost ? KNOWN_HOSTS.local : (this.data.myServerAddress ? this.data.myServerAddress : DEFAULT_HOST);
      wx.getNetworkType({
          success: (result) => {
            this.data.liveConnection = !(result.networkType === 'none')
          }
        }),
        wx.getSystemInfo({
          success: (result) => {
            this.data.locale = result.language
          }
        })

      // Init function
      this.handleConnected = this.handleConnected.bind(this);
      this.handleDisconnect = this.handleDisconnect.bind(this);
      this.handleLoginRequest = this.handleLoginRequest.bind(this);
      this.tnSetup = this.tnSetup.bind(this);
      this.resetContactList = this.resetContactList.bind(this);
      this.handleLoginSuccessful = this.handleLoginSuccessful.bind(this);
      this.tnMeMetaDesc = this.tnMeMetaDesc.bind(this);
      this.tnMeContactUpdate = this.tnMeContactUpdate.bind(this);
      this.tnMeSubsUpdated = this.tnMeSubsUpdated.bind(this);
      this.renderMessageView = this.renderMessageView.bind(this);

      // Init event listener
      wx.onNetworkStatusChange((res) => {
        this.handleOnline(res.isConnected)
      });

      // Init Login.
      const keepLoggedIn = wx.getStorageSync('keep-logged-in');
      new Promise((resolve, reject) => {
        this.tinode = this.tnSetup(this.data.serverAddress, this.data.transport, this.data.locale, keepLoggedIn, resolve);
        this.tinode.onConnect = this.handleConnected;
        // this.tinode.onDisconnect = this.handleDisconnect;
        // this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
      }).then(() => {
        // TODO: Desktop alerts function need to access firebase which is not available rightnow. 
        console.log("Do not implement notice push");

        // Read concats from cache
        this.resetContactList();

        const token = keepLoggedIn ? wx.getStorageSync('auth-token') : undefined;
        if (token) {
          this.setData({
            autoLogin: true
          });

          // When reading from storage, date is returned as string.
          token.expires = new Date(token.expires);
          this.tinode.setAuthToken(token);
          this.tinode.connect().catch((err) => {
            // Socket error
            this.setData({
              errorText: errorText,
              errorLevel: 'err'
            });
          });
        }
      });
    }
  }
})
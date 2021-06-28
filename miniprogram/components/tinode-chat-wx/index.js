import {KNOWN_HOSTS, DEFAULT_HOST, MESSAGES, APP_NAME, API_KEY, LOGGING_ENABLED} from './config';
import {secondToTime} from './strformat';
const Tinode = require('./tinode.prod');

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
    }
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
    // Show login panel or not
    loadSpinnerVisible: false,
    // Login Info
    login: '',
    password: null,
    credMethod: undefined,
    credCode: undefined,
    // Topic Info
    topicSelectedOnline: false
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
      this.setData({liveConnection: true});
    },
    // Setup transport (only websocket) and server address. This will terminate connection with the server.
    tnSetup(serverAddress, transport, locale, persistentCache, onSetupCompleted, secure=true) {
      const tinode = new Tinode({
        appName: APP_NAME, 
        host: serverAddress, 
        apiKey: API_KEY, 
        transport: transport,
        persist: persistentCache,
        secure: secure
      }, onSetupCompleted);
      tinode.setHumanLanguage(locale);
      tinode.enableLogging(LOGGING_ENABLED, true);
      return tinode;
    },
    // Connection succeeded
    handleConnected() {
      clearInterval(this.reconnectCountdown);
      const params = this.tinode.getServerInfo();
      this.setData({
        serverVersion: params.ver + ' ' + (params.build ? params.build : 'none')
      });

      if (this.data.autoLogin) {
        this.doLogin(this.data.login, this.data.password, {meth: this.data.credMethod, resp: this.data.credCode});
      }
    },
    // Handle Login
    doLogin(login, password, cred) {
      if (this.tinode.isAuthenticated()) {
        console.log('Already logged in.');
        return;
      }
      // Sanitize and package credential. 
      cred = Tinode.credentail(cred);
      // Try to login with login/password. If they are not available, try token. If no token, ask for login/password.
      let promise = null;
      const token = this.tinode.getAuthToken();
      if (login && password) {
        this.setData({password: null});
        promise = this.tinode.loginBasic(login, password, cred);
      } else if (token) {
        promise = this.tinode.loginToken(token.token, cred);
      }

      if (promise) {
        promise.then((ctrl) => {
          if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
            this.setData({loadSpinnerVisible: false});
            if (cred) {
              this.setData({errorText: MESSAGES.code_doesnot_match.defaultMessage, errorLevel: 'warn'});
            }
            this.handleCredentialsRequest(ctrl.params);
          } else {
            this.this.handleLoginSuccessful();
          }
        }).catch((error) => {
          this.setData({
            loginDisabled: false,
            credMethod: undefined,
            credCode: undefined,
            loadSpinnerVisible: false,
            autoLogin: false,
            errorText: error, 
            errorLevel: 'err'
          });
          wx.removeStorage({
            key: 'auth-token',
            success(res) {
              console.log(res);
            }
          });
        });
      } else {
        // No login credentials provided.
        // Make sure we are on the login page.
        this.setData({loginDisabled: false});
      }
    },
    // Connection lost
    handleConnect(err) {
      this.setData({
        connected: false,
        ready: false,
        topicSelectedOnline: false,
        errorText: err && err.message ? err.message: 'Disconnected',
        errorLevel: err && err.message ? 'err': 'warn',
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

      const {formatMessage} = null;
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
          merged[c.user]= c;
        }
      }

      return Object.values(merged);
    },

    // Set or read contact from local
    resetContactList() {
      const newState = {
        charList: []
      };

      if (!this.data.ready) {
        newState.ready = true;
      }

      this.tinode.getMeTopic().contacts((c) => {
        if (!c.topic && !c.user) {
          // Contacts expect c.topic to be set.
          c.topic = c.name;
        }
        newState.charList.push(c);
        if (this.data.topicSelected == c.topic) {
          newState.topicSelectedOnline = c.online;
          newState.topicSelectedAcs = c.acs;
        }
        // Merge search result and chat list. 
        newState.searchableContacts = this.prepareSearchableContacts(newState.chatList, this.data.searchResults);
        this.setData(newState);
      });
    },
    // Handle error
    handleError(err='', errorLevel=null, errorAction=undefined, errorActionText=null) {
      this.setData({err, errorLevel, errorAction, errorActionText});
    },
    // User clicked login button in the side panel
    handleLoginRequest() {
      this.setData({
        loginDisabled: true,
        autoLogin: true
      });
      this.handleError('', null);

      if (this.tinode.isConnected()) {
        this.doLogin(this.data.login, this.data.password, {meth: this.credMethod, resp: this.credCode})
      } else {
        this.tinode.connect().catch((err) => {
          this.setData({loginDisabled: false, autoLogin: false});
          this.handleError(err.message, 'err');
        });
      }
    }
  },

  /**
   * 组件的生命流程函数
   */
  lifetimes: {
    attached: function () {
      // Init data
      console.log(this.data.isLocalHost);
      console.log(this.data.myServerAddress);
      this.data.serverAddress = this.data.isLocalHost ? KNOWN_HOSTS.local : (this.data.myServerAddress ? this.data.myServerAddress : DEFAULT_HOST);
      wx.getNetworkType({
        success: (result) => { this.data.liveConnection = !(result.networkType === 'none')},
      }),
      wx.getSystemInfo({
        success: (result) => { this.data.locale = result.language},
      })
      // Init event listener
      wx.onNetworkStatusChange((res) => { this.handleOnline(res.isConnected) });

      const keepLoggedIn = wx.getStorageSync('keep-logged-in');
      new Promise((resolve, reject) => {
        this.tinode = this.tnSetup(this.data.serverAddress, this.data.transport, this.data.locale, keepLoggedIn, resolve);
        this.tinode.onConnect = this.handleConnected;
        this.tinode.onDisconnect = this.handleDisconnect;
        this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
      }).then(() => {
        // TODO: Initialize desktop alerts.
        console.log("Do not implement notice push");

        // Read concats
        this.resetContactList();

        const token = keepLoggedIn ? wx.getStorageSync('auth-token') : undefined;
        if (token) {
          this.setData({autoLogin: true});

          // When reading from storage, date is returned as string.
          token.expires = new Date(token.expires);
          this.tinode.setAuthToken(token);
          this.tinode.connect().catch((err) => {
            // Socket error
            this.setData({errorText: errorText, errorLevel: 'err'});
          });
        }
      });
    }
  }
})

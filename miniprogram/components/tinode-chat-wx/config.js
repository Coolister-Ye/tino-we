// Version of TinodeWx component.
export const version = '0.1';

// Name of this application, used in the User-Agent.
export const APP_NAME = 'TinodeWx' + version;

// API key. Use https://github.com/tinode/chat/tree/master/keygen to generate your own
export const API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';

// The array of possible hosts to connect to.
export const KNOWN_HOSTS = {hosted: 'web.tinode.co', local: 'localhost:6060'};

// Default host name and port to connect to.
export const DEFAULT_HOST = KNOWN_HOSTS.hosted;

// Enable console logging.
export const LOGGING_ENABLED = true;

// Max length of account
export const MAX_TITLE_LENGTH = 15;

// Min length of account
export const MIN_TITLE_LENGTH = 3;

// Min password
export const MIN_PASSWD_LENGTH = 8;

export const MESSAGES = {
  reconnect_countdown: {
    id: 'reconnect_countdown',
    defaultMessage: 'Disconnected. Reconnecting in {seconds}…',
    description: 'Message shown when an app update is available.'
  },
  reconnect_now: {
    id: 'reconnect_now',
    defaultMessage: 'Try now',
    description: 'Prompt for reconnecting now'
  },
  push_init_failed: {
    id: 'push_init_failed',
    defaultMessage: 'Failed to initialize push notifications',
    description: 'Error message when push notifications have failed to initialize.'
  },
  invalid_security_token: {
    id: 'invalid_security_token',
    defaultMessage: 'Invalid security token',
    description: 'Error message when resetting password.'
  },
  no_connection: {
    id: 'no_connection',
    defaultMessage: 'No connection',
    description: 'Warning that the user is offline.'
  },
  code_doesnot_match: {
    id: 'code_doesnot_match',
    defaultMessage: 'Code does not match',
    description: 'Error message when the credential validation code is incorrect.'
  },
  menu_item_info: {
    id: 'menu_item_info',
    defaultMessage: 'Info',
    description: 'Show extended topic information'
  },
  user_name_max: {
    id: 'user_name_max',
    defaultMessage: 'Length if user must be less than ' + MAX_TITLE_LENGTH,
    description: 'User name out of range'
  },
  user_name_min: {
    id: 'user_name_min',
    defaultMessage: 'Length if user must be larger than ' + MIN_TITLE_LENGTH,
    description: 'User name out of range'
  },
  password_max: {
    id: 'user_name_max',
    defaultMessage: 'Length if user must be less than ' + MIN_PASSWD_LENGTH,
    description: 'Password out of range'
  },
};

// Pictures storage location
export const PIC_DIR = "../../../../components/tinode-chat-wx/pic/";

// Icon file
export const ICON_FN = PIC_DIR + "T-01.png";

// Navigator route
export const NAVI_ROUTE = {
  "new-contacts": "contacts",
  "message-view": "contacts"
}
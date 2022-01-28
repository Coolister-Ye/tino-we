// components/tinode-chat-contact/index.js
Component({
    options: {
        styleIsolation: 'shared',
    },
    /**
     * Component properties
     */
    properties: {
        avatarPath: {
            type: String,
            value: 'user-o'
        },
        avatarSize: {
            type: String,
            value: '40px'
        },
        title: {
            type: String,
            value: 'UnNamed'
        },
        preview: {
            type: String,
            value: ''
        },
        updateTime: {
            type: String,
            value: ''
        },
        onlineStatus: {
            type: String,
            value: 'online'
        },
        unread: {
            type: String,
            value: ''
        }
    },

    /**
     * Component initial data
     */
    data: {

    },

    /**
     * Component methods
     */
    methods: {

    }
})

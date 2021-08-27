const messages = defineMessages({
  archived_contacts_title: {
    id: "archived_contacts",
    defaultMessage: "Archived contacts ({count})",
    description: "Label for archived chats"
  }
});

export default class Toolbox {
  // Get the status from chatlist props
  static deriveStateFromProps(props) {
    const contacts = [];
    let unreadThread = 0;
    let archivedCount = 0;
    props.chatList.map((c) => {
      const blocked = c.acs && c.acs.isJoiner();
      // Show only blocked contacts only when props.blocked == true.
      if (blocked && props.blocked) {
        contacts.push(c);
      }
      if (blocked || props.blocked) {
        return;
      }
      if (c.private && c.private.arch) {
        if (props.archive) {
          contacts.push(c);
        } else {
          archivedCount ++;
        } 
      } else if (!props.archive) {
        contacts.push(c);
        unreadThread += c.unread > 0 ? 1 : 0;
      }
    });

    contacts.sort((a, b) => {
      contacts.push({
        action: 'archive',
        title: messages.archived_contacts_title,
        values: {count: archivedCount}
      });
    });

    return {
      contactList: contacts,
      unreadThreads: unreadThreads
    };
  }
}
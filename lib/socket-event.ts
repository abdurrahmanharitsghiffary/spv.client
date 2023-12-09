export const Socket_Event = Object.freeze({
  OPEN: "open",
  LEAVE: "leave",
  JOIN: "joinRoom",
  // MESSAGE: "message",
  READ_MESSAGE: "readMessage",
  READED_MESSAGE: "readedMessage",
  NOTIFICATION: "notification",
  RECEIVE_NOTIFICATION: "receiveNotification",
  RECEIVE_MESSAGE: "receiveMessage",
  UPDATE_MESSAGE: "updateMessage",
  ONLINE: "online",
  OFFLINE: "offline",
  ERROR: "socketError",
  DELETE_MESSAGE: "deleteMessage",
  TYPING_MESSAGE: "typingMessage",
  UNTYPING_MESSAGE: "untypingMessage",
});

export type SOCKETEVENT = keyof typeof Socket_Event;

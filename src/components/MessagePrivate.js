import React from "react";

function MessagePrivate({ message }) {
    return  <div className="text-private">{message.text}</div>
}

export default MessagePrivate;
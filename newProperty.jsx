  const handleSendMessage = (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter')
        return ;
    if (message.trim()) {
      SetPicker((prev) => (prev ? !prev : prev));//deactivate emojies palett when - sending msg !
      const messageData = {
        sender_id: CurrentUser?.user_id,
        receiver_id: ChatPartner?.id,
        content: message,
        seen: false,
        created_at: new Date().toISOString()
      };

      clientSocket?.send(JSON.stringify({type: 'newchat.message', messageData: messageData}));
      
      const notif = new Audio(notificationSound);
      notif.play();
      setMessage("");
    }
  };
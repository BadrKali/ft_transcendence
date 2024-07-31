import React, { useState, useRef, useContext } from "react";
import styles from "./MessageSection.module.css";
import EmptyChatAnimation from "../../ChatAssets/EmptyChatAnimation.json";
import NoConversationPicked from "../../ChatAssets/NoConversationPicked.json";
import online from "../../ChatAssets/online.json";
import offline from "../../ChatAssets/offline.json";
import NoPickedConv from "../../ChatAssets/NoConversationchoiced.json";
import { Smiley, Image, Files, FadersHorizontal } from "phosphor-react";
import Lottie from "lottie-react";
import data from "@emoji-mart/data";
import Icon from "../../../../assets/Icon/icons.js";
import src from "../../ChatAssets/download.jpeg";
import Picker from "@emoji-mart/react";
import { UserMsgContext } from "../../Chat.jsx";
import { ChatListContext } from "../../Chat.jsx"

const ImportItem = ({ setImportClicked }) => {
  return (
    <svg
      onClick={() => setImportClicked((prev) => !prev)}
      className={styles.ImportButton}
      width="30"
      height="30"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.1996 0C5.02861 0 0 5.1635 0 11.5C0 17.8365 5.02861 23 11.1996 23C17.3706 23 22.3992 17.8365 22.3992 11.5C22.3992 5.1635 17.3706 0 11.1996 0ZM15.6794 12.3625H12.0395V16.1C12.0395 16.5715 11.6588 16.9625 11.1996 16.9625C10.7404 16.9625 10.3596 16.5715 10.3596 16.1V12.3625H6.71975C6.26057 12.3625 5.87978 11.9715 5.87978 11.5C5.87978 11.0285 6.26057 10.6375 6.71975 10.6375H10.3596V6.9C10.3596 6.4285 10.7404 6.0375 11.1996 6.0375C11.6588 6.0375 12.0395 6.4285 12.0395 6.9V10.6375H15.6794C16.1386 10.6375 16.5194 11.0285 16.5194 11.5C16.5194 11.9715 16.1386 12.3625 15.6794 12.3625Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  );
};

const SendMessage = () => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 23 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.286 0.243835C22.1378 0.115822 21.9576 0.0342628 21.7664 0.00866295C21.5753 -0.0169369 21.3811 0.0144765 21.2065 0.0992425L0.250977 10.3275V12.3067L9.05272 15.9678L14.6984 25H16.6021L22.617 1.32233C22.6658 1.12842 22.6606 0.924095 22.602 0.733153C22.5434 0.542212 22.4338 0.372516 22.286 0.243835ZM15.4268 23.1123L10.574 15.3485L18.0416 6.84337L16.86 5.72157L9.33401 14.293L2.07695 11.2744L20.7489 2.16046L15.4268 23.1123Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  );
};

const Emojies = ({ SetPicker }) => {
  return (
    <Smiley
      onClick={() => SetPicker((prev) => !prev)}
      className={styles.Emojie}
      size={40}
      color="#242424"
      weight="fill"
    />
  );
};

const InputField = ({ message, handleWritedMessage, inputRef }) => {
  return (
    <input
      ref={inputRef}
      className={styles.inputMessage}
      onChange={(e) => handleWritedMessage(e)}
      type="text"
      value={message}
      placeholder="write a message ... "
    />
  );
};

// { /*
// {
/* <div className={styles.DiscussionColors}>
<div onClick={handleColor1} className={styles.Color1}></div>
<div onClick={handleColor2} className={styles.Color2}></div>
<div onClick={handleColor3} className={styles.Color3}></div>
<div className={styles.Color4} style={{backgroundColor: MessageBackColor}}> </div>
</div>  */
// }
// const [MessageBackColor, setColor] = useState('');
//   function handleColor1(){
//     setColor('#22420d')
//   }
//   function handleColor2(){
//     setColor('#F62943');
//   }
//   function handleColor3(){
//     setColor('#333497');
//   }// }

const ChatHeader = () => {
  const PickedUserData = useContext(UserMsgContext);

  function handleParamsClick() {
    alert("Olaaala");
  }
  return (
    <div className={styles.ChatHeaderHolder}>
      {PickedUserData ? (
        <>
          <div className={styles.UserInfo}>
            <img
              className={styles.FriendPhoto}
              src={PickedUserData?.avatar}
              alt="Your-friend-photo"
            />

            <div className={styles.FriendNameAndStatus}>
              <div className={styles.FriendName}>
                {PickedUserData?.username}
              </div>

              <div className={styles.StatusHolder}>
                <div className={styles.StatusIcon}>
                  {" "}
                  <Lottie
                    animationData={PickedUserData?.status ? online : offline}
                  />{" "}
                </div>
                <div className={styles.Status}>
                  {" "}
                  {PickedUserData?.status ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ChatSettings}>
            <FadersHorizontal
              onClick={handleParamsClick}
              size={40}
              color="#6a6c74"
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

const ChatInput = () => {
  const PickedUserData = useContext(UserMsgContext);

  const [PickerClick, SetPicker] = useState(false);
  const [ImportItemsClicked, setImportClicked] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleWritedMessage(e) {
    setMessage(e.target.value);
  }

  function handleEmojieSelect(e) {
    const CursorPos = getCursorPosition();
    const start = message.substring(0, CursorPos);
    const end = message.substring(CursorPos);
    const NewMessage = start + e.native + end;
    setMessage(NewMessage);
  }

  const getCursorPosition = () => {
    if (inputRef.current) {
      return inputRef.current.selectionStart;
    }
    return -1;
  };

  function handleImageSelect(e) {
    console.log(e.target.files[0]);
    setSelectedImage(() => e.target.files[0]);
  }

  function handleFileSelect(e) {
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  }

  return (
    <div className={styles.ChatInputHolder}>
      {PickedUserData ? (
        <>
          <div
            className={styles.ImportOptions}
            style={{ display: ImportItemsClicked ? "flex" : "none" }}
          >
            <div className={styles.ImageBack}>
              <label htmlFor="uploadImagebtn">
                <Image className={styles.ImportImage} size={40} />{" "}
              </label>
              <input
                type="file"
                name="-photo-"
                id="uploadImagebtn"
                className="upload-input"
                onChange={handleImageSelect}
                accept="image/*"
              />
            </div>

            <div className={styles.FilesBack}>
              <label htmlFor="uploadFileBtn">
                {" "}
                <Files className={styles.ImportFiles} size={40} />{" "}
              </label>
              <input
                type="file"
                name="-FILE-"
                id="uploadFileBtn"
                className="upload-input"
                onChange={handleFileSelect}
                accept=".txt,.cpp,.c,.jsx,.py"
              />
            </div>
          </div>

          <div className={styles.inputMainDiv}>
            <ImportItem setImportClicked={setImportClicked} />
            <InputField
              inputRef={inputRef}
              message={message}
              handleWritedMessage={handleWritedMessage}
            />
            <Emojies SetPicker={SetPicker} />
            <SendMessage />
          </div>

          <div
            style={{ display: PickerClick ? "inline" : "none" }}
            className={styles.EmojiPicker}
          >
            <Picker
              theme="dark"
              data={data}
              onEmojiSelect={handleEmojieSelect}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

const MessageDisplayer = ({ message, IsIncoming }) => {
  const PickedUserData = useContext(UserMsgContext);

  return (
    <div className={IsIncoming ? styles.MsgIncom : styles.MsgOut}>
      <div className={IsIncoming ? styles.receiverAvatar : styles.MyAvatar}>
        <img
          className={styles.avatar}
          src={IsIncoming ? PickedUserData.avatar : src}
          alt="user-avatar"
        />
      </div>

      <div className={styles.msgContent}>
        <div className={IsIncoming ? styles.incoming : styles.outgoing}>
          {" "}
          {message}{" "}
        </div>
        <h1 className={IsIncoming ? styles.SendingTime : styles.SendingTimeout}>
          {" "}
          Time now 19:00{" "}
        </h1>
      </div>
    </div>
  );
};

const ChatMainHolder = () => {
  const PickedUserData = useContext(UserMsgContext);

  if (PickedUserData) {
    var { messages } = PickedUserData;
    var JoinedMessages = [...messages.incomingMsg, ...messages.outgoingMsgs];
  }

  return (
    <div className={styles.ChatMainHolder}>
      {PickedUserData ? (
        <div className={styles.ConversationMessages}>
          {JoinedMessages.map((elem, index) => {
            return index % 2 ? (
              <MessageDisplayer key={index} message={elem} IsIncoming={true} />
            ) : (
              <MessageDisplayer key={index} message={elem} IsIncoming={false} />
            );
          })}
        </div>
      ) : (
        <div className={styles.StartMessageHolder}>
          <div className={styles.NoPickedConvContainer}>
            {" "}
            <Lottie animationData={NoPickedConv} />{" "}
          </div>
          <div className={styles.QuoteContainer}>
            <blockquote className={styles.GoPickConversation}>
              {" "}
              Another Conversation Another World{" "}
            </blockquote>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageSection = () => {
  const ChatList = useContext(ChatListContext);

  return (
    <>
      {!ChatList?.length ? (
        <div className={styles.MessageSection}>
          <div className={styles.WelcomeChat}>
            <div className={styles.Animationstyles}>
              {" "}
              <Lottie animationData={EmptyChatAnimation} />
            </div>
            <blockquote className={styles.ChatQuote}>
              {" "}
              Unleash the power of connection! <br />
              Start chatting and discover what{" "}
              <span className={styles.Clunca}>Clunca </span> has to offer you .{" "}
            </blockquote>
          </div>
        </div>
      ) : (
        <div className={styles.MessageSectionFull}>
          <ChatHeader />
          <ChatMainHolder />
          <ChatInput />
        </div>
      )}
    </>
  );
};

export default MessageSection;

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { ConversationModel, MessageModel } = require('../models/conversatoinModel');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/userModel');
const getConversation = require('../helpers/getConversation');
const moment = require('moment'); // Import moment for date formatting

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Online user
const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log("Connected User ", socket.id);

  const token = socket.handshake.auth.token;

  if (!token) {
    console.error("No token provided by user", socket.id);
    socket.disconnect();
    return;
  }

  // Current user detail
  const user = await getUserDetailsFromToken(token);

  if (!user || user.logout) {
    console.error("Invalid token provided by user", socket.id);
    socket.disconnect();
    return;
  }

  // Create a room
  socket.join(user._id.toString());
  onlineUser.add(user._id.toString());

  io.emit('onlineUser', Array.from(onlineUser));

  socket.on('message-page', async (userid) => {
    console.log("userid:", userid);
    const userDetails = await UserModel.findById(userid).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userid),
    };
    socket.emit("message-user", payload);

    // Previous messages
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: userid },
        { sender: userid, receiver: user?._id },
      ],
    }).populate('messages').sort({ updatedAt: -1 });

    const currentDate = moment().format('YYYY-MM-DD');
    const messagesWithDateLabels = getConversationMessage?.messages.map((msg, index) => {
      const messageDate = moment(msg.createdAt).format('YYYY-MM-DD');
      const showDateLabel = (index === 0 || !moment(messageDate).isSame(currentDate, 'day'));
      return { ...msg.toObject(), showDateLabel };
    });

    socket.emit('message', messagesWithDateLabels || []);
  });

  // New message
  socket.on('new message', async (data) => {
    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    // If conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
      "$push": { messages: saveMessage?._id },
    });

    const allMessages = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    }).populate('messages').sort({ updatedAt: -1 });

    const currentDate = moment().format('YYYY-MM-DD');
    const messagesWithDateLabels = allMessages.messages.map((msg, index) => {
      const messageDate = moment(msg.createdAt).format('YYYY-MM-DD');
      const showDateLabel = (index === 0 || !moment(messageDate).isSame(currentDate, 'day'));
      return { ...msg.toObject(), showDateLabel };
    });

    io.to(data?.sender).emit('message', messagesWithDateLabels);
    io.to(data?.receiver).emit('message', messagesWithDateLabels);

    // Send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit('conversation', conversationSender);
    io.to(data?.receiver).emit('conversation', conversationReceiver);
  });

  // Sidebar
  socket.on('sidebar', async (currentUserId) => {
    console.log("current user", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit('conversation', conversation);
  });

  socket.on('seen', async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await MessageModel.updateMany(
      { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
      { "$set": { seen: true } }
    );

    // Send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit('conversation', conversationSender);
    io.to(msgByUserId).emit('conversation', conversationReceiver);
  });

  socket.on('disconnect', () => {
    onlineUser.delete(user?._id?.toString());
    console.log('Disconnected user ', socket.id);
  });
});

module.exports = {
  app,
  server
};

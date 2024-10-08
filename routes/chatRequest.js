const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const ChatRequest = require('../models/chatRequest');

// Отправка запроса на общение
router.post('/chat-request', async (req, res) => {
  const { from, to } = req.body;
  
  try {
      const existingRequest = await ChatRequest.findOne({ from, to });
      if (existingRequest) {
        return res.status(400).json({ msg: 'Запрос уже отправлен' });
      }

      const chatRequest = new ChatRequest({ from, to });
      console.log(to);
      console.log('here we are saving new chat request');

      
      await chatRequest.save();
      res.status(200).json({ msg: 'Запрос на общение отправлен' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
});

router.post('/getAllChatRequestsByUserId', async (req,res) => {
  // take user id and check if he has any pending requests
    console.log(req.body);
    const { to } = req.body;


    try
    {
        const userRequests = await ChatRequest.find({to});
        console.log(userRequests);
        if(userRequests.length === 0)
          return res.status(400).json({msg: 'no requests'});
        else
          return res.json(requests);

    }
    catch (e)
    {
      res.status(500).json({msg:e.message});
    }
});


// Обновление статуса запроса
router.post('/respond-chat-request', async (req, res) => {
  const { requestId, status } = req.body;
  
  try {
    const chatRequest = await ChatRequest.findById(requestId);
    if (!chatRequest) {
      return res.status(404).json({ msg: 'Запрос не найден' });
    }

    chatRequest.status = status;
    await chatRequest.save();

    res.status(200).json({ msg: `Запрос был ${status === 'accepted' ? 'принят' : 'отклонен'}` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


// Отправка сообщения
router.post('/send-message', async (req, res) => {
  const { from, to, content } = req.body;

  try {
    const chatRequest = await ChatRequest.findOne({ from, to, status: 'accepted' });
    if (!chatRequest) {
      return res.status(403).json({ msg: 'Общение не разрешено' });
    }

    const message = new Message({ from, to, content });
    await message.save();
    res.status(200).json({ msg: 'Сообщение отправлено', message });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});



module.exports = router;

const Message = require('../models/Message');
const ChatRequest = require('../chatRequest');


// // Отправка сообщения
// router.post('/send-message', async (req, res) => {
//   const { from, to, content } = req.body;

//   try {
//     const chatRequest = await ChatRequest.findOne({ from, to, status: 'accepted' });
//     if (!chatRequest) {
//       return res.status(403).json({ msg: 'Общение не разрешено' });
//     }

//     const message = new Message({ from, to, content });
//     await message.save();
//     res.status(200).json({ msg: 'Сообщение отправлено', message });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

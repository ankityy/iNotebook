const mongoose = require('mongoose');

  const NotesSchema = new Schema({
      title: {
          type: String,
          required: true
      },
      description: {
        type: String,
        required: true,
      },
      tag: {
        type: String,
        default: 'general'
      },
      date: {
        type: Data,
          default: Date.now
    },
      
  });

module.exports = mongoose.model('notes', NotesSchema);
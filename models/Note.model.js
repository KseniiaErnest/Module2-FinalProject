const { Schema, model, default: mongoose} = require('mongoose');

const noteSchema = new Schema(
  {
    title: String,
    content: String,
    belongToCard: {type: mongoose.Types.ObjectId, ref: 'FlashCard'},
    composedByUser: { type: mongoose.Types.ObjectId, ref: 'User' }
  },
  {timestamps: true}
);

const Note = model('Note', noteSchema);

module.exports = Note;

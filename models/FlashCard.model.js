const { Schema, model, default: mongoose} = require('mongoose');

const flashCardSchema = new Schema(
  {
    kanji: String,
    meaning: String,
    onyomi: String,
    kunyomi: String,
    strokes: Number,
    grade: String,
    examples: [
      {
      text: String,
      audio: {type: String, default: null}
    }],
    link: String,
    strokeOrder: String,
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    createdByUser: {
      type: Boolean,
      default: true
    }
  }
)


const FlashCard = model('FlashCard', flashCardSchema);
module.exports = FlashCard;
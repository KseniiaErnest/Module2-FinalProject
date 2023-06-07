const { Schema, model} = require('mongoose');

const flashCardSchema = new Schema(
  {
    kanji: String,
    meaning: String,
    onyomi: String,
    kunyomi: String,
    strokes: Number,
    grade: String,
    examples: [{
      text: String,
      audio: {type: String, default: null}
    }],
    link: String,
    strokeOrder: [String]
  }
)


const FlashCard = model('FlashCard', flashCardSchema);
module.exports = FlashCard;
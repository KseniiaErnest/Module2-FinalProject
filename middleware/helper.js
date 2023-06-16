const checkKanjiInFlashcards = (theUserObject) => (req, res, next) => {
  const kanjiCharacter = req.params.character;
  const isInFlashcards = theUserObject.flashCards.some((flashcard) => flashcard.kanji === kanjiCharacter);
  res.locals.isInFlashcards = isInFlashcards;
  next();
};

module.exports = { checkKanjiInFlashcards };
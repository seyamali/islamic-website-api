const DailyContent = require('../models/DailyContent');

const getHadithOfTheDay = async (req, res, next) => {
  try {
    const hadith = await DailyContent.findOne({ type: 'hadith', isActive: true }).sort({ createdAt: -1 });
    if (!hadith) return res.status(404).json({ error: 'No Hadith found' });
    
    res.json({
      collection: hadith.collection,
      book: hadith.book,
      narrator: hadith.narrator,
      arabic: hadith.arabic,
      translation: hadith.translation,
      explanation: hadith.explanation
    });
  } catch (error) {
    next(error);
  }
};

const getDuaOfTheDay = async (req, res, next) => {
  try {
    const dua = await DailyContent.findOne({ type: 'dua', isActive: true }).sort({ createdAt: -1 });
    if (!dua) return res.status(404).json({ error: 'No Dua found' });

    res.json({
      title: dua.title,
      arabic: dua.arabic,
      translation: dua.translation,
      reference: dua.reference
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHadithOfTheDay,
  getDuaOfTheDay
};

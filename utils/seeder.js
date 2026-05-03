const DailyContent = require('../models/DailyContent');

const seedDailyContent = async () => {
  try {
    const count = await DailyContent.countDocuments();
    if (count > 0) return;

    console.log('Seeding daily content (Hadith and Dua)...');

    const contents = [
      {
        type: 'hadith',
        collection: 'Sahih Bukhari',
        book: 'Book 1, Hadith 1',
        narrator: 'Umar ibn Al-Khattab (RA)',
        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        translation: 'Actions are judged by intentions, and every person will have what they intended.',
        explanation: 'This foundational hadith teaches that the validity and reward of any action depends entirely upon the sincerity of one\'s intention.'
      },
      {
        type: 'dua',
        title: 'Dua for Good Health',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
        translation: 'O Allah, I ask You for good health.',
        reference: 'Sunan Abu Dawood'
      }
    ];

    await DailyContent.insertMany(contents);
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedDailyContent;

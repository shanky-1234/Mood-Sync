export const getMoodState = (mood, energy) => {
  if (mood >= 85 && energy >= 80) {
    return {
      key: 'excellent',
      label: 'Excellent & Energized',
      image: require('../../assets/mascot/excellent.png'),
    };
  }

  if (mood >= 70 && energy >= 60) {
    return {
      key: 'cheerful',
      label: 'Cheerful',
      image: require('../../assets/mascot/cheerful.png'),
    };
  }

  if (mood >= 55 && energy >= 50) {
    return {
      key: 'neutral',
      label: 'Balanced',
      image: require('../../assets/mascot/neutral.png'),
    };
  }

  if (mood >= 40 && energy < 50) {
    return {
      key: 'tired',
      label: 'Tired',
      image: require('../../assets/mascot/tired.png'),
    };
  }

  if (mood < 40 && energy >= 40) {
    return {
      key: 'annoyed',
      label: 'Annoyed',
      image: require('../../assets/mascot/annoyed.png'),
    };
  }

  if (mood < 30 && energy < 40) {
    return {
      key: 'sad',
      label: 'Sad & Low',
      image: require('../../assets/mascot/sad.png'),
    };
  }

  return {
    key: 'broken',
    label: 'Overwhelmed',
    image: require('../../assets/mascot/broken.png'),
  };
};

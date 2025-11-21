import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fil';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations for key UI elements
const translations = {
  en: {
    'nav.home': '🏠 Home',
    'nav.games': '🎮 Games', 
    'nav.learn': '📚 Learn',
    'nav.profile': '👤 Profile',
    'nav.admin': '⚙️ Admin',
    'age.kindergarten': 'Kindergarten',
    'age.grade1': 'Grade 1',
    'age.grade2': 'Grade 2', 
    'age.grade3': 'Grade 3',
    'fire.hot': '🔥 Fire is Hot!',
    'fire.hot.content': 'Fire is very hot and can hurt you. Never touch fire or play with matches and lighters. Tell a grown-up if you see fire.',
    'stop.drop.roll': '🛑 Stop, Drop, and Roll!',
    'stop.drop.roll.content': 'If your clothes catch fire: STOP moving, DROP to the ground, and ROLL back and forth until the fire is out. Cover your face with your hands.',
    'call.911': '🚨 Call 911',
    'call.911.content': 'If there\'s a fire, call 911 right away! Tell the operator your name, address, and that there\'s a fire. Stay calm and speak clearly.',
    'get.low.go': '🚪 Get Low and Go!',
    'get.low.go.content': 'If there\'s smoke, crawl on your hands and knees. Smoke rises up, so the air near the floor is cleaner. Stay low and crawl to safety!',
    'two.ways.out': '🏠 Know Two Ways Out',
    'two.ways.out.content': 'Every room should have two ways to get out. Practice finding both doors and windows. Know where your family meeting place is outside.',
    'never.hide': '🚫 Never Hide!',
    'never.hide.content': 'If there\'s a fire, never hide under the bed or in a closet. Firefighters need to find you quickly. Go outside to your meeting place.',
    'dont.play.fire': '🔥 Don\'t Play with Fire',
    'dont.play.fire.content': 'Matches, lighters, and candles are not toys. They can start fires that hurt people and homes. Only grown-ups should use them.',
    'firefighters.helpers': '👨‍🚒 Firefighters are Helpers',
    'firefighters.helpers.content': 'Firefighters wear special clothes and masks to help people. Don\'t be scared! They are here to help you and your family.',
    'close.doors': '🚪 Close Doors Behind You',
    'close.doors.content': 'When you leave a room during a fire, close the door behind you. This helps slow down the fire and gives you more time to escape.',
    'get.out.fast': '🏃‍♂️ Get Out Fast!',
    'get.out.fast.content': 'If you hear a smoke alarm or see fire, get out of the house right away! Don\'t stop to get toys or pets. Just get out safely!'
  },
  fil: {
    'nav.home': '🏠 Tahanan',
    'nav.games': '🎮 Laro',
    'nav.learn': '📚 Matuto',
    'nav.profile': '👤 Profile',
    'nav.admin': '⚙️ Admin',
    'age.kindergarten': 'Kindergarten',
    'age.grade1': 'Baitang 1',
    'age.grade2': 'Baitang 2',
    'age.grade3': 'Baitang 3',
    'fire.hot': '🔥 Mainit ang Apoy!',
    'fire.hot.content': 'Napakainit ng apoy at makakasakit ito sa iyo. Huwag hawakan ang apoy o maglaro ng posporo at lighter. Sabihin sa matanda kapag may nakita kang apoy.',
    'stop.drop.roll': '🛑 Huminto, Lumuhod, at Gumulong!',
    'stop.drop.roll.content': 'Kung nasusunog ang damit mo: HUMINTO sa paggalaw, LUHOD sa sahig, at GUMULONG pabalik-balik hanggang mamatay ang apoy. Takpan ang mukha mo ng kamay.',
    'call.911': '🚨 Tawagan ang 911',
    'call.911.content': 'Kung may sunog, tawagan agad ang 911! Sabihin sa operator ang pangalan mo, address, at may sunog. Manatiling kalmado at magsalita nang malinaw.',
    'get.low.go': '🚪 Lumuhod at Lumakad!',
    'get.low.go.content': 'Kung may usok, gumapang sa kamay at tuhod. Tumataas ang usok, kaya mas malinis ang hangin sa sahig. Manatiling mababa at gumapang patungo sa kaligtasan!',
    'two.ways.out': '🏠 Alamin ang Dalawang Daan',
    'two.ways.out.content': 'Bawat silid ay dapat may dalawang daan palabas. Magsanay sa paghahanap ng mga pinto at bintana. Alamin kung saan ang meeting place ng pamilya sa labas.',
    'never.hide': '🚫 Huwag Magtago!',
    'never.hide.content': 'Kung may sunog, huwag magtago sa ilalim ng kama o sa aparador. Kailangan ka ng mga bumbero na mahanap agad. Pumunta sa labas sa meeting place.',
    'dont.play.fire': '🔥 Huwag Maglaro ng Apoy',
    'dont.play.fire.content': 'Ang posporo, lighter, at kandila ay hindi laruan. Maaari silang magsimula ng sunog na makakasakit sa mga tao at bahay. Ang mga matanda lang ang dapat gumamit.',
    'firefighters.helpers': '👨‍🚒 Ang mga Bumbero ay Tumutulong',
    'firefighters.helpers.content': 'Ang mga bumbero ay nagsusuot ng espesyal na damit at maskara para tumulong sa mga tao. Huwag matakot! Nandito sila para tumulong sa iyo at sa pamilya mo.',
    'close.doors': '🚪 Isara ang mga Pinto',
    'close.doors.content': 'Kapag lumabas ka ng silid habang may sunog, isara ang pinto. Nakakatulong ito na mapabagal ang sunog at bigyan ka ng mas maraming oras para tumakas.',
    'get.out.fast': '🏃‍♂️ Lumabas Agad!',
    'get.out.fast.content': 'Kung marinig mo ang smoke alarm o makita ang apoy, lumabas agad ng bahay! Huwag huminto para kunin ang mga laruan o alaga. Lumabas lang nang ligtas!'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}







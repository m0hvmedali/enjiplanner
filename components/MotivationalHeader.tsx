import React from 'react';

const MotivationalHeader: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md border-b border-white/10 p-4 text-center sticky top-0 z-50 shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
        ✨ اليوم الناجح = 60-70% من الخطة ✨
      </h2>
      <p className="text-sm text-gray-300 mt-1">
        نفسيتك أولوية. أي تعب = إيقاف محترم، مش جلد ذات.
      </p>
    </div>
  );
};

export default MotivationalHeader;
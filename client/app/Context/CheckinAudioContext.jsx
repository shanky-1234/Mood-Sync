import React, { createContext, useContext, useState } from "react";

const CheckInAudioContext = createContext(null);

export const CheckInAudioProvider = ({ children }) => {
  const [isCheckInSoundPlaying, setIsCheckInSoundPlaying] = useState(true);

  return (
    <CheckInAudioContext.Provider
      value={{ isCheckInSoundPlaying, setIsCheckInSoundPlaying }}
    >
      {children}
    </CheckInAudioContext.Provider>
  );
};

export const useCheckInAudio = () => {
  const context = useContext(CheckInAudioContext);

  if (!context) {
    throw new Error("useCheckInAudio must be used inside CheckInAudioProvider");
  }

  return context;
};
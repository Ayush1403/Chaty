import React, { useState, useEffect } from "react";
import { themeState } from "../store/themeState";

const themesList = [
  "light","dark","cupcake","bumblebee","emerald","corporate",
  "synthwave","retro","cyberpunk","valentine","halloween",
  "garden","forest","aqua","lofi","pastel","fantasy",
  "wireframe","black","luxury","dracula","cmyk","autumn",
  "business","acid","lemonade","night","coffee","winter",
  "dim","nord","sunset"
];

const swatchVars = ["--p", "--s", "--a", "--n", "--b1"];

const Settings = () => {
  const { theme, setTheme } = themeState();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  const handleSelectTheme = (t) => {
    setSelectedTheme(t);
    setTheme(t);
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {themesList.map((t) => (
          <div
            key={t}
            data-theme={t}
            onClick={() => handleSelectTheme(t)}
            className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center transition ${
              selectedTheme === t ? "ring-2 ring-primary scale-105" : "hover:scale-105"
            }`}
          >
            <div className="flex gap-1 mb-2">
              {swatchVars.map((v, i) => (
                <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: `hsl(var(${v}))` }} />
              ))}
            </div>
            <p className="text-xs font-medium capitalize">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;

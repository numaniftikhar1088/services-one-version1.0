import React, { useState } from "react";
import { templates, Template } from "./templates";

const TemplateSelector: React.FC = () => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const currentTemplate: Template = templates[currentTemplateIndex];
  const handleNext = () => {
    if (currentTemplateIndex < templates.length - 1) {
      setCurrentTemplateIndex(currentTemplateIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentTemplateIndex > 0) {
      setCurrentTemplateIndex(currentTemplateIndex - 1);
    }
  };

  return (
    <div>
      <h2>{currentTemplate.name}</h2>
      <p>{currentTemplate.content}</p>
      <button
        className="btn btn-lg p-2"
        onClick={handlePrevious}
        disabled={currentTemplateIndex === 0}
      >
        <i className="fa fa-angle-double-left"></i>
      </button>

      <button
        className="btn btn-lg p-2"
        onClick={handleNext}
        disabled={currentTemplateIndex === templates.length - 1}
      >
        <i className="fa fa-angle-double-right"></i>
      </button>
    </div>
  );
};

export default TemplateSelector;

import React from 'react';
import { inputChild } from './ResultingRule';
import useLang from 'Shared/hooks/useLanguage';

interface PropsI {
  child?: inputChild[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    mainIndex: number,
    resultRuleIndex?: number
  ) => void;
  mainIndex: number;
  section: Record<string, string>;
  resultRuleIndex?: number;
}

const InputMask: React.FC<PropsI> = ({
  mainIndex,
  onChange,
  child,
  section,
  resultRuleIndex,
}) => {
  const { t } = useLang();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      onChange(e, mainIndex, resultRuleIndex); // Ensure resultRuleIndex is passed
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center custom-masked-input">
      <input
        id={`ResultingRules${child?.[0].name}${mainIndex + 1}`}
        type="text"
        value={section[child?.[0].name ?? '']}
        name={child?.[0].name ?? ''}
        onChange={handleInputChange}
        placeholder={t(child?.[0].placeholder ?? '')}
      />
      <span className="dashh">-</span>
      <input
        id={`ResultingTules${child?.[1].name}${mainIndex + 1}`}
        type="text"
        value={section[child?.[1].name ?? '']}
        name={child?.[1].name ?? ''}
        onChange={handleInputChange}
        placeholder={t(child?.[1].placeholder ?? '')}
      />
    </div>
  );
};

export default InputMask;

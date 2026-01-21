import React from 'react'
import useLang from 'Shared/hooks/useLanguage';
interface StatusProps {
  cusText: string;
  cusClassName: string;
}

const Status: React.FC<StatusProps> = ({ cusText, cusClassName }) => {
  const { t } = useLang();
  return (
    <span className={`badge badge-pill px-4 py-2 my-1 rounded-4 fw-400 fa-1x ${t(cusClassName)}`}>
      {t(cusText)}
    </span>
  );
};

export default Status;
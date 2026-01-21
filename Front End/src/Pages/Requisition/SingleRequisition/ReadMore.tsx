import { useState } from "react";
import useLang from "Shared/hooks/useLanguage";

const ReadMore = (props: any) => {
  console.log(props, "Readmore");
  const text = props.label;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const { t } = useLang()
  return (
    <p className="text">
      {isReadMore ? text.slice(0, props.length) : text}
      <span
        onClick={toggleReadMore}
        className="read-or-hide text-success cursor-pointer"
      >
        {isReadMore ? t("... Read more") : t("Show less")}
      </span>
    </p>
  );
};

export default ReadMore;

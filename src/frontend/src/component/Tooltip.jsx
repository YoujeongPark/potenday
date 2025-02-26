import { useState, useEffect, useRef } from "react";
import { tooltip } from "../assets/images.js";

const Tooltip = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef(null); // 바깥 클릭 감지

  const toggleTooltip = () => {
    setIsTooltipVisible((prev) => !prev);
  };

  useEffect(() => {
    const clickOutside = (event) => { // 바깥 클릭 시 닫힘
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsTooltipVisible(false);
      }
    };

    if (isTooltipVisible) {
      document.addEventListener("mousedown", clickOutside);
    } else {
      document.removeEventListener("mousedown", clickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [isTooltipVisible]);

  return (
    <div ref={tooltipRef} className="tooltip">
      <div className="icon" onClick={toggleTooltip}>
        <object data={String(tooltip)} type="image/svg+xml" />
      </div>
      {isTooltipVisible && (
        <div className="tooltip-box">
          <p>
            대체어는 국립국어원에서 선정한 <br />
            신조어를 대체할 우리말입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

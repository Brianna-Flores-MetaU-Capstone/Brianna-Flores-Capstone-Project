import { useState, useRef, useEffect } from "react";
import { TourStep } from "../../classes/calendar/TourStep";
import "./CalendarTour.css";
import { PositionsEnum } from "../../utils/calendarTour/CalendarTourSteps";

type GPCalendarTourType = {
  tourSteps: TourStep[];
  tourActive: boolean;
  onClose: () => void;
};

const CalendarTourTooltip = ({
  tourSteps,
  tourActive,
  onClose,
}: GPCalendarTourType) => {
  // keep track of what step in the tutorial we are on
  const [currentStep, setCurrentStep] = useState(0);
  // holds the tooltips reference in the myRef variable
  const tooltipLocationRef = useRef<HTMLDivElement>(null);
  const [tooltipPositioning, setTooltipPositioning] = useState({});
  const [highlightPositioning, setHighlightPositioning] = useState({});

  const positionTooltip = () => {
    if (!tourActive || tourSteps.length === 0) {
      return;
    }
    const tooltipTarget = document.querySelector(
      tourSteps[currentStep].selectElement
    );
    if (!tooltipTarget) {
      return;
    }
    // get size and position of an element
    const targetRect = tooltipTarget.getBoundingClientRect();

    // highlight the element that the tooltip is referencing
    setHighlightPositioning({
      top: `${targetRect.top}px`,
      left: `${targetRect.left}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
    });

    // set tooltip position
    const tooltipWidth = 300;
    const tooltipHeight =
      tooltipLocationRef.current?.getBoundingClientRect().height || 200;
    let top = targetRect.top;
    let left = targetRect.right;

    switch (tourSteps[currentStep].position) {
      case PositionsEnum.RIGHT:
        top = targetRect.top;
        left = targetRect.right;
        break;
      case PositionsEnum.TOP:
        top = targetRect.top - tooltipHeight;
        left = targetRect.left;
        break;
      case PositionsEnum.BOTTOM:
        top = targetRect.bottom;
        left = targetRect.left;
        break;
      case PositionsEnum.LEFT:
        top = targetRect.top;
        left = targetRect.left - tooltipWidth;
        break;
    }

    setTooltipPositioning({
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
    });
  };

  // calculate new position when the step changes
  useEffect(() => {
    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    return () => {
      window.removeEventListener("resize", positionTooltip);
    };
  }, [currentStep, tourActive]);

  const handleNextStepClick = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
      onClose();
    }
  };

  const handleCloseInstructions = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!tourActive || tourSteps.length === 0) return null;

  return (
    <div className="entirePage">
      <div className="highlightElement" style={highlightPositioning}></div>
      <div
        className="tooltip"
        ref={tooltipLocationRef}
        style={{ ...tooltipPositioning }}
      >
        <div className="tooltipContent">
          <button className="closeTooltip" onClick={handleCloseInstructions}>
            x
          </button>
          <p>{tourSteps[currentStep].description}</p>
          <div className="tooltipNavButtons">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Prev
            </button>
            <p>
              Step {currentStep + 1} of {tourSteps.length}
            </p>
            <button onClick={handleNextStepClick}>
              {currentStep === tourSteps.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
      <div className="blurBackground"></div>
    </div>
  );
};

export default CalendarTourTooltip;

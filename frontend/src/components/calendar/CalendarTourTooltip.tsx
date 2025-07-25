import { useState, useRef, useEffect } from "react";
import { TourStep } from "../../classes/calendar/TourStep";
import "./CalendarTour.css";

type GPCalendarTourType = {
  tourSteps: TourStep[];
  tourActive: boolean;
  onClose: () => void;
  onFinish: () => void;
};

const CalendarTourTooltip = ({
  tourSteps,
  tourActive,
  onClose,
  onFinish,
}: GPCalendarTourType) => {
  // keep track of what step in the tutorial we are on
  const [currentStep, setCurrentStep] = useState(0);
  // holds the tooltips reference in the myRef variable
  const tooltipLocationRef = useRef<HTMLDivElement>(null);
  const [tooltipPositioning, setTooltipPositioning] = useState({});

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

    // set tooltip position
    const tooltipWidth = 300;
    const top = targetRect.top;
    const left = targetRect.right;

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
      onFinish();
    }
  };

  if (!tourActive || tourSteps.length === 0) return null;

  return (
    // ref used to acess DOM element, places element into myRef.current
    <div
      ref={tooltipLocationRef}
      style={{ ...tooltipPositioning, position: "fixed", zIndex: 10 }}
    >
      <div className="tooltipContent">
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
          <button onClick={handleNextStepClick}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarTourTooltip;

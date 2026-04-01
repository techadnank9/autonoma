import posthog, { DisplaySurveyType, SurveyPosition } from "posthog-js";

const FEEDBACK_SURVEY_ID = "019d45e1-6880-0000-453b-2ba629c7c5cb";

export function openFeedbackSurvey() {
  posthog.displaySurvey(FEEDBACK_SURVEY_ID, {
    displayType: DisplaySurveyType.Popover,
    position: SurveyPosition.MiddleCenter,
    ignoreConditions: true,
    ignoreDelay: true,
  });
}

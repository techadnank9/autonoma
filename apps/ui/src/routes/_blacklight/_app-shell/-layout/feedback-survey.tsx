import posthog, { DisplaySurveyType, SurveyPosition } from "posthog-js";

const FEEDBACK_SURVEY_ID = "019d4b13-3363-0000-8cce-47d6b098a42e";

export function openFeedbackSurvey() {
  posthog.displaySurvey(FEEDBACK_SURVEY_ID, {
    displayType: DisplaySurveyType.Popover,
    position: SurveyPosition.MiddleCenter,
    ignoreConditions: true,
    ignoreDelay: true,
  });
}

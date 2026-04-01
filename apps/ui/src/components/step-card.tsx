import { Card, CardContent, InteractionBadge, stepInstruction } from "@autonoma/blacklight";
import { ScreenshotLightbox } from "./screenshot-lightbox";

interface StepCardProps {
  order: number;
  params: object;
  interaction: string;
  screenshotBefore?: string | null;
  screenshotAfter?: string | null;
  message?: string | null;
}

export function StepCard({ order, params, interaction, screenshotBefore, screenshotAfter, message }: StepCardProps) {
  const showScreenshotPanel = screenshotBefore !== undefined || screenshotAfter !== undefined;
  const screenshot = screenshotAfter ?? screenshotBefore;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {showScreenshotPanel && (
            <div className="w-64 shrink-0 bg-gray-50 border-r border-gray-100">
              {screenshot != null ? (
                <ScreenshotLightbox
                  src={screenshot}
                  alt={`Step ${order} screenshot`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-24 text-xs text-gray-400">
                  No screenshot
                </div>
              )}
            </div>
          )}

          <div className="flex-1 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">#{order}</span>
              <p className="text-sm font-medium text-gray-900">{stepInstruction({ interaction, params })}</p>
            </div>
            <div className="mt-2">
              <InteractionBadge interaction={interaction} />
            </div>
            {message != null && <p className="mt-2 text-xs text-gray-500">{message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

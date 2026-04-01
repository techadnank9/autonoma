import { type Logger, logger } from "@autonoma/logger";
import type { Command, CommandSpec } from "../../commands";
import { MemoryStore } from "../../execution-agent/agent/memory";
import type { BaseCommandContext, Installer, ScreenDriver, VideoRecorder } from "../../platform";
import { ReplayEngine } from "../engine/replay-engine";
import type { ReplayResult } from "../engine/replay-engine";
import type { ReplayEventHandlers } from "../engine/replay-events";
import type { ReplayStep } from "../engine/replay-step";
import type { WaitConditionChecker } from "../engine/wait-condition-checker";

export interface ReplayRunnerConfig<TSpec extends CommandSpec, TApplicationData, TContext extends BaseCommandContext> {
    installer: Installer<TApplicationData, TContext>;
    commands: Command<TSpec, TContext>[];
    eventHandlers: ReplayEventHandlers<TSpec>;

    /**
     * Factory to create a {@link WaitConditionChecker} once the {@link ScreenDriver} is available
     * (after the installer runs). This defers construction to {@link setup} time.
     */
    createWaitChecker: (screen: ScreenDriver) => WaitConditionChecker;
}

export interface ReplayRunResult<TSpec extends CommandSpec> {
    result: ReplayResult<TSpec>;
    videoPath: string;
}

export class ReplayRunner<TSpec extends CommandSpec, TApplicationData, TContext extends BaseCommandContext> {
    private readonly logger: Logger;

    private context?: TContext;
    private videoRecorder?: VideoRecorder;
    private waitChecker?: WaitConditionChecker;

    protected readonly memory = new MemoryStore();

    constructor(private readonly config: ReplayRunnerConfig<TSpec, TApplicationData, TContext>) {
        this.logger = logger.child({ name: "ReplayRunner" });
    }

    async setup(applicationData: TApplicationData): Promise<void> {
        this.logger.info("Starting replay runner setup...");

        const { installer, eventHandlers, createWaitChecker } = this.config;

        const { context, imageStream, videoRecorder } = await installer.install(applicationData);

        this.context = context;
        this.videoRecorder = videoRecorder;
        this.waitChecker = createWaitChecker(context.screen);

        imageStream.addFrameHandler(eventHandlers.frame);
        // TODO: Start video

        this.logger.info("Setup completed successfully");
    }

    async run(steps: ReplayStep<TSpec>[]): Promise<ReplayRunResult<TSpec>> {
        this.logger.info("Running replay...", { stepCount: steps.length });

        if (this.context == null || this.videoRecorder == null || this.waitChecker == null) {
            throw new Error("Replay runner not setup. Call setup() first.");
        }

        const engine = new ReplayEngine<TSpec, TContext>({
            commands: this.config.commands,
            waitChecker: this.waitChecker,
            eventHandlers: this.config.eventHandlers,
            context: this.context,
            memory: this.memory,
        });

        const result = await this.videoRecorder.withRecording(() => engine.replay(steps));
        const videoPath = await this.videoRecorder.getVideoPath();

        this.logger.info("Replay finished", {
            success: result.success,
            stepCount: result.state.executedSteps.length,
        });

        return { result, videoPath };
    }
}

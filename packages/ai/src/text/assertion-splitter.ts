import z from "zod";
import { ObjectGenerator } from "../object/object-generator";
import type { LanguageModel } from "../registry/model-registry";

export const ASSERTION_SPLITTER_SYSTEM_PROMPT =
    "You will receive a user instruction for true/false assertions on an image of a " +
    "website or mobile app. Sometimes the user may only send one assertion, like 'validate that there's a" +
    " title that says ...'. Some other times, the user might send multiple assertions 'check that the button " +
    "is disabled and validate that the password is not filled'. \n\nYour task is to take the instruction and " +
    "split it into all the possible assertions. \n\nASSERTION PARSING: If the split sentence has incomplete information, fix it. \nExample: let's say yo have the original sentence as 'validate that the title is visible, the subtitle as well but the button is not', if you split the sentences as ['validate that the title is visible', 'the subtitle as well', 'the button is not'] it won't make sense because you lack information to do the assertion. The correct split sentences must have enough information to do the full assertion without any additional context: ['validate that the title is visible', 'validate that the subtitle is visible', 'validate that the button is not visible']).";

const assertionSplitterSchema = z.object({
    assertions: z.array(z.string()).describe("The parsed assertions"),
});

type AssertionSplitterResult = z.infer<typeof assertionSplitterSchema>;

/**
 * Splits a user instruction into individual assertions that can be checked independently.
 */
export class AssertionSplitter extends ObjectGenerator<AssertionSplitterResult> {
    constructor(model: LanguageModel) {
        super({
            model,
            systemPrompt: ASSERTION_SPLITTER_SYSTEM_PROMPT,
            schema: assertionSplitterSchema,
        });
    }

    async splitAssertions(instruction: string): Promise<AssertionSplitterResult> {
        return this.generate({ userPrompt: instruction });
    }
}

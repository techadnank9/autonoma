import type { CostCollector, CostRecord } from "@autonoma/ai";
import { logger as rootLogger } from "@autonoma/logger";

const logger = rootLogger.child({ name: "cost-summary" });

interface AggregatedEntry {
    calls: number;
    costMicrodollars: number;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    cacheReadTokens: number;
}

function emptyEntry(): AggregatedEntry {
    return { calls: 0, costMicrodollars: 0, inputTokens: 0, outputTokens: 0, reasoningTokens: 0, cacheReadTokens: 0 };
}

function aggregateBy(records: readonly CostRecord[], keyFn: (r: CostRecord) => string): Map<string, AggregatedEntry> {
    const map = new Map<string, AggregatedEntry>();
    for (const r of records) {
        const key = keyFn(r);
        const entry = map.get(key) ?? emptyEntry();
        entry.calls++;
        entry.costMicrodollars += r.costMicrodollars;
        entry.inputTokens += r.inputTokens;
        entry.outputTokens += r.outputTokens;
        entry.reasoningTokens += r.reasoningTokens;
        entry.cacheReadTokens += r.cacheReadTokens;
        map.set(key, entry);
    }
    return map;
}

function sortedEntries(map: Map<string, AggregatedEntry>): [string, AggregatedEntry][] {
    return [...map.entries()].sort((a, b) => b[1].costMicrodollars - a[1].costMicrodollars);
}

function formatDollars(microdollars: number): string {
    return `$${(microdollars / 1_000_000).toFixed(4)}`;
}

function formatPercent(part: number, total: number): string {
    if (total === 0) return "0%";
    return `${((part / total) * 100).toFixed(1)}%`;
}

function formatTokens(entry: AggregatedEntry): string {
    const parts: string[] = [`${entry.inputTokens} in`, `${entry.outputTokens} out`];
    if (entry.reasoningTokens > 0) parts.push(`${entry.reasoningTokens} reasoning`);
    if (entry.cacheReadTokens > 0) parts.push(`${entry.cacheReadTokens} cached`);
    return parts.join(", ");
}

export function printCostSummary(costCollector: CostCollector) {
    const records = costCollector.getRecords();
    if (records.length === 0) return;

    const totalCost = records.reduce((sum, r) => sum + r.costMicrodollars, 0);
    const totalInput = records.reduce((sum, r) => sum + r.inputTokens, 0);
    const totalOutput = records.reduce((sum, r) => sum + r.outputTokens, 0);
    const totalReasoning = records.reduce((sum, r) => sum + r.reasoningTokens, 0);
    const totalCached = records.reduce((sum, r) => sum + r.cacheReadTokens, 0);

    logger.info("=== AI Cost Summary ===");
    logger.info(`Total: ${formatDollars(totalCost)} across ${records.length} calls`);
    logger.info(
        `Tokens: ${totalInput} input, ${totalOutput} output, ${totalReasoning} reasoning, ${totalCached} cached`,
    );
    logger.info("");

    const byTag = aggregateBy(records, (r) => r.tag);
    logger.info("Cost by category (sorted by cost):");
    for (const [tag, entry] of sortedEntries(byTag)) {
        const pct = formatPercent(entry.costMicrodollars, totalCost);
        logger.info(
            `  ${tag}: ${formatDollars(entry.costMicrodollars)} (${pct}) - ${entry.calls} calls, ${formatTokens(entry)}`,
        );
    }
    logger.info("");

    const byModel = aggregateBy(records, (r) => r.model);
    logger.info("Cost by model (sorted by cost):");
    for (const [model, entry] of sortedEntries(byModel)) {
        const pct = formatPercent(entry.costMicrodollars, totalCost);
        logger.info(
            `  ${model}: ${formatDollars(entry.costMicrodollars)} (${pct}) - ${entry.calls} calls, ${formatTokens(entry)}`,
        );
    }
    logger.info("");

    const byTagModel = aggregateBy(records, (r) => `${r.tag} [${r.model}]`);
    logger.info("Cost by category + model (sorted by cost):");
    for (const [key, entry] of sortedEntries(byTagModel)) {
        const pct = formatPercent(entry.costMicrodollars, totalCost);
        logger.info(`  ${key}: ${formatDollars(entry.costMicrodollars)} (${pct}) - ${entry.calls} calls`);
    }
}

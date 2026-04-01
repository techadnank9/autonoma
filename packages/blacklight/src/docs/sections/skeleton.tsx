import { Skeleton } from "@/components/ui/skeleton";
import { CodeBlock, PreviewBox, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function SkeletonSection() {
  return (
    <>
      <SectionTitle>Skeleton</SectionTitle>
      <SectionDesc>Animated placeholder for loading states. Use to indicate content is being fetched.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Skeleton</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Basic Shapes</SubTitle>
      <PreviewBox>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </PreviewBox>

      <SubTitle>Card Skeleton</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </PreviewBox>

      <SubTitle>Table Skeleton</SubTitle>
      <PreviewBox>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeletons key
            <div key={i} className="flex gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </PreviewBox>
    </>
  );
}

export default SkeletonSection;

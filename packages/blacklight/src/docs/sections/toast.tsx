import { Button } from "@/components/ui/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  useToastManager,
} from "@/components/ui/toast";
import {
  Code,
  CodeBlock,
  Paragraph,
  PreviewBox,
  PropRow,
  PropTable,
  SectionDesc,
  SectionTitle,
  SubTitle,
} from "../components/atoms";

const toastManager = createToastManager();

function ToastDemo() {
  const { toasts } = useToastManager();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toastManager.add({ type: "default", title: "Notification", description: "Default toast message." })
          }
        >
          Default
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toastManager.add({ type: "info", title: "Info", description: "Build started for branch main." })
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toastManager.add({ type: "success", title: "Success", description: "All 247 tests passed." })}
        >
          Success
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toastManager.add({ type: "warning", title: "Warning", description: "CPU usage above 90% on EU-WEST-01." })
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toastManager.add({
              type: "critical",
              title: "Critical",
              description: "Connection lost to AP-SOUTH-01.",
            })
          }
        >
          Critical
        </Button>
      </div>

      <ToastViewport>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast}>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastClose />
          </Toast>
        ))}
      </ToastViewport>
    </>
  );
}

export function ToastSection() {
  return (
    <>
      <SectionTitle>Toast</SectionTitle>
      <SectionDesc>
        Non-intrusive notification component for transient feedback. Supports 5 variants matching the Alert color
        system.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">ToastProvider</span>, <span className="text-chart-3">ToastViewport</span>,{" "}
        <span className="text-chart-3">Toast</span>, <span className="text-chart-3">useToastManager</span>,{" "}
        <span className="text-chart-3">createToastManager</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Preview</SubTitle>
      <Paragraph>Click a button to fire a toast in the top-right corner.</Paragraph>
      <PreviewBox>
        <ToastProvider toastManager={toastManager}>
          <ToastDemo />
        </ToastProvider>
      </PreviewBox>

      <SubTitle>Usage</SubTitle>
      <CodeBlock label="SETUP">
        <span className="text-text-tertiary">{"// Create a manager (module-level)"}</span>
        {"\n"}
        <span className="text-status-critical">const</span> toastManager = createToastManager()
        {";"}
        {"\n\n"}
        <span className="text-text-tertiary">{"// Wrap your app"}</span>
        {"\n"}
        <span className="text-chart-2">{"<ToastProvider"}</span> toastManager={"{"}toastManager{"}"}
        {">"}
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<App />"}</span>
        {"\n"}
        <span className="text-chart-2">{"</ToastProvider>"}</span>
      </CodeBlock>

      <CodeBlock label="TRIGGER">
        <span className="text-text-tertiary">{"// Fire a toast from anywhere"}</span>
        {"\n"}
        toastManager.add({"{"}
        {"\n"}
        {"  type: "}
        <span className="text-text-secondary">&quot;success&quot;</span>
        {",\n"}
        {"  title: "}
        <span className="text-text-secondary">&quot;Deployed&quot;</span>
        {",\n"}
        {"  description: "}
        <span className="text-text-secondary">&quot;Build deployed successfully.&quot;</span>
        {"\n"}
        {"}"}){";"}
      </CodeBlock>

      <Paragraph>
        The <Code>type</Code> field maps to toast variants automatically. Set it to <Code>info</Code>,{" "}
        <Code>success</Code>, <Code>warning</Code>, or <Code>critical</Code> for colored toasts.
      </Paragraph>

      <SubTitle>Props - Toast</SubTitle>
      <PropTable>
        <PropRow
          name="variant"
          type='"default" | "info" | "success" | "warning" | "critical"'
          def='"default"'
          desc="Visual variant (auto-detected from toast.type)"
        />
        <PropRow name="toast" type="ToastObject" desc="Toast data object from useToastManager" />
      </PropTable>

      <SubTitle>Props - ToastProvider</SubTitle>
      <PropTable>
        <PropRow name="timeout" type="number" def="5000" desc="Auto-dismiss delay in ms (0 to disable)" />
        <PropRow name="limit" type="number" def="3" desc="Maximum visible toasts" />
        <PropRow name="toastManager" type="ToastManager" desc="External toast manager instance" />
      </PropTable>
    </>
  );
}

export default ToastSection;

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy } from "@phosphor-icons/react/Copy";
import { Gear } from "@phosphor-icons/react/Gear";
import { SignOut } from "@phosphor-icons/react/SignOut";
import { Trash } from "@phosphor-icons/react/Trash";
import { User } from "@phosphor-icons/react/User";
import {
  CodeBlock,
  Paragraph,
  PreviewBox,
  PropRow,
  PropTable,
  SectionDesc,
  SectionTitle,
  SubTitle,
} from "../components/atoms";

export function DropdownMenuSection() {
  return (
    <>
      <SectionTitle>Dropdown Menu</SectionTitle>
      <SectionDesc>
        Contextual action menu triggered by a button. Built on Base UI Menu with Blacklight surface and border styling.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">DropdownMenu</span>, <span className="text-chart-3">DropdownMenuTrigger</span>,{" "}
        <span className="text-chart-3">DropdownMenuContent</span>,{" "}
        <span className="text-chart-3">DropdownMenuItem</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Preview</SubTitle>
      <PreviewBox>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuGroupLabel>Account</DropdownMenuGroupLabel>
              <DropdownMenuItem>
                <User className="size-3.5" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Gear className="size-3.5" /> Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Copy className="size-3.5" /> Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-critical">
              <Trash className="size-3.5" /> Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOut className="size-3.5" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PreviewBox>

      <SubTitle>Usage</SubTitle>
      <CodeBlock label="USAGE">
        <span className="text-chart-2">{"<DropdownMenu>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DropdownMenuTrigger>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<Button>"}</span>Actions
        <span className="text-chart-2">{"</Button>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</DropdownMenuTrigger>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DropdownMenuContent>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DropdownMenuItem>"}</span>Profile
        <span className="text-chart-2">{"</DropdownMenuItem>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DropdownMenuSeparator />"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DropdownMenuItem>"}</span>Sign Out
        <span className="text-chart-2">{"</DropdownMenuItem>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</DropdownMenuContent>"}</span>
        {"\n"}
        <span className="text-chart-2">{"</DropdownMenu>"}</span>
      </CodeBlock>

      <Paragraph>
        The menu positions itself automatically relative to the trigger. Use the side and align props on
        DropdownMenuContent to control placement.
      </Paragraph>

      <SubTitle>Props - DropdownMenuContent</SubTitle>
      <PropTable>
        <PropRow
          name="side"
          type='"top" | "bottom" | "left" | "right"'
          def='"bottom"'
          desc="Side relative to trigger"
        />
        <PropRow name="sideOffset" type="number" def="4" desc="Distance from trigger in px" />
        <PropRow name="align" type='"start" | "center" | "end"' def='"start"' desc="Alignment along side axis" />
      </PropTable>
    </>
  );
}

export default DropdownMenuSection;

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/data-table";
import { StatusDot } from "@/components/ui/status-dot";
import { CodeBlock, PreviewBox, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

const SAMPLE_DATA = [
  { node: "EU-WEST-01", cpu: "42.5%", status: "success" as const, region: "Frankfurt" },
  { node: "US-EAST-01", cpu: "78.2%", status: "warn" as const, region: "Virginia" },
  { node: "AP-SOUTH-01", cpu: "91.8%", status: "critical" as const, region: "Mumbai" },
  { node: "US-WEST-02", cpu: "23.1%", status: "success" as const, region: "Oregon" },
];

export function DataTableSection() {
  return (
    <>
      <SectionTitle>Data Table</SectionTitle>
      <SectionDesc>
        Composable table component for structured data display. Pairs with StatusDot and Badge for rich data rows.
      </SectionDesc>

      <SubTitle>Preview</SubTitle>
      <PreviewBox className="overflow-x-auto">
        <DataTable>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeaderCell>Node</DataTableHeaderCell>
              <DataTableHeaderCell>Region</DataTableHeaderCell>
              <DataTableHeaderCell>CPU %</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {SAMPLE_DATA.map((row) => (
              <DataTableRow key={row.node}>
                <DataTableCell className="font-bold">{row.node}</DataTableCell>
                <DataTableCell>{row.region}</DataTableCell>
                <DataTableCell>{row.cpu}</DataTableCell>
                <DataTableCell>
                  <span className="flex items-center gap-2">
                    <StatusDot status={row.status} />
                    <Badge variant={row.status}>{row.status}</Badge>
                  </span>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </PreviewBox>

      <SubTitle>Usage</SubTitle>
      <CodeBlock label="USAGE">
        <span className="text-chart-2">{"<DataTable>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DataTableHead>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DataTableHeaderCell>"}</span>Node
        <span className="text-chart-2">{"</DataTableHeaderCell>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DataTableHeaderCell>"}</span>CPU %
        <span className="text-chart-2">{"</DataTableHeaderCell>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</DataTableHead>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DataTableBody>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DataTableRow>"}</span>
        {"\n"}
        {"      "}
        <span className="text-chart-2">{"<DataTableCell>"}</span>EU-WEST-01
        <span className="text-chart-2">{"</DataTableCell>"}</span>
        {"\n"}
        {"      "}
        <span className="text-chart-2">{"<DataTableCell>"}</span>42.5
        <span className="text-chart-2">{"</DataTableCell>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"</DataTableRow>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</DataTableBody>"}</span>
        {"\n"}
        <span className="text-chart-2">{"</DataTable>"}</span>
      </CodeBlock>
    </>
  );
}

export default DataTableSection;

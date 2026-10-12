// Visible stand-ins for the Quick Access panel controls (preview/qam.html only): each control is drawn roughly the way
// Steam's Quick Access draws it, so a screenshot shows how many rows a theme's panel has.
export * from "./ui";
import { CSSProperties, useState } from "react";
const row: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: "1px solid #ffffff10", fontSize: 14 };
const desc = (d: any) => (d ? <div style={{ fontSize: 11.5, color: "#8b929a", padding: "0 14px 8px", marginTop: -4 }}>{d}</div> : null);
export const PanelSection = (p: any) => (
  <div className="qam-section" style={{ margin: "0 0 10px" }}>
    {p.title && <div style={{ padding: "12px 14px 6px", fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "#b8bcbf", fontWeight: 700 }}>{p.title}</div>}
    {p.children}
  </div>
);
export const PanelSectionRow = (p: any) => <div className="qam-row">{p.children}</div>;
export const ButtonItem = (p: any) => (
  <div data-qam-control="button">
    <div style={{ padding: "6px 14px" }}>
      <button onClick={p.onClick} style={{ width: "100%", padding: 9, background: "#3d4450", color: "#fff", border: 0, borderRadius: 3, fontSize: 14 }}>{p.children}</button>
    </div>
    {desc(p.description)}
  </div>
);
export const DropdownItem = (p: any) => {
  const [open, setOpen] = useState(false);
  // grouped options ({label, options}) are flattened with their group's name, as Steam's dropdown shows a sub-list
  const flat = (list: any[], group = ""): any[] => list.flatMap((o: any) => (o.options ? flat(o.options, o.label) : [{ ...o, label: group ? `${group} › ${o.label}` : o.label }]));
  const cur = flat(p.rgOptions ?? []).find((o: any) => o.data === p.selectedOption);
  const shown = flat(p.rgOptions ?? []);
  return (
    <div data-qam-control="dropdown">
      <div style={row}>
        <span>{p.label}</span>
        <span onClick={() => setOpen(!open)} style={{ background: "#23262e", padding: "5px 10px", borderRadius: 3, maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{cur?.label ?? "—"} ▾</span>
      </div>
      {open && (
        <div className="qam-options" style={{ background: "#14161b", margin: "0 14px 6px" }}>
          {shown.map((o: any) => (
            <div key={String(o.data)} onClick={() => { setOpen(false); p.onChange?.(o); }} style={{ padding: "5px 10px", fontSize: 13, cursor: "pointer", color: o.data === p.selectedOption ? "#1a9fff" : "#ddd" }}>{o.label}</div>
          ))}
        </div>
      )}
      {desc(p.description)}
    </div>
  );
};
export const ToggleField = (p: any) => (
  <div data-qam-control="toggle">
    <div style={row}>
      <span>{p.label}</span>
      <span onClick={() => p.onChange?.(!p.checked)} style={{ flex: "none", width: 38, height: 20, borderRadius: 10, background: p.checked ? "#1a9fff" : "#3d4450", position: "relative", cursor: "pointer" }}>
        <span style={{ position: "absolute", top: 2, left: p.checked ? 20 : 2, width: 16, height: 16, borderRadius: 8, background: "#fff" }} />
      </span>
    </div>
    {desc(p.description)}
  </div>
);
export const SliderField = (p: any) => (
  <div data-qam-control="slider">
    <div style={row}><span>{p.label}</span><span>{p.value}</span></div>
    <div style={{ margin: "0 14px 8px", height: 4, background: "#3d4450" }}><div style={{ width: `${((p.value - p.min) / (p.max - p.min)) * 100}%`, height: 4, background: "#1a9fff" }} /></div>
  </div>
);
export const TextField = (p: any) => (
  <div data-qam-control="text"><div style={row}><span>{p.label}</span><input defaultValue={p.value} style={{ width: 120 }} /></div></div>
);

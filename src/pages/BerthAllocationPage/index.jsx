import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../api";
import "./styles.css";

/** Terminal → berth names (same grouping as legacy app) */
const BERTH_TERMINAL_GROUPS = {
  BMCT: ["BMCT-1", "BMCT-2", "BMCT-3", "BMCT-4", "BMCT-5", "BMCT-6"],
  BPCL: ["LB-01", "LB-02"],
  JJLTPL: ["LB-03", "LB-04"],
  APMT: ["APMT-1", "APMT-2"],
  SWB: ["SWB-1", "SWB-2", "SWB-3"],
  NSFT: ["CB-01", "CB-02"],
  NSICT: ["CB-04", "CB-05"],
  NSIGT: ["CB-06"],
  "ONGC NHAVA": ["ONGC 01", "ONGC 02", "ONGC 03"],
  CCB: ["CCB", "CCB(N)", "CCB(S)"],
  ANCH: ["North Anch", "South Anch", "Off Nhava", "Ambuja Anch", "Alpha 3 Emer. Anch.", "Other"],
  MDL: ["MDL 01", "MDL 02", "MDL 03"],
};

function getGroupNameForBerth(berthName) {
  for (const [group, berths] of Object.entries(BERTH_TERMINAL_GROUPS)) {
    if (berths.includes(berthName)) return group;
  }
  for (const [group, berths] of Object.entries(BERTH_TERMINAL_GROUPS)) {
    for (const b of berths) {
      if (berthName.includes(b) || b.includes(berthName)) return group;
    }
  }
  return "ANCH";
}

function terminalHasDuplicateBerths(terminalKey, rawBerths) {
  const berths = BERTH_TERMINAL_GROUPS[terminalKey] || [];
  let extra = 0;
  for (const berth of berths) {
    const n = rawBerths.filter((r) => r.berthName === berth).length;
    if (n > 1) extra += n - 1;
  }
  return extra > 0;
}

function rowsForBerth(berthName, rawBerths) {
  const groupName = getGroupNameForBerth(berthName);
  const matches = rawBerths.filter((r) => r.berthName === berthName);
  if (matches.length === 0) {
    return [
      {
        berth: berthName,
        vesselAtBerth: "",
        side: "",
        etc: "",
        nextVessel: "",
        eta: "",
        isGroup: false,
        groupName,
        currentId: "",
        rowIndex: 1,
      },
    ];
  }
  return matches.map((de, idx) => ({
    berth: berthName,
    vesselAtBerth: de.vesselAtBerth || "",
    side: de.berthReqSide || de.side || "",
    etc: de.etcFormatted || de.etc || "",
    nextVessel: de.nextVessel || "",
    eta: de.etaFormatted || de.eta || "",
    isGroup: false,
    groupName,
    currentId: de.id || "",
    currentViaNumber: de.viaNumber || "",
    nextViaNumbers: de.nextVesselViaNumber || "",
    originalData: de,
    rowIndex: idx + 1,
  }));
}

function flattenGridRows(rawBerths, expanded) {
  const out = [];
  Object.entries(BERTH_TERMINAL_GROUPS).forEach(([terminalKey, berthList]) => {
    const hasDuplicates = terminalHasDuplicateBerths(terminalKey, rawBerths);
    out.push({
      berth: terminalKey,
      isGroup: true,
      groupName: terminalKey,
      expanded: expanded[terminalKey],
      hasDuplicates,
    });
    if (expanded[terminalKey]) {
      berthList.forEach((berthName) => {
        out.push(...rowsForBerth(berthName, rawBerths));
      });
    }
  });
  return out;
}

/** "dd/mm/yyyy hh:mm" → datetime-local value */
function parseSlashDateTimeToIso(text) {
  if (!text) return "";
  const parts = text.split(" ");
  const datePart = parts[0]?.split("/");
  if (!datePart || datePart.length !== 3) return "";
  const [dd, mm, yyyy] = datePart;
  const timePart = parts[1] ? parts[1].split(":") : ["00", "00"];
  const hh = (timePart[0] || "00").padStart(2, "0");
  const min = (timePart[1] || "00").padStart(2, "0");
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T${hh}:${min}`;
}

function formatIsoToSlashDateTime(iso) {
  if (!iso) return "";
  const [datePart, timePart] = iso.split("T");
  if (!datePart) return "";
  const [yyyy, mm, dd] = datePart.split("-");
  const [hh, min] = timePart ? timePart.split(":") : ["00", "00"];
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function BerthNameCell(props) {
  const { data, value, onDeleteRow } = props;
  if (data.isGroup) {
    return (
      <div className={`group-header ${data.expanded ? "" : "collapsed"}`}>
        <span className="expand-icon">▼</span>
        <span>{value}</span>
        {data.hasDuplicates ? (
          <span className="duplicate-dot" title="Contains duplicate berths">
            •
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div className="berth-cell-container">
      <div className="berth-actions">
        <i
          className="fas fa-list-alt berth-icon berth-icon-list"
          title="History"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            Swal.fire("Info", "History coming soon", "info");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire("Info", "History coming soon", "info");
            }
          }}
        />
        <span className="berth-name">{value}</span>
        <i
          className="fas fa-trash berth-icon berth-icon-delete"
          title="Clear Row"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRow(data);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onDeleteRow(data);
            }
          }}
        />
      </div>
    </div>
  );
}

function VesselDisplayCell(props) {
  const { data, isNext } = props;
  if (data.isGroup) return null;
  const o = data.originalData || {};
  const vesselName = isNext ? o.nextVessel : o.vesselAtBerth;
  if (!vesselName) return null;
  const via = isNext ? o.nextVesselViaNumber : o.viaNumber;
  const position = isNext ? o.nextVesselPosition : o.berthVesselPosition;
  const adjDir = isNext ? o.nextAdjDir : o.berthAdjDir;
  const adjDetail = isNext ? o.nextAdjDetail : o.berthAdjDetail;
  const badgeSide = adjDir === "N" ? "adj-badges-container-right" : "adj-badges-container-left";
  const showBadges =
    (adjDir && adjDir !== "" && adjDir !== "N/A") || (adjDetail && adjDetail !== "" && adjDetail !== "N/A");

  return (
    <div className="vessel-display">
      <div className="vessel-line-1">
        {showBadges ? (
          <div className={badgeSide}>
            {adjDir && adjDir !== "" && adjDir !== "N/A" ? <span className="adj-badge">{adjDir}</span> : null}
            {adjDetail && adjDetail !== "" && adjDetail !== "N/A" ? (
              <span className="adj-details-badge">{adjDetail}</span>
            ) : null}
          </div>
        ) : null}
        <div className="vessel-name-wrapper">
          <span className="vessel-name">&nbsp;&nbsp;{vesselName}&nbsp;</span>
          {via ? <span className="via-number">{via}</span> : null}
        </div>
      </div>
      {position ? (
        <div className="position-line">
          <span className={`position-text ${isNext ? "next-vessel-position" : ""}`}>{position}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function BerthAllocationPage() {
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState([]);
  const [rawBerths, setRawBerths] = useState([]);
  const [berthPlanVessels, setBerthPlanVessels] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const init = {};
    Object.keys(BERTH_TERMINAL_GROUPS).forEach((k) => {
      init[k] = false;
    });
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [vesselModalOpen, setVesselModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [vesselForm, setVesselForm] = useState({
    selectedVia: "",
    forwardDraft: "",
    afterDraft: "",
    adjSide: "",
    adjDetails: "",
    position: "",
    side: "",
    readinessTime: "",
    allocatedPilots: "",
    allocatedTugs: "",
    allocatedLaunch: "",
  });

  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [timeEditRow, setTimeEditRow] = useState(null);
  const [timeForm, setTimeForm] = useState({ timeValue: "", timeTextValue: "" });
  
  const loadData = useCallback(async (showSpinner = false, signal) => {
    if (showSpinner) setLoading(true);
    try {
      const [statusRes, planRes] = await Promise.all([
        api.getBerthStatus({ signal }),
        api.getBerthPlan({ signal }),
      ]);
      const statusData = statusRes.data?.data || [];
      const planPayload = planRes.data;
      const planData = Array.isArray(planPayload) ? planPayload : planPayload?.data;

      setRawBerths(statusData);
      if (Array.isArray(planData)) setBerthPlanVessels(planData);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error("Fetch error:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(true, controller.signal);
    const interval = setInterval(() => loadData(false, controller.signal), 60000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [loadData]);

  useEffect(() => {
    setRowData(flattenGridRows(rawBerths, expandedGroups));
  }, [rawBerths, expandedGroups]);

  const handleDeleteRow = useCallback(
    async (row) => {
      if (!row.currentId) return;
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to clear entire ${row.berth} row data?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Yes, clear it!",
      });
      if (!confirm.isConfirmed) return;
      try {
        const res = await api.deleteBerthVessel(row.currentId);
        if (res.status === 200) {
          Swal.fire("Deleted!", "Berth data cleared.", "success");
          loadData();
        }
      } catch {
        Swal.fire("Error", "Failed to delete.", "error");
      }
    },
    [loadData]
  );

  const handleSideChange = useCallback(
    async (sideValue, row) => {
      try {
        if (!row.currentId) return;
        await api.saveBerthPlanStatus({
          id: row.currentId,
          berthReqSide: sideValue,
          field: "side",
        });
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Side updated",
          showConfirmButton: false,
          timer: 1500,
        });
        loadData();
      } catch {
        Swal.fire("Error", "Failed to update side.", "error");
      }
    },
    [loadData]
  );

  const openVesselEditor = useCallback((row, colId) => {
    const o = row.originalData || {};
    if (colId === "vesselAtBerth") {
      setActiveRow({ ...row, colId: "vesselAtBerth" });
      setVesselForm({
        selectedVia: row.currentViaNumber || "",
        forwardDraft: o.berthForwardDraft || "",
        afterDraft: o.berthAftDraft || "",
        adjSide: o.berthAdjDir || "",
        adjDetails: o.berthAdjDetail || "",
        position: o.berthVesselPosition || "",
        side: o.berthReqSide || "",
        readinessTime: o.vesselReadinessTime ? parseSlashDateTimeToIso(o.vesselReadinessTime) : "",
        allocatedPilots: o.vessel_at_berth_alloc_pilots_names || "",
        allocatedTugs: o.vessel_at_berth_alloc_tugs_names || "",
        allocatedLaunch: o.vessel_at_berth_alloc_launches_names || "",
      });
    } else {
      setActiveRow({ ...row, colId: "nextVessel" });
      setVesselForm({
        selectedVia: row.nextViaNumbers || "",
        forwardDraft: o.nextForwardDraft || "",
        afterDraft: o.nextAftDraft || "",
        adjSide: o.nextAdjDir || "",
        adjDetails: o.nextAdjDetail || "",
        position: o.nextVesselPosition || "",
        side: o.nextReqSide || "",
        readinessTime: o.nextVesselReadinessTime ? parseSlashDateTimeToIso(o.nextVesselReadinessTime) : "",
        allocatedPilots: o.next_vessel_alloc_pilots_names || "",
        allocatedTugs: o.next_vessel_alloc_tugs_names || "",
        allocatedLaunch: o.next_vessel_alloc_launches_names || "",
      });
    }
    setVesselModalOpen(true);
  }, []);

  const openTimeEditor = useCallback((row, field, displayValue) => {
    setTimeEditRow({ ...row, field });
    const hasSlash = typeof displayValue === "string" && displayValue.includes("/");
    setTimeForm({
      timeValue: hasSlash ? parseSlashDateTimeToIso(displayValue) : "",
      timeTextValue: hasSlash ? "" : displayValue || "",
    });
    setTimeModalOpen(true);
  }, []);

  const saveVesselModal = useCallback(async () => {
    if (!activeRow?.currentId) return;
    const { colId, currentId, berth } = activeRow;
    const match = berthPlanVessels.find((v) => (v.via_number || v.viaNumber) === vesselForm.selectedVia);
    const vesselLabel = match ? match.vessel_name || match.vesselName || match.vesselAtBerth : "";
    const payload =
      colId === "vesselAtBerth"
        ? {
            field: "vesselAtBerthData",
            id: currentId,
            berthName: berth,
            vesselAtBerth: vesselLabel,
            viaNumber: vesselForm.selectedVia,
            side: vesselForm.side,
            berthReqSide: vesselForm.side,
            berthForwardDraft: vesselForm.forwardDraft,
            berthAftDraft: vesselForm.afterDraft,
            berthVesselPosition: vesselForm.position,
            berthAdjDir: vesselForm.adjSide,
            berthAdjDetail: vesselForm.adjDetails,
            vesselReadinessTime: formatIsoToSlashDateTime(vesselForm.readinessTime),
          }
        : {
            field: "nextVesselData",
            id: currentId,
            berthName: berth,
            nextVessel: vesselLabel,
            nextVesselViaNumber: vesselForm.selectedVia,
            nextReqSide: vesselForm.side,
            nextForwardDraft: vesselForm.forwardDraft,
            nextAftDraft: vesselForm.afterDraft,
            nextVesselPosition: vesselForm.position,
            nextAdjDir: vesselForm.adjSide,
            nextAdjDetail: vesselForm.adjDetails,
            nextVesselReadinessTime: formatIsoToSlashDateTime(vesselForm.readinessTime),
          };
    try {
      const res = await api.saveBerthPlanStatus(payload);
      if (res.status === 200 || res.data?.status === 200) {
        Swal.fire("Success", "Vessel data updated", "success");
        setVesselModalOpen(false);
        loadData();
      } else {
        Swal.fire("Error", "Failed to save", "error");
      }
    } catch (e) {
      console.error("Save error:", e);
      Swal.fire("Error", "Failed to save", "error");
    }
  }, [activeRow, berthPlanVessels, vesselForm, loadData]);

  const saveTimeModal = useCallback(async () => {
    if (!timeEditRow?.currentId) return;
    let value = "";
    if (timeForm.timeValue) {
      const d = new Date(timeForm.timeValue);
      value = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    } else {
      value = timeForm.timeTextValue;
    }
    try {
      const res = await api.saveBerthPlanStatus({
        id: timeEditRow.currentId,
        field: timeEditRow.field,
        [timeEditRow.field]: value,
      });
      if (res.status === 200 || res.data?.status === 200) {
        Swal.fire("Success", "Time updated", "success");
        setTimeModalOpen(false);
        loadData();
      } else {
        Swal.fire("Error", "Failed to save", "error");
      }
    } catch {
      Swal.fire("Error", "Failed to save", "error");
    }
  }, [timeEditRow, timeForm, loadData]);

  const exportExcel = useCallback(() => {
    const k = rawBerths;
    if (!k.length) return;
    let tsv = `BERTH\tVESSEL AT BERTH\tSIDE\tETC\tNEXT VESSEL\tETA\n`;
    Object.entries(BERTH_TERMINAL_GROUPS).forEach(([groupName, berthList]) => {
      tsv += `${groupName}\n`;
      berthList.forEach((berthName) => {
        const rows = k.filter((r) => r.berthName === berthName);
        if (rows.length === 0) {
          tsv += `${berthName}\t\t\t\t\t\n`;
        } else {
          rows.forEach((Ge) => {
            const atBerth = Ge.vesselAtBerth ? `${Ge.vesselAtBerth} (${Ge.viaNumber || ""})` : "";
            const next = Ge.nextVessel ? `${Ge.nextVessel} (${Ge.nextVesselViaNumber || ""})` : "";
            tsv += `${berthName}\t${atBerth}\t${Ge.berthReqSide || Ge.side || ""}\t${Ge.etc || ""}\t${next}\t${Ge.eta || ""}\n`;
            if (Ge.berthVesselPosition || Ge.nextVesselPosition) {
              tsv += `\t${Ge.berthVesselPosition || ""}\t\t\t${Ge.nextVesselPosition || ""}\t\n`;
            }
          });
        }
      });
      tsv += "\n";
    });
    const blob = new Blob([tsv], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `berth-allocation-${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [rawBerths]);

  const vesselSelectOptions = useMemo(
    () =>
      berthPlanVessels.map((v) => ({
        value: v.via_number || v.viaNumber,
        label: `${v.vessel_name || v.vesselName || v.vesselAtBerth} (VIA: ${v.via_number || v.viaNumber})`,
      })),
    [berthPlanVessels]
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Berth",
        field: "berth",
        width: 160,
        pinned: "left",
        cellStyle: (p) => (p.data.isGroup ? { fontWeight: "bold", backgroundColor: "#1e3a8a", color: "white" } : {}),
        cellRenderer: BerthNameCell,
        cellRendererParams: { onDeleteRow: handleDeleteRow },
      },
      {
        headerName: "Vessel at Berth",
        field: "vesselAtBerth",
        flex: 3,
        minWidth: 210,
        cellStyle: { cursor: "pointer", padding: "0 !important", lineHeight: "1" },
        cellRenderer: VesselDisplayCell,
        cellRendererParams: { isNext: false },
        onCellClicked: (ev) => {
          if (!ev.data?.isGroup) openVesselEditor(ev.data, "vesselAtBerth");
        },
      },
      {
        headerName: "Side",
        field: "side",
        width: 120,
        cellRenderer: (p) =>
          p.data.isGroup ? (
            ""
          ) : (
            <select
              className="side-dropdown"
              value={p.value || ""}
              onChange={(e) => handleSideChange(e.target.value, p.data)}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">--Select--</option>
              <option value="P/S">P/S</option>
              <option value="S/S">S/S</option>
              <option value="As Any Side">As Any Side</option>
            </select>
          ),
      },
      {
        headerName: "ETC",
        field: "etc",
        width: 140,
        cellClass: (p) => (p.data.isGroup ? "" : "time-cell"),
        onCellClicked: (ev) => {
          if (!ev.data?.isGroup) openTimeEditor(ev.data, "etc", ev.value);
        },
      },
      {
        headerName: "Next Vessel",
        field: "nextVessel",
        flex: 3,
        minWidth: 210,
        cellStyle: { cursor: "pointer", padding: "0 !important", lineHeight: "1" },
        cellRenderer: VesselDisplayCell,
        cellRendererParams: { isNext: true },
        onCellClicked: (ev) => {
          if (!ev.data?.isGroup) openVesselEditor(ev.data, "nextVessel");
        },
      },
      {
        headerName: "ETA",
        field: "eta",
        width: 140,
        cellClass: (p) => (p.data.isGroup ? "" : "time-cell"),
        onCellClicked: (ev) => {
          if (!ev.data?.isGroup) openTimeEditor(ev.data, "eta", ev.value);
        },
      },
    ],
    [handleDeleteRow, handleSideChange, openVesselEditor, openTimeEditor]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: false,
      flex: 1,
      minWidth: 100,
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid #dee2e6",
      },
    }),
    []
  );

  const onRowClicked = useCallback((event) => {
    if (event.data?.isGroup) {
      const name = event.data.groupName;
      setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  }, []);

  const getRowClass = useCallback((params) => (params.data?.isGroup ? "ag-row-group" : undefined), []);

  const onSearchChange = (e) => {
    const v = e.target.value;
    setSearch(v);
    gridRef.current?.api?.setGridOption?.("quickFilterText", v);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white berth-allocation-page">
      <header className="header">
        <div id="top-navbar">
          <Navbar />
        </div>
      </header>

      <main className="flex-grow-1 p-4 main-content">
        <div className="container-fluid">
          <div className="header-section d-flex flex-nowrap align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center flex-shrink-0">
              <button type="button" className="btn btn-sm btn-outline-primary p-2 mb-0 me-2" title="Go Back" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left" />
              </button>
              <h5 className="mb-0 text-warning fw-bold animate__animated animate__bounceInDown">Berth Allocation</h5>
            </div>
            <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-end ms-3">
              <div style={{ flex: "1 1 auto", maxWidth: "450px", minWidth: "150px" }}>
                <div className="position-relative">
                  <input type="text" className="form-control search-input" placeholder="Search" value={search} onChange={onSearchChange} />
                  <i
                    className="fas fa-search search-icon"
                    id="searchIcon"
                  />
                </div>
              </div>
              <div className="d-flex gap-2 border-start ps-3">
                <div className="icon-box" title="Refresh Data" onClick={() => loadData(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && loadData(true)}>
                  <i className="fas fa-sync-alt" />
                </div>
                <div className="icon-box" title="Export to Excel" onClick={exportExcel} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && exportExcel()}>
                  <i className="fas fa-file-export" />
                </div>
                <div
                  className="icon-box"
                  title="Add Berth Sharing"
                  onClick={() => Swal.fire("Info", "Berth Sharing functionality is not implemented yet.", "info")}
                  role="button"
                  tabIndex={0}
                >
                  <i className="fas fa-plus" />
                </div>
                <div className="icon-box" title="Settings" onClick={() => Swal.fire("Info", "Settings coming soon", "info")} role="button" tabIndex={0}>
                  <i className="fas fa-cog" />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 w-100">
              <div className="grid-container w-100" style={{ flexGrow: 1 }}>
                <div className="ag-theme-alpine" style={{ height: "calc(100vh - 220px)", width: "100%" }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onRowClicked={onRowClicked}
                    headerHeight={48}
                    rowHeight={48}
                    animateRows
                    suppressCellFocus
                    getRowClass={getRowClass}
                    loading={loading}
                    theme="legacy"
                    overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading data...</span>'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {vesselModalOpen ? (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="vesselModalLabel">
                  {activeRow?.colId === "vesselAtBerth" ? "Edit Vessel" : "Edit Next Vessel"}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setVesselModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Left Column: Vessel Selection and Details */}
                  <div className="col-12 col-lg-6 mb-4 mb-lg-0 pe-lg-3 border-end">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Vessel:</label>
                      <Select
                        options={vesselSelectOptions}
                        value={vesselSelectOptions.find((o) => o.value === vesselForm.selectedVia) || null}
                        onChange={(opt) => setVesselForm((f) => ({ ...f, selectedVia: opt ? opt.value : "" }))}
                        placeholder="-- Select Vessel --"
                        isClearable
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-12 col-sm-6 mb-2">
                        <label className="form-label fw-bold">Forward Draft:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Forward Draft"
                          value={vesselForm.forwardDraft}
                          onChange={(e) => setVesselForm((f) => ({ ...f, forwardDraft: e.target.value }))}
                        />
                      </div>
                      <div className="col-12 col-sm-6 mb-2">
                        <label className="form-label fw-bold">After Draft:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter After Draft"
                          value={vesselForm.afterDraft}
                          onChange={(e) => setVesselForm((f) => ({ ...f, afterDraft: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-12 col-sm-6 mb-2">
                        <label className="form-label fw-bold">Adjustments:</label>
                        <select
                          className="form-select"
                          value={vesselForm.adjSide}
                          onChange={(e) => setVesselForm((f) => ({ ...f, adjSide: e.target.value }))}
                        >
                          <option value="">N/A</option>
                          <option value="N">N (North)</option>
                          <option value="S">S (South)</option>
                        </select>
                      </div>
                      <div className="col-12 col-sm-6 mb-2">
                        <label className="form-label fw-bold">Adjustments Details:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Details"
                          value={vesselForm.adjDetails}
                          onChange={(e) => setVesselForm((f) => ({ ...f, adjDetails: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-12 col-sm-6 mb-2">
                        <label className="form-label fw-bold">Position:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Required Position"
                          value={vesselForm.position}
                          onChange={(e) => setVesselForm((f) => ({ ...f, position: e.target.value }))}
                        />
                      </div>
                      <div className="col-12 col-sm-6 mb-2">
                        <label className="form-label fw-bold">Side:</label>
                        <select
                          className="form-select"
                          value={vesselForm.side}
                          onChange={(e) => setVesselForm((f) => ({ ...f, side: e.target.value }))}
                        >
                          <option value="">--Select Side--</option>
                          <option value="As Any Side">As Any Side</option>
                          <option value="P/S">P/S</option>
                          <option value="S/S">S/S</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Allocation Details */}
                  <div className="col-12 col-lg-6 ps-lg-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Vessel Readiness Time: <span className="text-xxs text-muted">(Pilot Pick-up Time)</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={vesselForm.readinessTime}
                        onChange={(e) => setVesselForm((f) => ({ ...f, readinessTime: e.target.value }))}
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">Allocated Pilots:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Allocated Pilots"
                          value={vesselForm.allocatedPilots}
                          onChange={(e) => setVesselForm((f) => ({ ...f, allocatedPilots: e.target.value }))}
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">Allocated Tugs:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Allocated Tugs"
                          value={vesselForm.allocatedTugs}
                          onChange={(e) => setVesselForm((f) => ({ ...f, allocatedTugs: e.target.value }))}
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label className="form-label fw-bold">Allocated Launch:</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Allocated Launch"
                          value={vesselForm.allocatedLaunch}
                          onChange={(e) => setVesselForm((f) => ({ ...f, allocatedLaunch: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger mb-0" onClick={() => setVesselModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary mb-0" onClick={saveVesselModal}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {timeModalOpen ? (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update {timeEditRow?.field?.toUpperCase()}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setTimeModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={timeForm.timeValue}
                    onChange={(e) => setTimeForm({ timeValue: e.target.value, timeTextValue: "" })}
                  />
                </div>
                <div className="text-center my-2 text-muted">OR</div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Text Value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={timeForm.timeTextValue}
                    onChange={(e) => setTimeForm({ timeTextValue: e.target.value, timeValue: "" })}
                    placeholder="e.g. TBA, At Berth"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setTimeModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveTimeModal}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

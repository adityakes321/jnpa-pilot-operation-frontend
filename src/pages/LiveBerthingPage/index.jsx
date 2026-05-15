import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import api from "../../api";
import "./styles.css";

const EXCLUDED_BERTHS = [
  'Pilot Station', 'North Anchorage', 'South Anchorage', 'Other Anchorage',
  'BPL', 'Ambuja Anchorage', 'Alpha 3 Emergency Anchorage', 'Anchorage of Nhava'
];

const REFRESH_INTERVAL = 60000;

export default function LiveBerthingPage() {
  const [leftRowData, setLeftRowData] = useState([]);
  const [rightRowData, setRightRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [titles, setTitles] = useState({ left: "Berths", right: "Berths" });
  const [counts, setCounts] = useState({ left: 0, right: 0 });
  const [rowHeight, setRowHeight] = useState(40);
  const [headerHeight, setHeaderHeight] = useState(34);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotification, setShowNotification] = useState({ show: false, message: "" });

  const leftGridRef = useRef(null);
  const rightGridRef = useRef(null);
  const previousDataMap = useRef(new Map());

  // Format vessel names to UPPERCASE
  const vesselValueFormatter = (params) => {
    if (!params.value || params.value.trim() === "") return "";
    return params.value.toUpperCase();
  };

  // Format date/time values
  const dateTimeValueFormatter = (params) => {
    if (!params.value || params.value.trim() === "") return "";
    const value = params.value.trim();

    // Check for SQL datetime format (yyyy-mm-dd hh:mm:ss)
    const sqlRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/;
    const match = value.match(sqlRegex);
    if (match) {
      const [, year, month, day, hours, minutes] = match;
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
    return value;
  };

  // Format side values
  const sideValueFormatter = (params) => {
    if (!params.value || params.value.trim() === "") return "";
    const side = params.value.trim().toUpperCase();
    if (["P/S", "PS", "P"].includes(side)) return "P/S";
    if (["S/S", "SS", "S"].includes(side)) return "S/S";
    return side;
  };

  const getCellUpdateClass = (params, field) => {
    const berth = params.data.berth;
    const vessel = params.data.vessel || "empty";
    const currentValue = params.value || "";
    const key = `${berth}-${vessel}-${field}`;

    if (previousDataMap.current.has(key)) {
      const prevValue = previousDataMap.current.get(key);
      if (prevValue !== currentValue && currentValue !== "") {
        setTimeout(() => previousDataMap.current.set(key, currentValue), 3100);
        return "cell-updated";
      }
    } else {
      previousDataMap.current.set(key, currentValue);
    }
    return "";
  };

  const getBrowserZoomLevel = useCallback(() => {
    if (window.outerWidth && window.innerWidth) {
      const zoom = window.outerWidth / window.innerWidth;
      return Math.round(zoom * 20) / 20;
    }
    return window.devicePixelRatio || 1;
  }, []);

  const getResponsiveColumnDefs = useCallback(() => {
    const screenWidth = window.innerWidth;
    const zoom = getBrowserZoomLevel();
    const effectiveWidth = screenWidth * zoom;

    console.log(`📐 Screen: ${screenWidth}px | Zoom: ${(zoom * 100).toFixed(0)}% | Effective: ${effectiveWidth.toFixed(0)}px`);

    let berthWidth, etcEtaWidth, sideWidth;
    let conditionApplied = "";

    if (zoom < 0.7) {
      berthWidth = 110; etcEtaWidth = 130; sideWidth = 75;
      conditionApplied = "Very zoomed out";
    } else if (zoom < 0.9) {
      berthWidth = 110; etcEtaWidth = 120; sideWidth = 80;
      conditionApplied = "Zoomed out";
    } else if (effectiveWidth >= 3840) {
      berthWidth = 200; etcEtaWidth = 240; sideWidth = 130;
      conditionApplied = "4K screen";
    } else if (effectiveWidth >= 2560) {
      berthWidth = 180; etcEtaWidth = 180; sideWidth = 110;
      conditionApplied = "2K screen";
    } else if (effectiveWidth >= 1920) {
      berthWidth = 170; etcEtaWidth = 150; sideWidth = 100;
      conditionApplied = "Full HD screen";
    } else if (effectiveWidth >= 1440) {
      berthWidth = 130; etcEtaWidth = 125; sideWidth = 85;
      conditionApplied = "1440p screen";
    } else if (effectiveWidth >= 1024) {
      berthWidth = 75; etcEtaWidth = 85; sideWidth = 65;
      conditionApplied = "1024px screen";
    } else {
      berthWidth = 80; etcEtaWidth = 90; sideWidth = 65;
      conditionApplied = "Mobile screen";
    }

    console.log(`✅ Condition applied: ${conditionApplied} (Effective: ${effectiveWidth.toFixed(0)}px)`);

    return [
      {
        headerName: "BERTH",
        field: "berth",
        colId: "berth",
        width: berthWidth,
        pinned: "left",
        cellClass: "berth-cell",
      },
      {
        headerName: "VESSEL AT BERTH",
        field: "vessel",
        colId: "vessel",
        flex: 1,
        wrapText: true,
        minWidth: 80,
        cellStyle: { whiteSpace: "normal", lineHeight: "1.2" },
        valueFormatter: vesselValueFormatter,
        cellClass: (params) => {
          const updateClass = getCellUpdateClass(params, "vessel");
          return `VB-cell ${updateClass}`;
        },
      },
      {
        headerName: "ETC",
        field: "etc",
        colId: "etc",
        width: etcEtaWidth,
        wrapText: true,
        cellStyle: { justifyContent: "center", whiteSpace: "normal", lineHeight: "1.2" },
        valueFormatter: dateTimeValueFormatter,
        cellClass: (params) => getCellUpdateClass(params, "etc"),
      },
      {
        headerName: "SIDE",
        field: "side",
        colId: "side",
        width: sideWidth,
        cellStyle: { justifyContent: "center", whiteSpace: "nowrap" },
        valueFormatter: sideValueFormatter,
        cellClass: (params) => getCellUpdateClass(params, "side"),
      },
      {
        headerName: "NEXT VESSEL",
        field: "nextVessel",
        colId: "nextVessel",
        flex: 1,
        wrapText: true,
        minWidth: 80,
        cellStyle: { whiteSpace: "normal", lineHeight: "1.2" },
        valueFormatter: vesselValueFormatter,
        cellClass: (params) => getCellUpdateClass(params, "nextVessel"),
      },
      {
        headerName: "ETA",
        field: "eta",
        colId: "eta",
        width: etcEtaWidth,
        wrapText: true,
        cellStyle: { justifyContent: "center", whiteSpace: "normal", lineHeight: "1.2" },
        valueFormatter: dateTimeValueFormatter,
        cellClass: (params) => getCellUpdateClass(params, "eta"),
      },
    ];
  }, [windowWidth, getBrowserZoomLevel]);

  const calculateOptimalHeights = useCallback((leftCount, rightCount) => {
    const maxBerths = Math.max(leftCount, rightCount, 1);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const zoom = window.devicePixelRatio || 1;

    let hHeight = 34;
    if (zoom < 0.7) hHeight = 32;
    else if (screenWidth >= 3840) hHeight = 60;
    else if (screenWidth >= 2560) hHeight = 52;
    else if (screenWidth >= 1920) hHeight = 46;
    else if (screenWidth >= 1440) hHeight = 40;
    else if (screenWidth >= 1024) hHeight = 36;
    setHeaderHeight(hHeight);

    const gridWrapper = document.querySelector(".grid-wrapper");
    const gridHeader = document.querySelector(".grid-header");
    if (!gridWrapper || !gridHeader) return;

    const wrapperRect = gridWrapper.getBoundingClientRect();
    const headerRect = gridHeader.getBoundingClientRect();

    // Padding and margin approximations from CSS
    const availableHeight = wrapperRect.height - headerRect.height - 30 - 24 - hHeight - 10;
    let calcRowHeight = Math.floor(availableHeight / maxBerths);

    let maxRH, minRH;
    if (zoom < 0.7) { maxRH = 45; minRH = 25; }
    else if (zoom < 0.9) { maxRH = 55; minRH = 28; }
    else if (screenWidth >= 3840) { maxRH = 150; minRH = 45; }
    else if (screenWidth >= 2560) { maxRH = 100; minRH = 38; }
    else if (screenWidth >= 1920) { maxRH = 80; minRH = 32; }
    else if (screenWidth >= 1440) { maxRH = 65; minRH = 28; }
    else if (screenWidth >= 1024) { maxRH = 55; minRH = 25; }
    else { maxRH = 60; minRH = 45; }

    const optimalRowHeight = Math.max(minRH, Math.min(calcRowHeight, maxRH));
    setRowHeight(optimalRowHeight);

    console.log(`📊 Row: ${optimalRowHeight}px | Berths: ${maxBerths} | Available: ${availableHeight.toFixed(0)}px | Zoom: ${(zoom * 100).toFixed(0)}%`);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [berthRes, statusRes] = await Promise.all([
        api.getAllBerth(),
        api.getBerthStatus()
      ]);

      let berthList = berthRes.data || [];
      const berthStatusData = statusRes.data?.data || [];

      if (!berthList.length) {
        setLoading(false);
        return;
      }

      berthList = berthList.filter(b => {
        const name = b.berth_name || "";
        return !EXCLUDED_BERTHS.some(ex => name.toLowerCase().includes(ex.toLowerCase()));
      });

      const statusMap = new Map();
      berthStatusData.forEach(s => {
        if (s.berthId) {
          if (!statusMap.has(s.berthId)) statusMap.set(s.berthId, []);
          statusMap.get(s.berthId).push(s);
        }
      });

      const allRows = [];
      berthList.forEach(berth => {
        const berthId = berth.berth_id;
        let displayName = berth.berth_name || "";
        if (displayName === "Coastal Berth North") displayName = "CCB(N)";
        else if (displayName === "Coastal Berth South") displayName = "CCB(S)";

        const statuses = statusMap.get(berthId) || [];
        const seen = new Set();

        if (statuses.length === 0) {
          allRows.push({ berth: displayName, vessel: "", etc: "", side: "", nextVessel: "", eta: "" });
        } else {
          statuses.forEach((s, idx) => {
            const hasData = s.vesselAtBerth || s.etc || s.side || s.nextVessel || s.eta;
            if (!hasData) return;

            const key = `${s.viaNumber || ""}_${s.vesselAtBerth || ""}`.toLowerCase().trim();
            if (seen.has(key)) return;
            seen.add(key);

            allRows.push({
              berth: displayName,
              vessel: s.vesselAtBerth || "",
              etc: s.etc || "",
              side: s.side || "",
              nextVessel: s.nextVessel || "",
              eta: s.eta || "",
              sameBerthFirst: idx === 0 && statuses.length > 1,
              sameBerthLast: idx === statuses.length - 1 && statuses.length > 1
            });
          });

          if (seen.size === 0) {
            allRows.push({ berth: displayName, vessel: "", etc: "", side: "", nextVessel: "", eta: "" });
          }
        }
      });

      const splitIdx = Math.ceil(allRows.length / 2);
      const left = allRows.slice(0, splitIdx);
      const right = allRows.slice(splitIdx);

      setLeftRowData(left);
      setRightRowData(right);
      setCounts({ left: left.length, right: right.length });
      setLastUpdate(moment().format("HH:mm:ss"));

      const lFirst = left.find(r => r.berth)?.berth || "";
      const lLast = [...left].reverse().find(r => r.berth)?.berth || "";
      const rFirst = right.find(r => r.berth)?.berth || "";
      const rLast = [...right].reverse().find(r => r.berth)?.berth || "";
      setTitles({ left: `${lFirst} - ${lLast}`, right: `${rFirst} - ${rLast}` });

      calculateOptimalHeights(left.length, right.length);
      setLoading(false);
    } catch (error) {
      console.error("Error loading berthing data:", error);
      setLoading(false);
    }
  }, [calculateOptimalHeights]);

  useEffect(() => {
    console.log(`🖥️ Display: ${window.innerWidth}x${window.innerHeight}`);
    loadData();
    const interval = setInterval(() => {
      // console.log('🔄 Auto-refreshing berthing data...');
      loadData();
    }, REFRESH_INTERVAL);

    // 24-hour page refresh
    const PAGE_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;
    console.log(`⏰ Page will refresh in 24 hours (${PAGE_REFRESH_INTERVAL / 1000 / 60 / 60} hours)`);

    const refreshTimeout = setTimeout(() => {
      console.log('🔄 24-hour page refresh triggered');
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          setTimeout(() => { window.location.reload(); }, 100);
        }).catch(() => { window.location.reload(); });
      } else {
        window.location.reload();
      }
    }, PAGE_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      clearTimeout(refreshTimeout);
    };
  }, [loadData]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      calculateOptimalHeights(leftRowData.length, rightRowData.length);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateOptimalHeights, leftRowData.length, rightRowData.length]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    const handleFSChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setShowNotification({
        show: true,
        message: fs ? "Entered Fullscreen (Ctrl+Shift+F to exit)" : "Exited Fullscreen"
      });
      setTimeout(() => setShowNotification({ show: false, message: "" }), 2500);
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("fullscreenchange", handleFSChange);
    };
  }, [toggleFullscreen]);

  const gridOptions = useMemo(() => ({
    columnDefs: getResponsiveColumnDefs(),
    defaultColDef: {
      sortable: false,
      filter: false,
      resizable: false,
      wrapText: false,
      autoHeight: false
    },
    rowSelection: "single",
    suppressRowClickSelection: true,
    suppressCellFocus: true,
    suppressMovableColumns: true,
    suppressMenuHide: true,
    animateRows: false,
    domLayout: "normal",
    getRowClass: params => {
      let classes = [];
      if (params.data.sameBerthFirst) classes.push("same-berth-first-row");
      if (params.data.sameBerthLast) classes.push("same-berth-last-row");
      return classes.join(" ");
    }
  }), [getResponsiveColumnDefs]);

  return (
    <div className={`live-berthing-page-container ${isFullscreen ? "presentation-mode" : ""}`}>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading Berthing Data...</p>
          </div>
        </div>
      )}

      {showNotification.show && (
        <div className="fullscreen-notification">
          {showNotification.message}
        </div>
      )}

      <main className="live-berthing-main">
        <div className="grid-container">
          <div className="grid-wrapper">
            <div className="grid-header">
              <h5>
                <i className="fas fa-water" style={{ color: "#00d4ff" }}></i>
                <span>{titles.left}</span>
                <span className="berth-count">{counts.left}</span>
              </h5>
              <div className="status-badge" onClick={toggleFullscreen}>
                <span className="pulse-dot"></span>
                <span>Updated {lastUpdate}</span>
              </div>
            </div>
            <div className="grid-inner">
              <div className="ag-grid-live ag-theme-quartz-dark-live">
                <AgGridReact
                  ref={leftGridRef}
                  rowData={leftRowData}
                  {...gridOptions}
                  rowHeight={rowHeight}
                  headerHeight={headerHeight}
                  theme="legacy"
                />
              </div>
            </div>
          </div>

          <div className="grid-wrapper">
            <div className="grid-header">
              <h5>
                <i className="fas fa-anchor" style={{ color: "#00d4ff" }}></i>
                <span>{titles.right}</span>
                <span className="berth-count">{counts.right}</span>
              </h5>
              <div className="status-badge" onClick={toggleFullscreen}>
                <span className="pulse-dot"></span>
                <span>Updated {lastUpdate}</span>
              </div>
            </div>
            <div className="grid-inner">
              <div className="ag-grid-live ag-theme-quartz-dark-live">
                <AgGridReact
                  ref={rightGridRef}
                  rowData={rightRowData}
                  {...gridOptions}
                  rowHeight={rowHeight}
                  headerHeight={headerHeight}
                  theme="legacy"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

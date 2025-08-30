import React from "react";

/** 可调：每行有多少时间格（比如 24 表示 24 个记录格） */
const COLS = 24;

/** 统一一些底色 */
const tone: Record<string, string> = {
  none: "",
  mild: "bg-yellow-50",
  warn: "bg-yellow-100",
  high: "bg-yellow-200",
  low:  "bg-blue-50",
  gray: "bg-gray-100",
};

type Row = { label: string; note?: string; shade?: keyof typeof tone };

/** 一个区块（心率/血压/体温）的通用网格 */
function Block({
  title,
  unit,
  rows,
  rightHeader,
  leftHeader,
}: {
  title: string;
  unit?: string;
  rows: Row[];
  /** 左右栏顶端的小提示文字（如“Write ≥ 140”） */
  leftHeader?: string;
  rightHeader?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow-sm print:shadow-none">
      <div className="px-4 py-3 border-b border-gray-300 flex items-end justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {unit ? <span className="text-xs text-gray-500">{unit}</span> : null}
      </div>

      {/* 头部提示（左右各一格，不参与网格列数） */}
      {(leftHeader || rightHeader) && (
        <div className="grid" style={{ gridTemplateColumns: `12rem 1fr 12rem` }}>
          <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-300">{leftHeader}</div>
          <div className="border-b border-gray-300" />
          <div className="px-3 py-1 text-xs text-right text-gray-500 border-b border-gray-300">{rightHeader}</div>
        </div>
      )}

      {/* 主体网格：左标签 + N 列空白 + 右标签 */}
      <div className="grid" style={{ gridTemplateColumns: `12rem repeat(${COLS}, minmax(20px, 1fr)) 12rem` }}>
        {/* 表头（空白一行，用于画竖线并撑开列） */}
        <div className="border-r border-gray-300 bg-gray-50/50 text-xs px-2 py-1 text-gray-500"> </div>
        {Array.from({ length: COLS }).map((_, i) => (
          <div key={`head-${i}`} className="h-6 border-b border-r border-gray-300" />
        ))}
        <div className="border-l border-gray-300 bg-gray-50/50 text-xs px-2 py-1 text-right text-gray-500"> </div>

        {/* 数据行 */}
        {rows.map((r, idx) => (
          <React.Fragment key={idx}>
            {/* 左侧行标 */}
            <div className={`px-2 py-1 text-xs border-t border-r border-gray-300 bg-white sticky left-0 z-[1]`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-800">{r.label}</span>
                {r.note ? <span className="text-[10px] text-gray-500">{r.note}</span> : null}
              </div>
            </div>

            {/* 中央时间/记录格 */}
            {Array.from({ length: COLS }).map((_, i) => (
              <div
                key={`${idx}-${i}`}
                className={[
                  "h-6 border-t border-r border-gray-300",
                  r.shade ? tone[r.shade] : "",
                ].join(" ")}
              />
            ))}

            {/* 右侧行标（镜像一份，方便打印时左右都能看） */}
            <div className={`px-2 py-1 text-xs border-t border-l border-gray-300 bg-white sticky right-0 z-[1] text-right`}>
              <div className="flex items-center justify-end gap-2">
                {r.note ? <span className="text-[10px] text-gray-500">{r.note}</span> : null}
                <span className="text-gray-800">{r.label}</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** 心率区（按 40s–140+，高值区域做浅黄底） */
function HeartRateBlock() {
  const rows: Row[] = [
    { label: "≥ 140", shade: "high" },
    { label: "130s", shade: "warn" },
    { label: "120s", shade: "warn" },
    { label: "110s", shade: "mild" },
    { label: "100s", shade: "mild" },
    { label: "90s" },
    { label: "80s" },
    { label: "70s" },
    { label: "60s" },
    { label: "50s", shade: "low" },
    { label: "40s", shade: "low" },
  ];
  return (
    <Block
      title="Heart Rate"
      unit="beats / min"
      rows={rows}
      leftHeader="Write value if ≥ 140"
      rightHeader="Write ≥ 140"
    />
  );
}

/** 收缩压区（60s–200+，顶部高值浅黄，最低段灰底；附加“Score for systolic BP only”行） */
function BloodPressureBlock() {
  const rows: Row[] = [
    { label: "≥ 200", shade: "high" },
    { label: "190s", shade: "warn" },
    { label: "180s", shade: "warn" },
    { label: "170s", shade: "warn" },
    { label: "160s", shade: "mild" },
    { label: "150s", shade: "mild" },
    { label: "140s" },
    { label: "130s" },
    { label: "120s" },
    { label: "110s" },
    { label: "100s" },
    { label: "90s", shade: "gray" },
    { label: "80s", shade: "gray" },
    { label: "70s", shade: "gray" },
    { label: "60s", shade: "gray" },
  ];
  return (
    <div className="space-y-1">
      <Block
        title="Blood Pressure (Systolic)"
        unit="mmHg"
        rows={rows}
        leftHeader="Write value if ≥ 200"
        rightHeader="Write ≥ 200"
      />
      {/* 评分行（可按需求换成 3/2/1/0/1/2/3 等） */}
      <div className="grid" style={{ gridTemplateColumns: `12rem repeat(${COLS}, minmax(20px, 1fr)) 12rem` }}>
        <div className="px-2 py-1 text-xs text-gray-700 border border-gray-300 bg-white">
          Score for systolic BP only
        </div>
        {Array.from({ length: COLS }).map((_, i) => (
          <div key={i} className="h-6 border-t border-r border-gray-300 bg-gray-100" />
        ))}
        <div className="border border-gray-300 bg-white" />
      </div>
    </div>
  );
}

/** 体温区（按区间行显示，发热区浅黄） */
function TemperatureBlock() {
  const rows: Row[] = [
    { label: "≥ 38.6", shade: "high" },
    { label: "38.0 – 38.5", shade: "warn" },
    { label: "37.6 – 37.9", shade: "mild" },
    { label: "37.1 – 37.5" },
    { label: "36.6 – 37.0" },
    { label: "36.1 – 36.5", shade: "low" },
    { label: "≤ 36.0", shade: "low" },
  ];
  return (
    <Block title="Temperature" unit="°C" rows={rows} leftHeader="Write if ≥ 38.6" rightHeader="Write ≥ 38.6" />
  );
}
/** 呼吸频率（breaths/min） */
function RespiratoryRateBlock() {
  const rows: Row[] = [
    { label: "≥ 36",   shade: "high" },
    { label: "30 – 35", shade: "warn" },
    { label: "25 – 29", shade: "mild" },
    { label: "21 – 24", shade: "mild" },
    { label: "15 – 20" },
    { label: "10 – 14", shade: "low" },
    { label: "6 – 9",   shade: "low" },
    { label: "≤ 5",    shade: "low" },
  ];
  return (
    <Block
      title="Respiratory Rate"
      unit="breaths / min"
      rows={rows}
      leftHeader="Write value if ≥ 36"
      rightHeader="Write ≥ 36"
    />
  );
}

/** 血氧饱和度（SpO₂，%） */
function OxygenSaturationBlock() {
  const rows: Row[] = [
    { label: "≥ 94" },               // 正常
    { label: "91 – 93", shade: "mild" },
    { label: "85 – 90", shade: "warn" },
    { label: "≤ 84",  shade: "high" }, // 明显低氧
  ];
  return (
    <Block
      title="O₂ Saturation"
      unit="%"
      rows={rows}
      leftHeader="Write value if ≤ 84"
      rightHeader="Write ≤ 84"
    />
  );
}

/** 氧流量（L/min）+ 设备行 */
function OxygenFlowRateBlock() {
  const rows: Row[] = [
    { label: "≥ 10", shade: "high" },
    { label: "5 – 10", shade: "warn" },
    { label: "2 – 4",  shade: "mild" },
    { label: "< 2" },
  ];
  return (
    <div className="space-y-1">
      <Block
        title="O₂ Flow Rate"
        unit="L / min"
        rows={rows}
        leftHeader="Write value if > 10"
        rightHeader="Write > 10"
      />
      {/* 设备记录行 */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `12rem repeat(${COLS}, minmax(20px, 1fr)) 12rem` }}
      >
        <div className="px-2 py-1 text-xs text-gray-700 border border-gray-300 bg-white">
          Delivery device
        </div>
        {Array.from({ length: COLS }).map((_, i) => (
          <div key={i} className="h-6 border-t border-r border-gray-300 bg-gray-100" />
        ))}
        <div className="border border-gray-300 bg-white" />
      </div>
    </div>
  );
}
/** 意识（AVPU） */
function ConsciousnessBlock() {
  const rows: Row[] = [
    { label: "Alert",        note: "0" },
    { label: "To Voice",     note: "2", shade: "mild" },
    { label: "To Pain",      note: "3", shade: "warn" },
    { label: "Unresponsive", note: "M", shade: "high" },
  ];
  return (
    <Block
      title="Consciousness"
      rows={rows}
      leftHeader="If necessary wake patient before scoring"
      rightHeader=""   // 右侧留空；每行的 note 会在左右行标都显示
    />
  );
}

/** 疼痛评分（0–10，静息/运动） */
function PainScoreBlock() {
  const rows: Row[] = [
    { label: "Rest" },
    { label: "Movement" },
  ];
  return (
    <Block
      title="Pain Score"
      unit="None (0) – Worst (10)"
      rows={rows}
    />
  );
}

/** 尿量（上一次观察以来是否排尿） */
function UrineOutputBlock() {
  const rows: Row[] = [
    { label: "Yes" },
    { label: "No"  },
  ];
  return (
    <Block
      title="Urine Output"
      unit="Has the patient passed urine since the last set of observations?"
      rows={rows}
    />
  );
}

export default function VitalsPaperChart() {
  return (
    <div className="bg-bg-light p-4 print:p-0 space-y-6">
      <HeartRateBlock />
      <BloodPressureBlock />
      <TemperatureBlock />
      <RespiratoryRateBlock />
      <OxygenSaturationBlock />
      <OxygenFlowRateBlock />
      <ConsciousnessBlock />
      <PainScoreBlock />
      <UrineOutputBlock />
      {/* 打印友好 */}
      <div className="text-right text-xs text-gray-500">Columns: {COLS} (adjust in code)</div>
    </div>
  );
}

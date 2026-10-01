import raw from "../../data/metrics.json";

export type Metric = {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  source?: string;
};

type MetricsFile = {
  hospitalsServed: Metric;
  litresDelivered: Metric;
  patientsSupported: Metric;
  supplyReliability: Metric;
};

const { $comment: _c, ...typed } = raw as unknown as MetricsFile & {
  $comment?: string;
};

export const metrics: MetricsFile = typed;

export const metricsOrdered: Metric[] = [
  metrics.hospitalsServed,
  metrics.litresDelivered,
  metrics.patientsSupported,
  metrics.supplyReliability,
];

export const BILLING_DISCLAIMER =
  "Usage and billing projections are estimates based on facility bed metrics and clinical usage patterns, not guaranteed fixed amounts.";

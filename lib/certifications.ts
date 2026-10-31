export type Certification = {
  /** Exam code, e.g. "AI-103". */
  code: string;
  /** Display name, without the "Microsoft Certified:" prefix. */
  name: string;
  /** Year earned. */
  year: number;
  /** Badge image in /public. A neutral placeholder badge shows if it's missing. */
  badge?: string;
};

// Microsoft's badge artwork, one per certification level, in public/certs/.
const ASSOCIATE = "/certs/microsoft-certified-associate-badge.svg";
const EXPERT = "/certs/microsoft-certified-expert-badge.svg";

// Each inner list is one row on the home page, shown in the order listed.
// Adding a cert = adding an object to the row it belongs in.
export const CERTIFICATION_ROWS: Certification[][] = [
  // Associate
  [
    { code: "AI-103", name: "Azure AI Apps and Agents Developer Associate", year: 2026, badge: ASSOCIATE },
  //   { code: "AI-200", name: "Azure AI Cloud Developer Associate", year: 2026, badge: ASSOCIATE },
  //   { code: "AI-300", name: "Machine Learning Operations Engineer Associate", year: 2027, badge: ASSOCIATE },
    { code: "AZ-104", name: "Azure Administrator Associate", year: 2026, badge: ASSOCIATE },
  ],
  // Expert
  //[
  //   { code: "AI-500", name: "Multi-Agent AI Solutions Expert", year: 2027, badge: EXPERT },
  //   { code: "AB-100", name: "Azure Solutions Architect Expert", year: 2027, badge: EXPERT },
  //]
];

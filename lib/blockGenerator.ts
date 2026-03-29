import { v4 as uuidv4 } from "uuid";
import { Block, BlockType, RiskLevel, BlockShape } from "@/types";

// All canonical shapes as 2D bitmasks
export const SHAPES: Record<string, BlockShape> = {
  I4: [[1, 1, 1, 1]],
  I3: [[1, 1, 1]],
  I2: [[1, 1]],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  DOT: [[1]],
  CORNER: [
    [1, 1],
    [1, 0],
  ],
  LONG_L: [
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 1],
  ],
};

interface BlockTemplate {
  type: BlockType;
  label: string;
  emoji: string;
  riskLevel: RiskLevel;
  insured: boolean;
  costRange: [number, number];
  allowedShapes: string[];
  color: string;
  description: string;
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    type: "health",
    label: "Health",
    emoji: "🏥",
    riskLevel: "medium",
    insured: true,
    costRange: [5000, 50000],
    allowedShapes: ["L", "J", "T", "I3"],
    color: "rose",
    description: "Medical expenses",
  },
  {
    type: "vehicle",
    label: "Vehicle",
    emoji: "🚗",
    riskLevel: "medium",
    insured: true,
    costRange: [3000, 25000],
    allowedShapes: ["I4", "I3", "O"],
    color: "blue",
    description: "Transport costs",
  },
  {
    type: "property",
    label: "Property",
    emoji: "🏠",
    riskLevel: "low",
    insured: true,
    costRange: [10000, 100000],
    allowedShapes: ["O", "I4", "S", "Z"],
    color: "amber",
    description: "Real estate",
  },
  {
    type: "lifestyle",
    label: "Lifestyle",
    emoji: "🎭",
    riskLevel: "low",
    insured: false,
    costRange: [500, 5000],
    allowedShapes: ["I2", "DOT", "S", "CORNER"],
    color: "purple",
    description: "Entertainment & fun",
  },
  {
    type: "insurance",
    label: "Insurance",
    emoji: "🛡️",
    riskLevel: "low",
    insured: true,
    costRange: [1000, 8000],
    allowedShapes: ["I2", "I3", "CORNER"],
    color: "green",
    description: "Protection policy",
  },
  {
    type: "fd",
    label: "Fixed Deposit",
    emoji: "💰",
    riskLevel: "low",
    insured: false,
    costRange: [5000, 50000],
    allowedShapes: ["I4", "O", "I3"],
    color: "emerald",
    description: "Safe investment",
  },
  {
    type: "drinking",
    label: "Drinking",
    emoji: "🍺",
    riskLevel: "high",
    insured: false,
    costRange: [500, 3000],
    allowedShapes: ["I2", "DOT", "Z", "CORNER"],
    color: "orange",
    description: "Bad habits",
  },
  {
    type: "liability",
    label: "Liability",
    emoji: "⚠️",
    riskLevel: "high",
    insured: false,
    costRange: [2000, 20000],
    allowedShapes: ["L", "J", "T"],
    color: "red",
    description: "Legal obligations",
  },
  {
    type: "assets",
    label: "Assets",
    emoji: "📈",
    riskLevel: "low",
    insured: false,
    costRange: [5000, 200000],
    allowedShapes: ["I4", "O", "I3", "LONG_L"],
    color: "teal",
    description: "Long-term investments",
  },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateBlock(): Block {
  const template = pickRandom(BLOCK_TEMPLATES);
  const shapeKey = pickRandom(template.allowedShapes);
  const shape = SHAPES[shapeKey];
  const miniBlocks = shape.flat().filter((v) => v === 1).length;
  const totalCost = randomInt(...template.costRange);

  return {
    id: uuidv4(),
    type: template.type,
    label: template.label,
    riskLevel: template.riskLevel,
    insured: template.insured,
    shape,
    miniBlocks,
    totalCost,
    color: template.color,
  };
}

export function generateInitialTray(count = 5): Block[] {
  return Array.from({ length: count }, generateBlock);
}

/**
 * Rotate a shape 90 degrees clockwise.
 */
export function rotateShape(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: BlockShape = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

/**
 * Get template info for a block type (for display purposes).
 */
export function getTemplateForType(type: BlockType): BlockTemplate | undefined {
  return BLOCK_TEMPLATES.find((t) => t.type === type);
}

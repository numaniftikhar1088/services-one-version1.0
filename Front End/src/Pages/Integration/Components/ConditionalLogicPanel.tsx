import React, { useState, useMemo, useEffect } from "react";
import type { JSX } from "react";
import Select from "react-select";
import { useQuery } from "react-query";
import { Item } from "./IntegrationConfig";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { getComparisonDBFields, getLabControlOperators } from "Services/HL7Integration";
// TypeScript interfaces
interface AdditionalCondition {
  id: number;
  logicalOperator: "AND";
  field: string;
  operator: string;
  value: string;
  valueType?: "field" | "text";
  valueField?: string;
  valueText?: string;
}
const customComponents = {
  IndicatorSeparator: () => null, // This hides the separator
};
interface Condition {
  id: number;
  type: "if" | "elseif" | "else" | "mapping";
  field: string;
  operator: string;
  value: string;
  valueType?: "field" | "text";
  valueField?: string;
  valueText?: string;
  additionalConditions: AdditionalCondition[];
  thenActions: ThenAction[];
}

interface ThenAction {
  id: number;
  separator: string;
  field: string;
  showSeparator?: boolean;
  showField?: boolean;
  valueType?: "field" | "text";
  valueField?: string;
  valueText?: string;
}

interface ConditionalLogicUIProps {
  selectedItem: Item | null;
  occurrenceNumber: number;
  occurrences: (Occurrence | null)[];
  registerPanel?: (key: string, getOccurrenceFn: () => Occurrence | null) => void;
  onAddSection?: (occurrenceNumber: number) => void;
  onRemoveSection?: (occurrenceNumber: number, sectionIndex: number) => void;
  onOccurrenceUpdate?: (
    itemId: string,
    occurrenceNumber: number,
    sectionIndex: number,
    occurrence: Occurrence
  ) => void;
}

type DbFieldOption = { value: string; label: string };

const extractDbFieldOption = (entry: unknown): DbFieldOption | null => {
  if (!entry) return null;
  if (typeof entry === "string") {
    const trimmed = entry.trim();
    return trimmed ? { value: trimmed, label: trimmed } : null;
  }
  if (typeof entry === "object") {
    const obj = entry as Record<string, unknown>;
    // Priority order for value (ID): masterModelDetailId first, then others
    const rawValue =
      obj.masterModelDetailId ??
      obj.id ??
      obj.value ??
      obj.field ??
      obj.fieldName ??
      obj.key ??
      obj.code ??
      obj.name;
    // Priority order for label (display name): displayName first, then others
    const rawLabel =
      obj.displayName ??
      obj.name ??
      obj.label ??
      obj.fieldName ??
      obj.field;
    const value =
      typeof rawValue === "number"
        ? String(rawValue)
        : typeof rawValue === "string"
        ? rawValue
        : null;
    const label =
      typeof rawLabel === "number"
        ? String(rawLabel)
        : typeof rawLabel === "string"
        ? rawLabel
        : value;
    if (value && label) {
      return { value, label };
    }
  }
  return null;
};

const collectDbFieldOptions = (
  input: unknown,
  acc: Map<string, string>
): void => {
  if (Array.isArray(input)) {
    input.forEach((item) => collectDbFieldOptions(item, acc));
    return;
  }
  
  // Try to extract an option from this input first
  const option = extractDbFieldOption(input);
  if (option) {
    // Map will automatically handle duplicates by key (value), keeping the last one
    // But we want to keep the first one, so check first
    if (!acc.has(option.value)) {
      acc.set(option.value, option.label);
    }
    // IMPORTANT: If we successfully extracted an option from this object,
    // don't recurse into its properties. This prevents extracting the same field
    // multiple times (e.g., if the object has {id: "1", name: "Field1"}, we extract it,
    // but then we'd also try to extract from "1" and "Field1" as separate values)
    return;
  }
  
  // If we couldn't extract an option from this input, recurse into object properties
  // This handles nested structures where fields might be deeper in the tree
  if (typeof input === "object" && input !== null) {
    Object.values(input as Record<string, unknown>).forEach((value) =>
      collectDbFieldOptions(value, acc)
    );
  }
};

// API Response Types
interface ControlOperator {
  controlOperatorID: number;
  key: string;
  displayName: string;
  type: string;
  value: string;
  category: string;
  orderNumber: number;
}

interface LabControlOperatorsData {
  controlFlow: ControlOperator[];
  comparison: ControlOperator[];
  delimiter: ControlOperator[];
}

interface LabControlOperatorsResponse {
  data: LabControlOperatorsData;
  message: string;
  status: string;
  httpStatusCode: number;
  error: null | any;
}

type MappingKind = "field" | "text";

interface MappingPart {
  kind: MappingKind;
  field: string | null;
  text: string | null;
  delimiter: string | null;
  delimiterCustom: string | null;
}

interface MappingRule {
  base?: MappingPart | null;
  parts?: MappingPart[];
}

interface IfRuleBranchCondition {
  joinerBefore?: string | null;
  fieldA?: string | null;
  operator?: string | null;
  valueMode?: "field" | "text" | null;
  valueField?: string | null;
  valueText?: string | null;
}

interface IfRuleBranch {
  type?: "if" | "elseif" | "else";
  conditions?: IfRuleBranchCondition[];
  then?: MappingPart[];
}

interface IfRule {
  branches?: IfRuleBranch[];
}

export interface OccurrenceFlags {
  IsRepeatable?: boolean;
  IsRepeatingGroup?: boolean;
  IsKeyControl?: boolean;
  ParentField?: boolean;
  LinkedField?: boolean;
}

export interface Occurrence {
  segmentTempId?: string;
  occurrenceNumber?: number;
  sectionIndex?: number;
  hl7Index?: string;
  flags?: OccurrenceFlags;
  mappingMode?: string | null;
  mappingRule?: MappingRule | null;
  ifRule?: IfRule | null;
  jsonRule?: string | null;
  mappingFields?: string | null;
}

const getDbFieldOptionByValue = (
  options: DbFieldOption[],
  value?: string | null
): DbFieldOption | null => {
  if (!value) return null;
  // Try exact match first
  const exactMatch = options.find((opt) => opt.value === value);
  if (exactMatch) return exactMatch;
  // Try string comparison (in case of number/string mismatch)
  const stringMatch = options.find((opt) => String(opt.value) === String(value));
  if (stringMatch) return stringMatch;
  // Return null if no match found - rely on backend data
  return null;
};

const getComparisonOptionByValue = (
  options: { value: string; label: string }[],
  value?: string | null
) => {
  if (!value) return null;
  return options.find((opt) => opt.value === value) ?? null;
};

const parseJsonRule = <T,>(jsonRule?: string | null): T | null => {
  if (!jsonRule) return null;
  try {
    return JSON.parse(jsonRule) as T;
  } catch {
    return null;
  }
};

const normalizeDelimiterValue = (
  delimiter?: string | null,
  delimiterCustom?: string | null
): string => {
  if (delimiterCustom) return delimiterCustom;
  if (!delimiter) return "";
  if (delimiter === "SPACE") return " ";
  return delimiter;
};

let uniqueIdCounter = 0;
const generateUniqueId = (): number => {
  uniqueIdCounter += 1;
  return Number(`${Date.now()}${uniqueIdCounter}`);
};

const createEmptyThenAction = (
  overrides: Partial<ThenAction> = {}
): ThenAction => ({
  id: generateUniqueId(),
  separator: "",
  field: "",
  showSeparator: true,
  showField: true,
  valueType: "field",
  valueField: "",
  valueText: "",
  ...overrides,
});

const createDefaultConditions = (): Condition[] => [
  {
    id: generateUniqueId(),
    type: "mapping",
    field: "",
    operator: "equals",
    value: "",
    valueType: "field",
    valueField: "",
    valueText: "",
    additionalConditions: [],
    thenActions: [
      createEmptyThenAction({
        separator: "",
      }),
    ],
  },
];

const mappingPartToThenAction = (
  part: MappingPart,
  index: number
): ThenAction => {
  const valueType = part.kind === "text" ? "text" : "field";
  const hasFieldValue = Boolean(part.field);
  const hasTextValue = Boolean(part.text);
  const separator = normalizeDelimiterValue(part.delimiter, part.delimiterCustom);
  
  // showSeparator: true if delimiter exists and is not empty string
  const showSeparator = Boolean(separator && separator !== "");
  
  // showField: For base field (index 0), always show the dropdown so users can select a value.
  // For parts (index > 0), only show if field or text has a value.
  const showField = index === 0 ? true : (hasFieldValue || hasTextValue);

  return createEmptyThenAction({
    id: generateUniqueId() + index,
    separator,
    showSeparator,
    showField,
    valueType,
    valueField: valueType === "field" ? part.field ?? "" : undefined,
    valueText: valueType === "text" ? part.text ?? "" : undefined,
    field: hasFieldValue ? part.field ?? "" : "",
  });
};

const buildMappingCondition = (rule: MappingRule | null | undefined): Condition | null => {
  if (!rule) return null;
  const parts: MappingPart[] = [];
  if (rule.base) parts.push(rule.base);
  if (Array.isArray(rule.parts)) {
    parts.push(...rule.parts.filter(Boolean) as MappingPart[]);
  }
  if (!parts.length) {
    return null;
  }
  return {
    id: generateUniqueId(),
    type: "mapping",
    field: "",
    operator: "equals",
    value: "",
    valueType: "field",
    valueField: "",
    valueText: "",
    additionalConditions: [],
    thenActions: parts.map((part, idx) => mappingPartToThenAction(part, idx)),
  };
};

const branchConditionToAdditional = (
  condition: IfRuleBranchCondition,
  index: number
): AdditionalCondition => {
  // Always use "AND" as backend doesn't support OR conditions
  const logicalOperator = "AND";
  const valueType = condition.valueMode === "text" ? "text" : "field";
  return {
    id: generateUniqueId() + index,
    logicalOperator,
    field: condition.fieldA ?? "",
    operator: condition.operator ?? "",
    value: valueType === "text"
      ? condition.valueText ?? ""
      : condition.valueField ?? "",
    valueType,
    valueField: valueType === "field" ? condition.valueField ?? "" : undefined,
    valueText: valueType === "text" ? condition.valueText ?? "" : undefined,
  };
};

const buildConditionFromBranch = (branch: IfRuleBranch): Condition | null => {
  const branchConditions = branch.conditions ?? [];
  const [primary, ...rest] = branchConditions;
  const branchType =
    branch.type === "elseif" || branch.type === "else" ? branch.type : "if";

  const baseCondition: Condition = {
    id: generateUniqueId(),
    type: branchType,
    field: primary?.fieldA ?? "",
    operator: primary?.operator ?? "equals",
    value: "",
    valueType: primary?.valueMode === "text" ? "text" : "field",
    valueField:
      primary?.valueMode === "field" ? primary?.valueField ?? "" : undefined,
    valueText:
      primary?.valueMode === "text" ? primary?.valueText ?? "" : undefined,
    additionalConditions: rest.map((cond, idx) =>
      branchConditionToAdditional(cond, idx)
    ),
    thenActions: (branch.then ?? []).map((part, idx) =>
      mappingPartToThenAction(part, idx)
    ),
  };

  if (!baseCondition.thenActions.length) {
    baseCondition.thenActions = [createEmptyThenAction()];
  }

  return baseCondition;
};

const transformOccurrenceToConditions = (occurrence: Occurrence): Condition[] => {
  if (!occurrence) return [];
  const mode = (occurrence.mappingMode ?? "").toLowerCase();

  if (mode === "mapping") {
    const mappingRule =
      occurrence.mappingRule ??
      parseJsonRule<MappingRule>(occurrence.jsonRule);
    const mappingCondition = buildMappingCondition(mappingRule);
    return mappingCondition ? [mappingCondition] : [];
  }

  if (mode === "if") {
    const ifRule =
      occurrence.ifRule ?? parseJsonRule<IfRule>(occurrence.jsonRule);
    if (!ifRule?.branches?.length) {
      return [];
    }
    return ifRule.branches
      .map((branch) => buildConditionFromBranch(branch))
      .filter(Boolean) as Condition[];
  }

  return [];
};

// Convert conditions back to Occurrence format for saving
const transformConditionsToOccurrence = (
  conditions: Condition[],
  originalOccurrence?: Occurrence | null
): Occurrence => {
  if (!conditions.length) {
    return {
      segmentTempId: originalOccurrence?.segmentTempId,
      occurrenceNumber: originalOccurrence?.occurrenceNumber,
      sectionIndex: originalOccurrence?.sectionIndex,
      hl7Index: originalOccurrence?.hl7Index,
      flags: originalOccurrence?.flags || {
        IsRepeatable: false,
        IsRepeatingGroup: false,
        IsKeyControl: false,
        ParentField: false,
        LinkedField: false,
      },
      mappingMode: null,
      mappingRule: null,
      ifRule: null,
      jsonRule: null,
      mappingFields: null,
    };
  }

  const firstCondition = conditions[0];

  // Handle mapping mode
  if (firstCondition.type === "mapping") {
    // Build parts array
    const allParts: MappingPart[] = [];
    
    firstCondition.thenActions.forEach((action) => {
      // Determine the kind based on what's shown
      let kind: MappingKind = "field";
      let field: string | null = null;
      let text: string | null = null;
      
      if (action.showField) {
        if (action.valueType === "text") {
          kind = "text";
          text = action.valueText || null;
        } else {
          kind = "field";
          // Use valueField which should contain the ID
          field = action.valueField || null;
        }
      }
      
      // If only separator is shown (no field), create delimiter-only object
      if (!action.showField && action.showSeparator) {
        kind = "field";
        field = null;
        text = null;
      }
      
      const part: MappingPart = {
        kind,
        field,
        text,
        delimiter: action.showSeparator && action.separator ? action.separator : "",
        delimiterCustom: null,
      };
      allParts.push(part);
    });

    // Filter out empty parts (no field, no text, no delimiter)
    const validParts = allParts.filter((part) => {
      if (part.field) return true;
      if (part.text) return true;
      if (part.delimiter && part.delimiter !== "") return true;
      return false;
    });

    // Extract all field IDs from validParts before splitting
    const fieldIds = new Set<string>();
    validParts.forEach((part) => {
      if (part.field) {
        fieldIds.add(part.field);
      }
    });
    const mappingFields = Array.from(fieldIds).sort().join(",");

    // First field with actual value goes to base, rest goes to parts
    let base: MappingPart | null = null;
    const parts: MappingPart[] = [];
    
    let foundBase = false;
    validParts.forEach((part) => {
      if (!foundBase && (part.field !== null || part.text !== null)) {
        base = part;
        foundBase = true;
      } else {
        parts.push(part);
      }
    });

    const mappingRule: MappingRule = base ? { base, parts } : { parts };

    return {
      segmentTempId: originalOccurrence?.segmentTempId,
      occurrenceNumber: originalOccurrence?.occurrenceNumber,
      sectionIndex: originalOccurrence?.sectionIndex,
      hl7Index: originalOccurrence?.hl7Index,
      flags: originalOccurrence?.flags || {
        IsRepeatable: false,
        IsRepeatingGroup: false,
        IsKeyControl: false,
        ParentField: false,
        LinkedField: false,
      },
      mappingMode: "mapping",
      mappingRule,
      ifRule: null,
      jsonRule: JSON.stringify(mappingRule),
      mappingFields: mappingFields || null,
    };
  }

  // Handle if/elseif/else mode
  const branches: IfRuleBranch[] = conditions.map((condition) => {
    const branch: IfRuleBranch = {
      type: condition.type as "if" | "elseif" | "else",
      conditions: [],
      then: [],
    };

    // Build conditions
    if (condition.type !== "else") {
      const branchConditions: IfRuleBranchCondition[] = [];
      
      // Main condition (first condition should have joinerBefore as "AND")
      if (condition.field || condition.value) {
        branchConditions.push({
          joinerBefore: "AND",
          fieldA: condition.field || null,
          operator: condition.operator || null,
          valueMode: (condition.valueType as "field" | "text") || "field",
          valueField: condition.valueType === "field" ? (condition.valueField || null) : null,
          valueText: condition.valueType === "text" ? (condition.valueText || null) : null,
        });
      }

      // Additional conditions
      condition.additionalConditions.forEach((addCond) => {
        branchConditions.push({
          joinerBefore: addCond.logicalOperator,
          fieldA: addCond.field || null,
          operator: addCond.operator || null,
          valueMode: (addCond.valueType as "field" | "text") || "field",
          valueField: addCond.valueType === "field" ? (addCond.valueField || null) : null,
          valueText: addCond.valueType === "text" ? (addCond.valueText || null) : null,
        });
      });

      branch.conditions = branchConditions;
    }

    // Build then actions (same logic as mapping mode)
    const thenParts: MappingPart[] = condition.thenActions
      .map((action) => {
        let kind: MappingKind = "field";
        let field: string | null = null;
        let text: string | null = null;
        
        if (action.showField) {
          if (action.valueType === "text") {
            kind = "text";
            text = action.valueText || null;
          } else {
            kind = "field";
            // Use valueField which should contain the ID
            field = action.valueField || null;
          }
        }
        
        // If only separator is shown (no field), create delimiter-only object
        if (!action.showField && action.showSeparator) {
          kind = "field";
          field = null;
          text = null;
        }
        
        return {
          kind,
          field,
          text,
          delimiter: action.showSeparator && action.separator ? action.separator : "",
          delimiterCustom: null,
        };
      })
      .filter((part) => {
        if (part.field) return true;
        if (part.text) return true;
        if (part.delimiter && part.delimiter !== "") return true;
        return false;
      });

    branch.then = thenParts;
    return branch;
  });

  const ifRule: IfRule = { branches };

  // Extract all field IDs from if/elseif/else rule for mappingFields
  const fieldIds = new Set<string>();
  branches.forEach((branch) => {
    // Extract from conditions
    branch.conditions?.forEach((cond) => {
      if (cond.fieldA) {
        fieldIds.add(cond.fieldA);
      }
      if (cond.valueField) {
        fieldIds.add(cond.valueField);
      }
    });
    // Extract from then array
    branch.then?.forEach((part) => {
      if (part.field) {
        fieldIds.add(part.field);
      }
    });
  });
  const mappingFields = Array.from(fieldIds).sort().join(",");

  return {
    segmentTempId: originalOccurrence?.segmentTempId,
    occurrenceNumber: originalOccurrence?.occurrenceNumber,
    sectionIndex: originalOccurrence?.sectionIndex,
    hl7Index: originalOccurrence?.hl7Index,
    flags: originalOccurrence?.flags || {
      IsRepeatable: false,
      IsRepeatingGroup: false,
      IsKeyControl: false,
      ParentField: false,
      LinkedField: false,
    },
    mappingMode: "if",
    mappingRule: null,
    ifRule,
    jsonRule: JSON.stringify(ifRule),
    mappingFields: mappingFields || null,
  };
};

// Sub-component for rendering a single occurrence section
const OccurrenceSection: React.FC<{
  selectedItem: Item | null;
  occurrence: Occurrence | null;
  occurrenceNumber: number;
  sectionIndex: number;
  registerPanel?: (key: string, getOccurrenceFn: () => Occurrence | null) => void;
  onUpdateHl7Index?: (occurrenceNumber: number, sectionIndex: number, hl7Index: string) => void;
  onUpdateFlags?: (occurrenceNumber: number, sectionIndex: number, flags: OccurrenceFlags) => void;
  onAddSection?: (occurrenceNumber: number) => void;
  onRemoveSection?: (occurrenceNumber: number, sectionIndex: number) => void;
  onOccurrenceUpdate?: (
    itemId: string,
    occurrenceNumber: number,
    sectionIndex: number,
    occurrence: Occurrence
  ) => void;
  isLastSection?: boolean;
}> = ({
  selectedItem,
  occurrence,
  occurrenceNumber,
  sectionIndex,
  registerPanel,
  onUpdateHl7Index,
  onUpdateFlags,
  onAddSection,
  onRemoveSection,
  onOccurrenceUpdate,
  isLastSection = false,
}) => {
  const { data: dbFieldResponse } = useQuery(
    ["ComparisonDBFields"],
    () => getComparisonDBFields(),
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  const { data: labControlOperatorsResponse } = useQuery(
    ["labControlOperators"],
    () => getLabControlOperators(),
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  const options = useMemo<DbFieldOption[]>(() => {
    const apiFields = new Map<string, string>();
    const rawFields = dbFieldResponse?.data?.data;

    if (rawFields) {
      collectDbFieldOptions(rawFields, apiFields);
    }

    // Convert Map to array and ensure no duplicates (by value)
    const uniqueOptions = Array.from(apiFields.entries()).map(([value, label]) => ({
      value,
      label,
    }));
    
    // Additional deduplication by value (in case Map didn't catch everything)
    const seen = new Set<string>();
    const deduplicated = uniqueOptions.filter((opt) => {
      if (seen.has(opt.value)) {
        return false;
      }
      seen.add(opt.value);
      return true;
    });
    
    // Sort by label for better UX
    return deduplicated.sort((a, b) => a.label.localeCompare(b.label));
  }, [dbFieldResponse]);

  // Transform API data into usable formats
  const controlFlowOptions = useMemo(() => {
    const controlFlowData = labControlOperatorsResponse?.data?.data?.controlFlow;
    if (!controlFlowData || !Array.isArray(controlFlowData)) {
      return [];
    }
    return controlFlowData
      .sort((a: ControlOperator, b: ControlOperator) => a.orderNumber - b.orderNumber)
      .map((item: ControlOperator) => ({
        value: item.key,
        label: item.displayName,
      }));
  }, [labControlOperatorsResponse]);

  const comparisonOperatorOptions = useMemo<
    { value: string; label: string }[]
  >(() => {
    const comparisonData = labControlOperatorsResponse?.data?.data?.comparison;
    if (!comparisonData || !Array.isArray(comparisonData)) {
      return [];
    }
    return comparisonData
      .sort((a: ControlOperator, b: ControlOperator) => a.orderNumber - b.orderNumber)
      .map((item: ControlOperator) => ({
        value: item.key ?? item.displayName ?? "",
        label: item.value ?? item.displayName ?? item.key ?? "",
      }));
  }, [labControlOperatorsResponse]);

  // Create separator options for Select component
  const separatorOptions = useMemo<Array<{ value: string; label: string }>>(() => {
    const delimiterData = labControlOperatorsResponse?.data?.data?.delimiter;
    if (!delimiterData || !Array.isArray(delimiterData)) {
      return [];
    }
    return delimiterData
      .sort((a: ControlOperator, b: ControlOperator) => a.orderNumber - b.orderNumber)
      .map((item: ControlOperator) => {
        let value = item.value;
        if (value === "SPACE") {
          value = " ";
        }
        return {
          value: value,
          label: item.displayName,
        };
      });
  }, [labControlOperatorsResponse]);

  const [conditions, setConditions] = useState<Condition[]>(() =>
    createDefaultConditions()
  );

  useEffect(() => {
    if (!occurrence) {
      setConditions(createDefaultConditions());
      return;
    }
    const transformed = transformOccurrenceToConditions(occurrence);
    if (transformed.length) {
      setConditions(transformed);
      return;
    }
    setConditions(createDefaultConditions());
  }, [occurrence]);

  // Store conditions in a ref so we can access latest value without causing re-renders
  const conditionsRef = React.useRef(conditions);
  const occurrenceRef = React.useRef(occurrence);
  
  // Track if user has made any modifications (to avoid syncing default/initial state)
  const isDirtyRef = React.useRef(false);
  
  useEffect(() => {
    conditionsRef.current = conditions;
    occurrenceRef.current = occurrence;
  }, [conditions, occurrence]);
  
  useEffect(() => {
    isDirtyRef.current = false;
  }, [occurrence]);

  // State for HL7Index and flags
  const [hl7Index, setHl7Index] = useState<string>(
    occurrence?.hl7Index ?? String(sectionIndex)
  );
  const [flags, setFlags] = useState<OccurrenceFlags>(
    occurrence?.flags || {
      IsRepeatable: false,
      IsRepeatingGroup: false,
      IsKeyControl: false,
      ParentField: false,
      LinkedField: false,
    }
  );

  // Store hl7Index and flags in refs to always get latest values
  const hl7IndexRef = React.useRef(hl7Index);
  const flagsRef = React.useRef(flags);

  useEffect(() => {
    hl7IndexRef.current = hl7Index;
  }, [hl7Index]);

  useEffect(() => {
    flagsRef.current = flags;
  }, [flags]);

  // Update local state when occurrence changes
  useEffect(() => {
    if (occurrence) {
      setHl7Index(occurrence.hl7Index ?? String(sectionIndex));
      setFlags(occurrence.flags || {
        IsRepeatable: false,
        IsRepeatingGroup: false,
        IsKeyControl: false,
        ParentField: false,
        LinkedField: false,
      });
    }
  }, [occurrence, sectionIndex]);

  // Handle HL7Index change with validation
  const handleHl7IndexChange = (value: string) => {
    // Only allow numbers 0-9 and dot
    const validPattern = /^[0-9.]*$/;
    if (validPattern.test(value)) {
      isDirtyRef.current = true;
      setHl7Index(value);
      if (onUpdateHl7Index) {
        onUpdateHl7Index(occurrenceNumber, sectionIndex, value);
      }
    }
  };

  // Handle flags change
  const handleFlagChange = (flagName: keyof OccurrenceFlags, checked: boolean) => {
    isDirtyRef.current = true;
    const newFlags = { ...flags, [flagName]: checked };
    setFlags(newFlags);
    if (onUpdateFlags) {
      onUpdateFlags(occurrenceNumber, sectionIndex, newFlags);
    }
  };

  // Register this panel with parent so it can collect data on save
  // Re-register whenever conditions, hl7Index, or flags change to ensure latest data
  useEffect(() => {
    if (!selectedItem || !registerPanel) return;
    
    const panelKey = `${selectedItem.id}-${occurrenceNumber}-${sectionIndex}`;
    
    const getCurrentOccurrence = (): Occurrence | null => {
      // Always use the latest conditions from ref
      const latestConditions = conditionsRef.current;
      const latestOriginalOccurrence = occurrenceRef.current;
      
      // Get the base occurrence with mapping/ifRule data
      const baseOccurrence = transformConditionsToOccurrence(latestConditions, latestOriginalOccurrence);
      
      // Merge with current state, preserving all fields
      const currentOccurrence: Occurrence = {
        ...baseOccurrence,
        segmentTempId: selectedItem.id,
        occurrenceNumber: occurrenceNumber,
        sectionIndex: sectionIndex,
        hl7Index: hl7IndexRef.current,
        flags: flagsRef.current,
      };
      
      // Always return the occurrence, even if mapping data is null (user hasn't configured it yet)
      return currentOccurrence;
    };
    
    registerPanel(panelKey, getCurrentOccurrence);
  }, [selectedItem, occurrenceNumber, sectionIndex, registerPanel, conditions, hl7Index, flags]);

  const onOccurrenceUpdateRef = React.useRef(onOccurrenceUpdate);
  useEffect(() => {
    onOccurrenceUpdateRef.current = onOccurrenceUpdate;
  }, [onOccurrenceUpdate]);

  // Sync state to parent when component unmounts (accordion closes or item switches)
  useEffect(() => {
    const itemId = selectedItem?.id;
    
    return () => {
      // Cleanup: sync current state to parent before unmounting
      if (!isDirtyRef.current) return;
      if (!itemId || !onOccurrenceUpdateRef.current) return;
      
      const latestConditions = conditionsRef.current;
      const latestOriginalOccurrence = occurrenceRef.current;
      
      const baseOccurrence = transformConditionsToOccurrence(latestConditions, latestOriginalOccurrence);

      const currentOccurrence: Occurrence = {
        ...baseOccurrence,
        segmentTempId: itemId,
        occurrenceNumber: occurrenceNumber,
        sectionIndex: sectionIndex,
        hl7Index: hl7IndexRef.current,
        flags: flagsRef.current,
      };
      
      onOccurrenceUpdateRef.current(itemId, occurrenceNumber, sectionIndex, currentOccurrence);
    };
  }, [selectedItem?.id, occurrenceNumber, sectionIndex]);

  // Functions
  const addCondition = (conditionId: number): void => {
    isDirtyRef.current = true;
    setConditions(
      conditions.map((condition) => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            additionalConditions: [
              ...condition.additionalConditions,
              {
                id: Date.now(),
                logicalOperator: "AND" as const,
                field: "",
                operator: "less than",
                value: "",
                valueType: "field",
                valueField: "",
                valueText: "",
              },
            ],
          };
        }
        return condition;
      })
    );
  };

  const updateCondition = (
    conditionId: number,
    field: keyof Omit<Condition, "id" | "additionalConditions">,
    value: string
  ): void => {
    isDirtyRef.current = true;
    setConditions(
      conditions.map((condition) => {
        if (condition.id === conditionId) {
          return { ...condition, [field]: value };
        }
        return condition;
      })
    );
  };

  const updateAdditionalCondition = (
    conditionId: number,
    additionalId: number,
    field: keyof Omit<AdditionalCondition, "id">,
    value: string | "AND"
  ): void => {
    isDirtyRef.current = true;
    setConditions(
      conditions.map((condition) => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            additionalConditions: condition.additionalConditions.map(
              (additional) => {
                if (additional.id === additionalId) {
                  return { ...additional, [field]: value };
                }
                return additional;
              }
            ),
          };
        }
        return condition;
      })
    );
  };

  const removeAdditionalCondition = (
    conditionId: number,
    additionalId: number
  ): void => {
    isDirtyRef.current = true;
    setConditions(
      conditions.map((condition) => {
        if (condition.id === conditionId) {
          return {
            ...condition,
            additionalConditions: condition.additionalConditions.filter(
              (additional) => additional.id !== additionalId
            ),
          };
        }
        return condition;
      })
    );
  };

  const addThenAction = (conditionId: number): void => {
    isDirtyRef.current = true;
    setConditions((prev) =>
      prev.map((c) => {
        if (c.id !== conditionId) return c;
        return {
          ...c,
          thenActions: [
            ...c.thenActions,
            createEmptyThenAction({
              id: Date.now(),
              separator: ",",
              showSeparator: true,
            }),
          ],
        };
      })
    );
  };

  const updateThenAction = (
    conditionId: number,
    actionId: number,
    field: keyof Omit<ThenAction, "id">,
    value: string
  ): void => {
    isDirtyRef.current = true;
    setConditions((prev) =>
      prev.map((c) => {
        if (c.id !== conditionId) return c;
        return {
          ...c,
          thenActions: c.thenActions.map((a) =>
            a.id === actionId ? { ...a, [field]: value } : a
          ),
        };
      })
    );
  };

  const removeThenActionSeparator = (
    conditionId: number,
    actionId: number
  ): void => {
    isDirtyRef.current = true;
    setConditions((prev) =>
      prev.map((c) => {
        if (c.id !== conditionId) return c;
        return {
          ...c,
          thenActions: c.thenActions.map((a) =>
            a.id === actionId ? { ...a, separator: "", showSeparator: false } : a
          ),
        };
      })
    );
  };

  const removeThenActionField = (
    conditionId: number,
    actionId: number
  ): void => {
    isDirtyRef.current = true;
    setConditions((prev) =>
      prev.map((c) => {
        if (c.id !== conditionId) return c;
        return {
          ...c,
          thenActions: c.thenActions.map((a) =>
            a.id === actionId ? { ...a, showField: false } : a
          ),
        };
      })
    );
  };

  const addClause = (type: "elseif" | "else"): void => {
    isDirtyRef.current = true;
    setConditions((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        field: "",
        operator: "less than",
        value: "",
        valueType: "field",
        valueField: "",
        valueText: "",
        additionalConditions: [],
        thenActions: [
          createEmptyThenAction({
            id: Date.now() + 1,
            separator: "",
            showSeparator: false,
          }),
        ],
      },
    ]);
  };

  const removeCondition = (conditionId: number): void => {
    isDirtyRef.current = true;
    setConditions((prev) => prev.filter((c) => c.id !== conditionId));
  };

  const renderCondition = (
    condition: Condition,
    index: number
  ): JSX.Element => {
    return (
      <div key={condition.id} className="">
        <div className="row align-items-center mb-2">
          <div className="col-12">
            <div className="row g-2 align-items-baseline">
              {/* Clause type dropdown */}
              <div className="col-auto">
                <Select
                  inputId="integrationName"
                  theme={(theme) => styles(theme)}
                  options={(() => {
                    if (index === 0) {
                      // First item: filter to show only "if" and "mapping"
                      return controlFlowOptions.filter(
                        (opt: { value: string; label: string }) => opt.value === "if" || opt.value === "mapping"
                      );
                    }
                    const isLast = index === conditions.length - 1;
                    if (isLast && condition.type === "else") {
                      // Last item if it's "else": allow switching between "elseif" and "else"
                      return controlFlowOptions.filter(
                        (opt: { value: string; label: string }) => opt.value === "elseif" || opt.value === "else"
                      );
                    }
                    // For other items, show only the current type
                    const currentOption = controlFlowOptions.find(
                      (opt: { value: string; label: string }) => opt.value === condition.type
                    );
                    return currentOption
                      ? [currentOption]
                      : [
                          {
                            value: condition.type as any,
                            label: condition.type as any,
                          },
                        ];
                  })()}
                  name="integrationName"
                  components={customComponents}
                  styles={{
                    ...reactSelectSMStyle,
                    control: (provided) => ({
                      ...provided,
                      // minHeight: '40px',
                      minWidth: "100px",
                      border: "1px solid #e5e5e5",
                      borderRadius: "6px",
                      "&:hover": {
                        border: "1px solid #e5e5e5",
                      },
                    }),
                  }}
                  menuPortalTarget={document.body}
                  placeholder="--- Select ---"
                  value={{ value: condition.type, label: condition.type }}
                  onChange={(opt) => {
                    const isFirst = index === 0;
                    const isLast = index === conditions.length - 1;
                    const selected = opt as {
                      value: "if" | "mapping" | "elseif" | "else";
                    } | null;
                    if (!selected) return;
                    if (isFirst) {
                      if (selected.value === "if") {
                        updateCondition(condition.id, "type", "if");
                      } else if (selected.value === "mapping") {
                        // switch to mapping → drop all other clauses
                        isDirtyRef.current = true;
                        setConditions((prev) => {
                          const first = prev[0];
                          if (!first) return prev;
                          const updatedFirst = {
                            ...first,
                            type: "mapping" as const,
                          };
                          return [updatedFirst];
                        });
                      }
                      return;
                    }
                    if (isLast && condition.type === "else") {
                      // allow flipping last else <-> elseif
                      if (
                        selected.value === "elseif" ||
                        selected.value === "else"
                      ) {
                        updateCondition(condition.id, "type", selected.value);
                      }
                    }
                  }}
                  isSearchable={true}
                  isDisabled={(() => {
                    if (index === 0) return false;
                    const isLast = index === conditions.length - 1;
                    return !(isLast && condition.type === "else");
                  })()}
                  className="z-index-3 w-100"
                />
              </div>

              {/* Field dropdown */}
              {(condition.type === "if" || condition.type === "elseif") && (
                <div className="col-auto">
                  <Select
                    inputId="integrationName"
                    theme={(theme) => styles(theme)}
                    options={options}
                    components={customComponents}
                    name="integrationName"
                    value={getDbFieldOptionByValue(options, condition.field)}
                    styles={{
                      ...reactSelectSMStyle,
                      control: (provided) => ({
                        ...provided,
                        minWidth: "140px",
                        border: "1px solid #e5e5e5",
                        borderRadius: "6px",
                        "&:hover": {
                          border: "1px solid #e5e5e5",
                        },
                      }),
                    }}
                    menuPortalTarget={document.body}
                    placeholder="--- Select ---"
                    isSearchable={true}
                    className="z-index-3 w-100"
                    onChange={(opt) => {
                      const selected = opt as DbFieldOption | null;
                      updateCondition(
                        condition.id,
                        "field",
                        selected?.value ?? ""
                      );
                    }}
                  />
                </div>
              )}

              {/* Operator dropdown */}
              {(condition.type === "if" || condition.type === "elseif") && (
                <div className="col-auto">
                  <Select
                    inputId="integrationName"
                    theme={(theme) => styles(theme)}
                    options={comparisonOperatorOptions}
                    name="integrationName"
                    components={customComponents}
                    value={getComparisonOptionByValue(
                      comparisonOperatorOptions,
                      condition.operator
                    )}
                    styles={{
                      ...reactSelectSMStyle,
                      control: (provided) => ({
                        ...provided,
                        minWidth: "140px",
                        border: "1px solid #e5e5e5",
                        borderRadius: "6px",
                        "&:hover": {
                          border: "1px solid #e5e5e5",
                        },
                      }),
                    }}
                    menuPortalTarget={document.body}
                    placeholder="--- Select ---"
                    isSearchable={true}
                    className="z-index-3 w-100"
                    onChange={(opt) => {
                      const selected = opt as { value: string } | null;
                      updateCondition(
                        condition.id,
                        "operator",
                        selected?.value ?? ""
                      );
                    }}
                  />
                </div>
              )}

              {/* Comparison value input */}
              {(condition.type === "if" || condition.type === "elseif") && (
                <div className="col-auto">
                  {condition.valueType === "text" ? (
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="text"
                        name="comparisonText"
                        placeholder="Comparison Value"
                        value={condition.valueText ?? ""}
                        onChange={(e) =>
                          updateCondition(
                            condition.id,
                            "valueText",
                            e.target.value
                          )
                        }
                        style={{
                          minWidth: "140px",
                          height: "40px",
                          padding: "8px 12px",
                          border: "1px solid #e5e5e5",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        className="btn btn-icon btn-icon-light btn-sm fw-bold btn-secondary rounded "
                        onClick={() =>
                          updateCondition(condition.id, "valueType", "field")
                        }
                        style={{ width: "32px" }}
                        type="button"
                      >
                        <i
                          className="bi bi-arrow-repeat"
                          style={{ fontSize: "16px" }}
                        ></i>
                      </button>
                    </div>
                  ) : (
                    <Select
                      inputId="comparisonFieldOrText"
                      theme={(theme) => styles(theme)}
                      options={[
                        { value: "__TEXT__", label: "text" },
                        ...options,
                      ]}
                      name="comparisonFieldOrText"
                      components={customComponents}
                      styles={{
                        ...reactSelectSMStyle,
                        control: (provided) => ({
                          ...provided,
                          minWidth: "140px",
                          border: "1px solid #e5e5e5",
                          borderRadius: "6px",
                          "&:hover": {
                            border: "1px solid #e5e5e5",
                          },
                        }),
                      }}
                      menuPortalTarget={document.body}
                      placeholder="--- Select ---"
                      isSearchable={true}
                      className="z-index-3 w-100"
                      // // @ts-expect-error value can be undefined initially
                      value={
                        condition.valueField && condition.valueType === "field"
                          ? getDbFieldOptionByValue(
                              options,
                              condition.valueField
                            ) ?? {
                              value: condition.valueField,
                              label: condition.valueField,
                            }
                          : undefined
                      }
                      onChange={(opt) => {
                        const selected = opt as { value: string } | null;
                        if (!selected) return;
                        if (selected.value === "__TEXT__") {
                          updateCondition(condition.id, "valueType", "text");
                        } else {
                          isDirtyRef.current = true;
                          setConditions((prev) =>
                            prev.map((c) => {
                              if (c.id !== condition.id) return c;
                              return {
                                ...c,
                                valueType: "field",
                                valueField: selected.value,
                              };
                            })
                          );
                        }
                      }}
                    />
                  )}
                </div>
              )}
              {/* Add condition button */}
              {(condition.type === "if" || condition.type === "elseif") && (
                <div className="col-auto">
                  {/* Additional conditions (OR/AND) */}
                  {condition.additionalConditions.map(
                    (additionalCondition: AdditionalCondition) => (
                      <div
                        key={additionalCondition.id}
                        className="d-inline-block me-3 mb-2 ms-4"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div className="col-auto">
                            <span className="fw-bold">
                              {additionalCondition.logicalOperator}
                            </span>
                          </div>

                          {/* Field dropdown */}
                          <Select
                            inputId="integrationName"
                            theme={(theme) => styles(theme)}
                            options={options}
                            name="integrationName"
                            value={getDbFieldOptionByValue(
                              options,
                              additionalCondition.field
                            )}
                            components={customComponents}
                            styles={{
                              ...reactSelectSMStyle,
                              control: (provided) => ({
                                ...provided,
                                minWidth: "140px",
                                border: "1px solid #e5e5e5",
                                borderRadius: "6px",
                                "&:hover": {
                                  border: "1px solid #e5e5e5",
                                },
                              }),
                            }}
                            menuPortalTarget={document.body}
                            placeholder="--- Select ---"
                            isSearchable={true}
                            className="z-index-3 w-100"
                            onChange={(opt) => {
                              const selected = opt as DbFieldOption | null;
                              isDirtyRef.current = true;
                              setConditions((prev) =>
                                prev.map((c) => {
                                  if (c.id !== condition.id) return c;
                                  return {
                                    ...c,
                                    additionalConditions: c.additionalConditions.map(
                                      (ac) =>
                                        ac.id === additionalCondition.id
                                          ? {
                                              ...ac,
                                              field: selected?.value ?? "",
                                            }
                                          : ac
                                    ),
                                  };
                                })
                              );
                            }}
                          />

                          {/* Operator dropdown */}
                          <Select
                            inputId="integrationName"
                            theme={(theme) => styles(theme)}
                            options={comparisonOperatorOptions}
                            name="integrationName"
                            components={customComponents}
                            value={getComparisonOptionByValue(
                              comparisonOperatorOptions,
                              additionalCondition.operator
                            )}
                            styles={{
                              ...reactSelectSMStyle,
                              control: (provided) => ({
                                ...provided,
                                minWidth: "140px",
                                border: "1px solid #e5e5e5",
                                borderRadius: "6px",
                                "&:hover": {
                                  border: "1px solid #e5e5e5",
                                },
                              }),
                            }}
                            menuPortalTarget={document.body}
                            placeholder="--- Select ---"
                            isSearchable={true}
                            className="z-index-3 w-100"
                            onChange={(opt) => {
                              const selected = opt as { value: string } | null;
                              isDirtyRef.current = true;
                              setConditions((prev) =>
                                prev.map((c) => {
                                  if (c.id !== condition.id) return c;
                                  return {
                                    ...c,
                                    additionalConditions: c.additionalConditions.map(
                                      (ac) =>
                                        ac.id === additionalCondition.id
                                          ? {
                                              ...ac,
                                              operator: selected?.value ?? "",
                                            }
                                          : ac
                                    ),
                                  };
                                })
                              );
                            }}
                          />

                          {/* Comparison value input */}
                          {additionalCondition.valueType === "text" ? (
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="text"
                                name="comparisonText"
                                placeholder="Comparison Value"
                                value={additionalCondition.valueText ?? ""}
                                onChange={(e) =>
                                  updateAdditionalCondition(
                                    condition.id,
                                    additionalCondition.id,
                                    "valueText",
                                    e.target.value
                                  )
                                }
                                style={{
                                  minWidth: "140px",
                                  height: "40px",
                                  padding: "8px 12px",
                                  border: "1px solid #e5e5e5",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  outline: "none",
                                  backgroundColor: "white",
                                }}
                              />
                              <button
                                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-secondary rounded "
                                onClick={() =>
                                  updateAdditionalCondition(
                                    condition.id,
                                    additionalCondition.id,
                                    "valueType",
                                    "field"
                                  )
                                }
                                style={{ width: "32px" }}
                                type="button"
                              >
                                <i
                                  className="bi bi-arrow-repeat"
                                  style={{ fontSize: "16px" }}
                                ></i>
                              </button>
                            </div>
                          ) : (
                            <Select
                              inputId="comparisonFieldOrTextAdditional"
                              theme={(theme) => styles(theme)}
                              options={[
                                { value: "__TEXT__", label: "text" },
                                ...options,
                              ]}
                              name="comparisonFieldOrTextAdditional"
                              components={customComponents}
                              styles={{
                                ...reactSelectSMStyle,
                                control: (provided) => ({
                                  ...provided,
                                  minWidth: "140px",
                                  border: "1px solid #e5e5e5",
                                  borderRadius: "6px",
                                  "&:hover": {
                                    border: "1px solid #e5e5e5",
                                  },
                                }),
                              }}
                              menuPortalTarget={document.body}
                              placeholder="--- Select ---"
                              isSearchable={true}
                              className="z-index-3 w-100"
                              // // @ts-expect-error value can be undefined initially
                              value={
                                additionalCondition.valueField
                                  ? {
                                      value: additionalCondition.valueField,
                                      label:
                                        getDbFieldOptionByValue(
                                          options,
                                          additionalCondition.valueField
                                        )?.label ??
                                        additionalCondition.valueField,
                                    }
                                  : undefined
                              }
                              onChange={(opt) => {
                                const selected = opt as {
                                  value: string;
                                } | null;
                                if (!selected) return;
                                if (selected.value === "__TEXT__") {
                                  updateAdditionalCondition(
                                    condition.id,
                                    additionalCondition.id,
                                    "valueType",
                                    "text"
                                  );
                                } else {
                                  isDirtyRef.current = true;
                                  setConditions((prev) =>
                                    prev.map((c) => {
                                      if (c.id !== condition.id) return c;
                                      return {
                                        ...c,
                                        additionalConditions:
                                          c.additionalConditions.map((ac) =>
                                            ac.id === additionalCondition.id
                                              ? {
                                                  ...ac,
                                                  valueType: "field",
                                                  valueField: selected.value,
                                                }
                                              : ac
                                          ),
                                      };
                                    })
                                  );
                                }
                              }}
                            />
                          )}

                          <button
                            id={`AddIfCondition`}
                            className="btn btn-icon btn-icon-light btn-sm fw-bold button-primary  rounded "
                            onClick={() =>
                              removeAdditionalCondition(
                                condition.id,
                                additionalCondition.id
                              )
                            }
                            style={{ width: "100px", background: "#FFE2E5" }}
                          >
                            <i
                              className="fa fa-close text-danger"
                              style={{ fontSize: "16px" }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  <button
                    id={`AddIfCondition`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded "
                    onClick={() => addCondition(condition.id)}
                    style={{ width: "32px" }}
                  >
                    <i
                      className="bi bi-plus-lg"
                      style={{ fontSize: "16px" }}
                    ></i>
                  </button>
                </div>
              )}

              {/* Then label */}
              {condition.type !== "mapping" && (
                <div className="col-auto">
                  <span className="fw-bold">Then</span>
                </div>
              )}

              {/* Primary THEN field (conditional flip: text or field) */}
              {(condition.type === "if" || condition.type === "elseif" || condition.type === "else") && (
                <div className="col-auto">
                  {(() => {
                    const action = condition.thenActions[0];
                    if (!action) return null;
                    if (action.valueType === "text") {
                      return (
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            name={`thenText-${action.id}`}
                            placeholder="Value"
                            value={action.valueText ?? ""}
                            onChange={(e) =>
                              updateThenAction(
                                condition.id,
                                action.id,
                                "valueText",
                                e.target.value
                              )
                            }
                            style={{
                              minWidth: "140px",
                              height: "40px",
                              padding: "8px 12px",
                              border: "1px solid #e5e5e5",
                              borderRadius: "6px",
                              fontSize: "14px",
                              outline: "none",
                              backgroundColor: "white",
                            }}
                          />
                          <button
                            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-secondary rounded "
                            onClick={() =>
                              updateThenAction(
                                condition.id,
                                action.id,
                                "valueType",
                                "field"
                              )
                            }
                            style={{ width: "32px" }}
                            type="button"
                          >
                            <i
                              className="bi bi-arrow-repeat"
                              style={{ fontSize: "16px" }}
                            ></i>
                          </button>
                        </div>
                      );
                    }
                    return (
                      <Select
                        inputId={`then-primary-${action.id}`}
                        theme={(theme) => styles(theme)}
                        options={[
                          { value: "__TEXT__", label: "text" },
                          ...options,
                        ]}
                        name="thenPrimary"
                        value={
                          action.valueField
                            ? getDbFieldOptionByValue(
                                options,
                                action.valueField
                              ) ?? {
                                value: action.valueField,
                                label: action.valueField,
                              }
                            : null
                        }
                        onChange={(opt) => {
                          const selected = opt as { value: string } | null;
                          if (!selected) return;
                          if (selected.value === "__TEXT__") {
                            updateThenAction(
                              condition.id,
                              action.id,
                              "valueType",
                              "text"
                            );
                          } else {
                            updateThenAction(
                              condition.id,
                              action.id,
                              "valueType",
                              "field"
                            );
                            updateThenAction(
                              condition.id,
                              action.id,
                              "valueField",
                              selected.value
                            );
                            updateThenAction(
                              condition.id,
                              action.id,
                              "field",
                              selected.value
                            );
                          }
                        }}
                        components={customComponents}
                        styles={{
                          ...reactSelectSMStyle,
                          control: (provided) => ({
                            ...provided,
                            minWidth: "140px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "6px",
                            "&:hover": {
                              border: "1px solid #e5e5e5",
                            },
                          }),
                        }}
                        menuPortalTarget={document.body}
                        placeholder="--- Select ---"
                        isSearchable={true}
                        className="z-index-3 w-100"
                      />
                    );
                  })()}
                </div>
              )}

              {/* THEN LOGIC */}

              <div className="col-auto">
                {(condition.type === "mapping"
                  ? condition.thenActions
                  : condition.thenActions.slice(1)
                ).map((action: ThenAction, actionIndex: number) => {
                  // Calculate the actual index in the original array for close button logic
                  const actualIndex = condition.type === "mapping" ? actionIndex : actionIndex + 1;
                  return (
                  <div key={action.id} className="d-inline-block me-3 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      {/* <span className="fw-bold">Then</span> */}

                      {/* Separator shows first for all "then" actions */}
                      {action.separator && action.separator !== "" && (
                        <div className="d-flex align-items-center gap-1">
                          <Select
                            inputId={`separator-${action.id}`}
                            theme={(theme: any) => styles(theme)}
                            options={separatorOptions}
                            name="separator"
                            value={
                              action.separator
                                ? separatorOptions.find(
                                    (opt: { value: string; label: string }) => opt.value === action.separator
                                  ) || {
                                    value: action.separator,
                                    label: action.separator,
                                  }
                                : null
                            }
                            onChange={(opt: any) => {
                              const selected = opt as { value: string } | null;
                              if (selected) {
                                updateThenAction(
                                  condition.id,
                                  action.id,
                                  "separator",
                                  selected.value
                                );
                              }
                            }}
                            components={customComponents}
                            styles={{
                              ...reactSelectSMStyle,
                              control: (provided) => ({
                                ...provided,
                                minWidth: "90px",
                                border: "1px solid #e5e5e5",
                                borderRadius: "6px",
                                "&:hover": {
                                  border: "1px solid #e5e5e5",
                                },
                              }),
                            }}
                            menuPortalTarget={document.body}
                            placeholder="--- Select ---"
                            isSearchable={true}
                            className="z-index-3 w-100"
                          />
                          {actualIndex > 0 && (
                            <button
                              className="btn btn-icon btn-icon-light btn-sm fw-bold rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeThenActionSeparator(
                                  condition.id,
                                  action.id
                                );
                              }}
                              style={{
                                width: "24px",
                                height: "24px",
                                background: "#FFE2E5",
                                padding: "0",
                              }}
                              type="button"
                            >
                              <i
                                className="fa fa-close text-danger"
                                style={{ fontSize: "12px" }}
                              ></i>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Field shows second for all "then" actions */}
                      {action.showField && (
                        <div className="d-flex align-items-center gap-1">
                          {action.valueType === "text" ? (
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="text"
                                name={`thenText-${action.id}`}
                                placeholder="Value"
                                value={action.valueText ?? ""}
                                onChange={(e) =>
                                  updateThenAction(
                                    condition.id,
                                    action.id,
                                    "valueText",
                                    e.target.value
                                  )
                                }
                                style={{
                                  minWidth: "140px",
                                  height: "40px",
                                  padding: "8px 12px",
                                  border: "1px solid #e5e5e5",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  outline: "none",
                                  backgroundColor: "white",
                                }}
                              />
                              <button
                                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-secondary rounded "
                                onClick={() =>
                                  updateThenAction(
                                    condition.id,
                                    action.id,
                                    "valueType",
                                    "field"
                                  )
                                }
                                style={{ width: "32px" }}
                                type="button"
                              >
                                <i
                                  className="bi bi-arrow-repeat"
                                  style={{ fontSize: "16px" }}
                                ></i>
                              </button>
                            </div>
                          ) : (
                            <Select
                              inputId={`field-${action.id}`}
                              theme={(theme) => styles(theme)}
                              options={[
                                { value: "__TEXT__", label: "text" },
                                ...options,
                              ]}
                              name="field"
                              value={
                                action.valueType === "field" &&
                                action.valueField
                                  ? getDbFieldOptionByValue(
                                      options,
                                      action.valueField
                                    ) ?? {
                                      value: action.valueField,
                                      label: action.valueField,
                                    }
                                  : action.field
                                  ? getDbFieldOptionByValue(
                                      options,
                                      action.field
                                    ) ?? {
                                      value: action.field,
                                      label: action.field,
                                    }
                                    : null
                              }
                              onChange={(opt) => {
                                const selected = opt as {
                                  value: string;
                                } | null;
                                if (!selected) return;
                                if (selected.value === "__TEXT__") {
                                  // Switch to text input mode for all "then" actions
                                  updateThenAction(
                                    condition.id,
                                    action.id,
                                    "valueType",
                                    "text"
                                  );
                                } else {
                                  // Set a DB field
                                  updateThenAction(
                                    condition.id,
                                    action.id,
                                    "valueType",
                                    "field"
                                  );
                                  updateThenAction(
                                    condition.id,
                                    action.id,
                                    "valueField",
                                    selected.value
                                  );
                                  updateThenAction(
                                    condition.id,
                                    action.id,
                                    "field",
                                    selected.value
                                  );
                                }
                              }}
                              components={customComponents}
                              styles={{
                                ...reactSelectSMStyle,
                                control: (provided) => ({
                                  ...provided,
                                  minWidth: "140px",
                                  border: "1px solid #e5e5e5",
                                  borderRadius: "6px",
                                  "&:hover": {
                                    border: "1px solid #e5e5e5",
                                  },
                                }),
                              }}
                              menuPortalTarget={document.body}
                              placeholder="--- Select ---"
                              isSearchable={true}
                              className="z-index-3 w-100"
                            />
                          )}
                          {actualIndex > 0 && (
                            <button
                              className="btn btn-icon btn-icon-light btn-sm fw-bold rounded"
                              onClick={() =>
                                removeThenActionField(condition.id, action.id)
                              }
                              style={{
                                width: "24px",
                                height: "24px",
                                background: "#FFE2E5",
                                padding: "0",
                              }}
                              type="button"
                            >
                              <i
                                className="fa fa-close text-danger"
                                style={{ fontSize: "12px" }}
                              ></i>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
              {/* Add then action button */}
              <div className="col-auto">
                <button
                  id={`AddThenCondition`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded "
                  onClick={() => addThenAction(condition.id)}
                  style={{ width: "32px" }}
                >
                  <i className="bi bi-plus-lg" style={{ fontSize: "16px" }}></i>
                </button>
              </div>
              {/* Delete clause button for elseif/else */}
              {(condition.type === "elseif" || condition.type === "else") && (
                <div className="col-auto">
                  <button
                    className="btn btn-icon btn-icon-light btn-sm fw-bold rounded"
                    onClick={() => removeCondition(condition.id)}
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "#FFE2E5",
                      padding: "0",
                    }}
                    type="button"
                  >
                    <i
                      className="fa fa-close text-danger"
                      style={{ fontSize: "12px" }}
                    ></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Section Header */}
      {sectionIndex > 1 && (
        <div className="mb-4 mt-4">
          <div 
            style={{
              padding: "12px 16px",
              backgroundColor: "#F8F9FA",
              borderLeft: "3px solid #0D6EFD",
              borderRadius: "4px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h6 style={{ fontSize: "14px", fontWeight: "600", color: "#495057", margin: 0 }}>
              Section {sectionIndex}
            </h6>
            {onRemoveSection && (
              <button
                className="btn btn-icon btn-sm"
                onClick={() => onRemoveSection(occurrenceNumber, sectionIndex)}
                style={{
                  width: "28px",
                  height: "28px",
                  background: "#FFE2E5",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                type="button"
                title="Remove Section"
              >
                <i
                  className="fa fa-close text-danger"
                  style={{ fontSize: "14px" }}
                ></i>
              </button>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          padding: sectionIndex > 1 ? "20px" : "0",
          backgroundColor: sectionIndex > 1 ? "#FFFFFF" : "transparent",
          border: sectionIndex > 1 ? "1px solid #E9ECEF" : "none",
          borderRadius: sectionIndex > 1 ? "8px" : "0",
          boxShadow: sectionIndex > 1 ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
        }}
      >
            {/* HL7Index and Flags in a modern row layout */}
            <div className="row g-3 mb-4 align-items-end">
              <div className="col-auto">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: "13px", color: "#495057" }}>
                  HL7 Index
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={hl7Index}
                  onChange={(e) => handleHl7IndexChange(e.target.value)}
                  placeholder="Enter HL7 Index"
                  style={{
                    width: "120px",
                    fontSize: "14px",
                    border: "1px solid #DEE2E6",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    height: "40px",
                  }}
                />
              </div>
              <div className="col">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: "13px", color: "#495057" }}>
                  Flags
                </label>
                <div 
                  style={{
                    backgroundColor: "#F8F9FA",
                    border: "1px solid #E9ECEF",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="d-flex flex-row gap-3 flex-wrap align-items-center" style={{ width: "100%", rowGap: "8px" }}>
                    {flags && Object.keys(flags).map((flagKey) => {
                      const flagValue = flags[flagKey as keyof OccurrenceFlags];
                      const flagId = `flag-${flagKey}-${occurrenceNumber}-${sectionIndex}`;
                      
                      // Convert camelCase to readable label (e.g., "IsRepeatable" -> "Is Repeatable")
                      const formatLabel = (key: string): string => {
                        return key
                          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                          .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                          .trim();
                      };
                      
                      return (
                        <div key={flagKey} className="form-check mb-0" style={{ whiteSpace: "nowrap" }}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={flagId}
                            checked={flagValue || false}
                            onChange={(e) => handleFlagChange(flagKey as keyof OccurrenceFlags, e.target.checked)}
                            style={{ 
                              cursor: "pointer",
                              width: "16px",
                              height: "16px",
                              marginTop: "2px",
                              marginRight: "6px",
                              flexShrink: 0,
                            }}
                          />
                          <label 
                            className="form-check-label" 
                            htmlFor={flagId}
                            style={{ 
                              fontSize: "13px", 
                              color: "#495057", 
                              cursor: "pointer", 
                              userSelect: "none",
                              fontWeight: "500",
                              marginBottom: 0,
                            }}
                          >
                            {formatLabel(flagKey)}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: "#E9ECEF", opacity: 0.5 }} />

            {conditions.map((condition, index) =>
              renderCondition(condition, index)
            )}
            {/* Add clause row */}
            {(() => {
              const firstIsMapping = conditions[0]?.type === "mapping";
              const hasElse = conditions.some((c) => c.type === "else");
              if (firstIsMapping || hasElse) return null;
              return (
                <div className="mt-3">
                  <div className="row g-2 align-items-center">
                    <div className="col-auto">
                      <Select
                        inputId="addClause"
                        theme={(theme: any) => styles(theme)}
                        options={(() => {
                          const hasElse = conditions.some((c) => c.type === "else");
                          if (hasElse) {
                            // If "else" exists, only show "elseif"
                            return controlFlowOptions.filter(
                              (opt: { value: string; label: string }) => opt.value === "elseif"
                            );
                          }
                          // Otherwise show both "elseif" and "else"
                          return controlFlowOptions.filter(
                            (opt: { value: string; label: string }) => opt.value === "elseif" || opt.value === "else"
                          );
                        })()}
                        name="addClause"
                        components={customComponents}
                        styles={{
                          ...reactSelectSMStyle,
                          control: (provided) => ({
                            ...provided,
                            minWidth: "140px",
                            width: "140px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "6px",
                            "&:hover": {
                              border: "1px solid #e5e5e5",
                            },
                          }),
                        }}
                        menuPortalTarget={document.body}
                        placeholder="--- Select ---"
                        isSearchable={true}
                        className="z-index-3 w-100"
                        onChange={(opt) => {
                          const selected = opt as {
                            value: "elseif" | "else";
                          } | null;
                          if (!selected) return;
                          addClause(selected.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Plus Button to Add New Section */}
            {isLastSection && onAddSection && (
              <div className="mt-4 d-flex justify-content-center">
                <button
                  className="btn btn-primary"
                  onClick={() => onAddSection(occurrenceNumber)}
                  style={{
                    minWidth: "140px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    borderRadius: "6px",
                    border: "none",
                    boxShadow: "0 2px 4px rgba(13, 110, 253, 0.2)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(13, 110, 253, 0.3)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(13, 110, 253, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className="fa fa-plus me-2"></i>
                  Add Section
                </button>
              </div>
            )}
      </div>
    </div>
  );
};

// Main wrapper component that handles multiple occurrences
const ConditionalLogicUI: React.FC<ConditionalLogicUIProps> = ({
  selectedItem,
  occurrenceNumber,
  occurrences,
  registerPanel,
  onAddSection,
  onRemoveSection,
  onOccurrenceUpdate,
}) => {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  // Group occurrences by sectionIndex and sort
  const sortedOccurrences = [...occurrences].sort((a, b) => 
    (a?.sectionIndex ?? 0) - (b?.sectionIndex ?? 0)
  );

  // If no occurrences, show one empty section
  const occurrencesToRender = sortedOccurrences.length > 0 
    ? sortedOccurrences 
    : [null];

  const toggleAccordion = (): void => {
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          border: "1px solid #D1D3E0",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: accordionOpen ? "1px solid #D1D3E0" : "none",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: accordionOpen ? "#E8EFF7" : "white",
          }}
          onClick={toggleAccordion}
        >
          <span style={{ fontWeight: "500", fontSize: "14px", color: "#333" }}>
            {selectedItem
              ? `${selectedItem.name ?? ""} - ${occurrenceNumber}`
              : "Select an item"}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: accordionOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
              color: "#666",
            }}
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </div>
        {accordionOpen && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "white",
            }}
          >
            {occurrencesToRender.map((occurrence, idx) => {
              const sectionIndex = occurrence?.sectionIndex ?? (idx + 1);
              const isLastSection = idx === occurrencesToRender.length - 1;
              return (
                <OccurrenceSection
                  key={`${selectedItem?.id}-${occurrenceNumber}-${sectionIndex}`}
                  selectedItem={selectedItem}
                  occurrence={occurrence}
                  occurrenceNumber={occurrenceNumber}
                  sectionIndex={sectionIndex}
                  registerPanel={registerPanel}
                  onAddSection={onAddSection}
                  onRemoveSection={onRemoveSection}
                  onOccurrenceUpdate={onOccurrenceUpdate}
                  isLastSection={isLastSection}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionalLogicUI;

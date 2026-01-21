import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import { AddIntegeration } from "../Components/AddIntegeration";
import IntegrationConfig, { Item } from "../Components/IntegrationConfig";
import ConditionalLogicUI, {
  Occurrence as IntegrationOccurrence,
} from "../Components/ConditionalLogicPanel";
import useLang from "Shared/hooks/useLanguage";
import {
  getEngineHeaderDetails,
  getIntegrationConfiguration,
  getIntegrationHeaders,
  getMasterEngineHeaderDetails,
  saveEngineHeaderDetails,
} from "Services/HL7Integration";

interface EngineHeaderItemResponse {
  tempId?: string;
  messageHeadersInfoId?: number;
  headerName?: string;
  headerLength?: number;
  orderNumber?: number;
  parentTempId?: string | null;
  childLevel?: number;
  occurences?: IntegrationOccurrence[];
}

interface SetupStepProps {
  masterIntegrationId: number | null;
  selectedMessageFormatId?: number | null;
  onMessageFormatChange?: (formatId: number | null) => void;
}

export default function SetupStep({ 
  masterIntegrationId,
  selectedMessageFormatId: externalSelectedMessageFormatId = null,
  onMessageFormatChange
}: SetupStepProps) {
  const { t } = useLang();
  const [isAddNewIntegration, setIsAddNewIntegration] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [occurrencesMap, setOccurrencesMap] = useState<
    Record<string, IntegrationOccurrence[]>
  >({});
  const [isShowingMasterData, setIsShowingMasterData] = useState<boolean>(false);
  // Use external state if provided (controlled), otherwise use internal state (uncontrolled)
  const [internalSelectedMessageFormatId, setInternalSelectedMessageFormatId] = useState<
    number | null
  >(externalSelectedMessageFormatId);

  const selectedMessageFormatId = externalSelectedMessageFormatId ?? internalSelectedMessageFormatId;
  
  const setSelectedMessageFormatId = (formatId: number | null) => {
    setInternalSelectedMessageFormatId(formatId);
    onMessageFormatChange?.(formatId);
  };

  // Track the last messageFormatId that we populated items for
  const [lastPopulatedFormatId, setLastPopulatedFormatId] = useState<number | null>(null);

  const masterIntegrationIdParam = masterIntegrationId
    ? Number(masterIntegrationId)
    : null;
  const isMasterIntegrationIdValid =
    typeof masterIntegrationIdParam === "number" &&
    !Number.isNaN(masterIntegrationIdParam);

  // Fetch integration configuration
  const {
    data: integrationConfigurationResponse,
    isLoading: isIntegrationConfigLoading,
    isError: isIntegrationConfigError,
  } = useQuery(
    ["integrationConfiguration", masterIntegrationIdParam],
    () => getIntegrationConfiguration(masterIntegrationIdParam!),
    {
      enabled: isMasterIntegrationIdValid,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  // Sync internal state with external state changes
  useEffect(() => {
    if (externalSelectedMessageFormatId !== null) {
      setInternalSelectedMessageFormatId(externalSelectedMessageFormatId);
    }
  }, [externalSelectedMessageFormatId]);

  const messageFormats =
    integrationConfigurationResponse?.data?.data?.messageFormats ?? [];
  
  useEffect(() => {
    if (messageFormats.length > 0 && selectedMessageFormatId === null) {
      const firstFormat = messageFormats[0];
      const formatId =
        firstFormat?.messageFormatID ??
        (firstFormat as { messageFormatId?: number })?.messageFormatId;
      if (formatId) {
        setSelectedMessageFormatId(Number(formatId));
      }
    }
  }, [messageFormats, selectedMessageFormatId]);

  const selectedMessageFormat = messageFormats.find((format: any) => {
    const formatId =
      format?.messageFormatID ??
      (format as { messageFormatId?: number })?.messageFormatId;
    return Number(formatId) === selectedMessageFormatId;
  });

  // const selectedDirection = selectedMessageFormat?.direction ?? "";
  const selectedMessageType = selectedMessageFormat?.messageType ?? "";
  const isMessageFormatIdValid =
    typeof selectedMessageFormatId === "number" &&
    !Number.isNaN(selectedMessageFormatId) &&
    selectedMessageFormatId !== null;

  // Fetch engine header details
  const {
    data: engineHeaderDetailsResponse,
    isLoading: isEngineHeaderDetailsLoading,
    isError: isEngineHeaderDetailsError,
    refetch: refetchEngineHeaderDetails,
    isFetching: isEngineHeaderDetailsFetching,
  } = useQuery(
    ["engineHeaderDetails", masterIntegrationIdParam, selectedMessageFormatId],
    () =>
      getEngineHeaderDetails(
        masterIntegrationIdParam!,
        selectedMessageFormatId as number
      ),
    {
      enabled: isMasterIntegrationIdValid && isMessageFormatIdValid,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 0,
      keepPreviousData: false
    }
  );

  // Fetch integration headers for the "Add New" dropdown
  const {
    data: integrationHeadersResponse,
    isLoading: isIntegrationHeadersLoading,
  } = useQuery(["integrationHeaders"], () => getIntegrationHeaders(), {
    enabled: true, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Mutation for fetching master engine header details
  const {
    mutate: fetchMasterEngineHeaderDetails,
    isLoading: isLoadingMasterConfig,
  } = useMutation(
    () =>
      getMasterEngineHeaderDetails(
        masterIntegrationIdParam!,
        selectedMessageFormatId as number
      ),
    {
      onSuccess: (response) => {
        if (response?.data?.status === "Success") {
          const backendItems: EngineHeaderItemResponse[] =
            response?.data?.data?.items ?? [];

          if (!backendItems.length) {
            toast.warning(t("No master configuration found."));
            return;
          }

          // Map backend items to frontend items
          const mappedItems: Item[] = backendItems.map((item, index) => ({
            id: item.tempId ?? `segment_${index}`,
            name: item.headerName ?? `Segment ${index + 1}`,
            level: item.childLevel ?? 0,
            parent: item.parentTempId ?? null,
            order: item.orderNumber ?? index + 1,
            length: item.headerLength ?? 0,
            messageHeadersInfoId: item.messageHeadersInfoId,
          }));
          setItems(mappedItems);

          // Map occurrences
          const mappedOccurrences: Record<string, IntegrationOccurrence[]> = {};
          backendItems.forEach((item) => {
            if (item.tempId) {
              const existingOccurrences = item.occurences ?? [];
              const headerLength = item.headerLength ?? 0;

              // If headerLength is specified and greater than existing occurrences,
              // pad with empty occurrences
              if (headerLength > existingOccurrences.length) {
                const paddedOccurrences = [...existingOccurrences];
                for (let i = existingOccurrences.length; i < headerLength; i++) {
                  // Default to "mapping" mode with base field (cannot be removed) and empty parts
                  paddedOccurrences.push({
                    segmentTempId: item.tempId,
                    occurrenceNumber: i + 1,
                    sectionIndex: 1,
                    hl7Index: "1",
                    flags: {
                      IsRepeatable: false,
                      IsRepeatingGroup: false,
                      IsKeyControl: false,
                      ParentField: false,
                      LinkedField: false,
                    },
                    mappingMode: "mapping",
                    mappingRule: {
                      base: {
                        kind: "field",
                        field: null,
                        text: null,
                        delimiter: null,
                        delimiterCustom: null,
                      },
                      parts: [
                        {
                          kind: "field",
                          field: null,
                          text: null,
                          delimiter: "",
                          delimiterCustom: null,
                        },
                      ],
                    },
                    ifRule: null,
                    jsonRule: JSON.stringify({
                      base: {
                        kind: "field",
                        field: null,
                        text: null,
                        delimiter: null,
                        delimiterCustom: null,
                      },
                      parts: [
                        {
                          kind: "field",
                          field: null,
                          text: null,
                          delimiter: "",
                          delimiterCustom: null,
                        },
                      ],
                    }),
                    mappingFields: null,
                  });
                }
                mappedOccurrences[item.tempId] = paddedOccurrences;
              } else {
                mappedOccurrences[item.tempId] = existingOccurrences;
              }
            }
          });
          setOccurrencesMap(mappedOccurrences);

          // Auto-select the first item
          if (mappedItems.length > 0) {
            setSelectedItem(mappedItems[0]);
          }

          // Update last populated format ID to prevent overwriting
          setLastPopulatedFormatId(selectedMessageFormatId);

          // Show master data banner
          setIsShowingMasterData(true);

          toast.success(t("Master configuration loaded successfully."));
        } else {
          toast.error(t(response?.data?.message || "Failed to load master configuration."));
        }
      },
      onError: (error) => {
        console.error("Error fetching master configuration:", error);
        toast.error(t("An error occurred while fetching master configuration. Please try again."));
      },
    }
  );

  // Mutation for saving engine header details
  const {
    mutate: saveEngineHeaderDetailsMutation,
    isLoading: isSavingEngineHeaderDetails,
  } = useMutation(
    (payload: any) => saveEngineHeaderDetails(payload),
    {
      onSuccess: (response) => {
        if (response?.data?.status === "Success") {
          toast.success(t(response?.data?.message));
          // Hide master data banner when saving (will be replaced with regular data)
          setIsShowingMasterData(false);
          // Reset last populated format ID to allow fresh data to be loaded after save
          setLastPopulatedFormatId(null);
          refetchEngineHeaderDetails();
        } else {
          toast.error(t(response?.data?.message));
        }
      },
      onError: (error) => {
        console.error("Error saving integration setup:", error);
        toast.error(
          t("An error occurred while saving header details. Please try again.")
        );
      },
    }
  );

  // Updated to handle null values
  const handleSelectItem = (item: Item | null) => {
    setSelectedItem(item);
  };

  const handleAddItem = (messageHeadersInfoId: number, selectedItemName: string, length: number) => {
    const timestamp = Date.now();
    const newId = `${selectedItemName.toLowerCase()}_${timestamp}`;

    // Get next order for root level items
    const rootItems = items.filter((item) => item.level === 0);
    const nextOrder =
      rootItems.length > 0
        ? Math.max(...rootItems.map((item) => item.order)) + 1
        : 1;

    // Create new item
    const newItem: Item = {
      id: newId,
      name: selectedItemName,
      level: 0,
      parent: null,
      order: nextOrder,
      length: length,
      messageHeadersInfoId: messageHeadersInfoId,
    };
    console.log("new item", newItem);

    // Add to items state
    setItems((prevItems) => [...prevItems, newItem]);

    // Initialize occurrences based on the length
    // If length is 3, create 3 occurrences with occurrenceNumbers 1, 2, 3
    // Each occurrence starts with sectionIndex 1
    // Default to "mapping" mode with base field (cannot be removed) and empty parts
    const initialOccurrences: IntegrationOccurrence[] = Array.from(
      { length: length },
      (_, index) => ({
        segmentTempId: newId,
        occurrenceNumber: index + 1,
        sectionIndex: 1,
        hl7Index: "1",
        flags: {
          IsRepeatable: false,
          IsRepeatingGroup: false,
          IsKeyControl: false,
          ParentField: false,
          LinkedField: false,
        },
        mappingMode: "mapping",
        mappingRule: {
          base: {
            kind: "field",
            field: null,
            text: null,
            delimiter: null,
            delimiterCustom: null,
          },
          parts: [
            {
              kind: "field",
              field: null,
              text: null,
              delimiter: "",
              delimiterCustom: null,
            },
          ],
        },
        ifRule: null,
        jsonRule: JSON.stringify({
          base: {
            kind: "field",
            field: null,
            text: null,
            delimiter: null,
            delimiterCustom: null,
          },
          parts: [
            {
              kind: "field",
              field: null,
              text: null,
              delimiter: "",
              delimiterCustom: null,
            },
          ],
        }),
        mappingFields: null,
      })
    );

    setOccurrencesMap((prevMap) => ({
      ...prevMap,
      [newId]: initialOccurrences,
    }));

    return true;
  };

  const handleAddIndegration = () => {
    setIsAddNewIntegration(!isAddNewIntegration);
  };

  // Handle when item length changes (from edit)
  const handleItemLengthChange = (
    itemId: string,
    oldLength: number,
    newLength: number
  ) => {
    if (newLength === oldLength) return;

    setOccurrencesMap((prevMap) => {
      const existingOccurrences = prevMap[itemId] ?? [];

      // Create a map of existing occurrences by occurrenceNumber for quick lookup
      // Group by occurrenceNumber and keep all sections for each occurrence
      const existingByOccurrenceNumber = new Map<
        number,
        IntegrationOccurrence[]
      >();
      existingOccurrences.forEach((occ) => {
        const occNum = occ?.occurrenceNumber ?? 0;
        if (!existingByOccurrenceNumber.has(occNum)) {
          existingByOccurrenceNumber.set(occNum, []);
        }
        existingByOccurrenceNumber.get(occNum)!.push(occ);
      });

      // Build new occurrences array: ensure we have exactly occurrences 1 through newLength
      const newOccurrences: IntegrationOccurrence[] = [];

      for (let occNum = 1; occNum <= newLength; occNum++) {
        const existingForThisOccurrence =
          existingByOccurrenceNumber.get(occNum);

        if (existingForThisOccurrence && existingForThisOccurrence.length > 0) {
          // Preserve existing occurrences for this occurrenceNumber
          newOccurrences.push(...existingForThisOccurrence);
        } else {
          // Create new occurrence if it doesn't exist
          // Default to "mapping" mode with base field (cannot be removed) and empty parts
          newOccurrences.push({
            segmentTempId: itemId,
            occurrenceNumber: occNum,
            sectionIndex: 1,
            hl7Index: "1",
            flags: {
              IsRepeatable: false,
              IsRepeatingGroup: false,
              IsKeyControl: false,
              ParentField: false,
              LinkedField: false,
            },
            mappingMode: "mapping",
            mappingRule: {
              base: {
                kind: "field",
                field: null,
                text: null,
                delimiter: null,
                delimiterCustom: null,
              },
              parts: [
                {
                  kind: "field",
                  field: null,
                  text: null,
                  delimiter: "",
                  delimiterCustom: null,
                },
              ],
            },
            ifRule: null,
            jsonRule: JSON.stringify({
              base: {
                kind: "field",
                field: null,
                text: null,
                delimiter: null,
                delimiterCustom: null,
              },
              parts: [
                {
                  kind: "field",
                  field: null,
                  text: null,
                  delimiter: "",
                  delimiterCustom: null,
                },
              ],
            }),
            mappingFields: null,
          });
        }
      }

      return {
        ...prevMap,
        [itemId]: newOccurrences,
      };
    });
  };

  // Store refs to each ConditionalLogicPanel's getCurrentOccurrence function
  const occurrencePanelRefs = React.useRef<
    Record<string, () => IntegrationOccurrence | null>
  >({});

  const registerOccurrencePanel = (
    key: string,
    getOccurrenceFn: () => IntegrationOccurrence | null
  ) => {
    occurrencePanelRefs.current[key] = getOccurrenceFn;
  };

  // Handle occurrence update when accordion closes or item switches
  // This persists changes to occurrencesMap so they're not lost
  const handleOccurrenceUpdate = (
    itemId: string,
    occurrenceNumber: number,
    sectionIndex: number,
    occurrence: IntegrationOccurrence
  ) => {
    setOccurrencesMap((prevMap) => {
      const existingOccurrences = prevMap[itemId] || [];
      const updatedOccurrences = [...existingOccurrences];
      
      const existingIndex = updatedOccurrences.findIndex(
        (occ) => occ.occurrenceNumber === occurrenceNumber && occ.sectionIndex === sectionIndex
      );
      
      if (existingIndex >= 0) {
        updatedOccurrences[existingIndex] = occurrence;
      } else {
        updatedOccurrences.push(occurrence);
      }
      
      // Sort by occurrenceNumber, then by sectionIndex
      updatedOccurrences.sort((a, b) => {
        const numCompare = (a.occurrenceNumber ?? 0) - (b.occurrenceNumber ?? 0);
        if (numCompare !== 0) return numCompare;
        return (a.sectionIndex ?? 0) - (b.sectionIndex ?? 0);
      });
      
      return {
        ...prevMap,
        [itemId]: updatedOccurrences,
      };
    });
  };

  // Handle adding a new section to an occurrence
  const handleAddSection = (occurrenceNumber: number) => {
    if (!selectedItem) return;

    const existingOccurrences = occurrencesMap[selectedItem.id] || [];

    // Find the highest sectionIndex for this occurrenceNumber
    const sectionsForThisOccurrence = existingOccurrences.filter(
      (occ) => occ?.occurrenceNumber === occurrenceNumber
    );
    const maxSectionIndex =
      sectionsForThisOccurrence.length > 0
        ? Math.max(
            ...sectionsForThisOccurrence.map((occ) => occ?.sectionIndex ?? 0)
          )
        : 0;

    const newSectionIndex = maxSectionIndex + 1;

    // Create new occurrence with auto-incremented sectionIndex
    // Default to "mapping" mode with base field (cannot be removed) and empty parts
    const newOccurrence: IntegrationOccurrence = {
      segmentTempId: selectedItem.id,
      occurrenceNumber: occurrenceNumber,
      sectionIndex: newSectionIndex,
      hl7Index: String(newSectionIndex),
      flags: {
        IsRepeatable: false,
        IsRepeatingGroup: false,
        IsKeyControl: false,
        ParentField: false,
        LinkedField: false,
      },
      mappingMode: "mapping",
      mappingRule: {
        base: {
          kind: "field",
          field: null,
          text: null,
          delimiter: null,
          delimiterCustom: null,
        },
        parts: [
          {
            kind: "field",
            field: null,
            text: null,
            delimiter: "",
            delimiterCustom: null,
          },
        ],
      },
      ifRule: null,
      jsonRule: JSON.stringify({
        base: {
          kind: "field",
          field: null,
          text: null,
          delimiter: null,
          delimiterCustom: null,
        },
        parts: [
          {
            kind: "field",
            field: null,
            text: null,
            delimiter: "",
            delimiterCustom: null,
          },
        ],
      }),
      mappingFields: null,
    };

    setOccurrencesMap((prevMap) => ({
      ...prevMap,
      [selectedItem.id]: [...(prevMap[selectedItem.id] || []), newOccurrence],
    }));
  };

  // Handle removing a section from an occurrence
  const handleRemoveSection = (occurrenceNumber: number, sectionIndex: number) => {
    if (!selectedItem) return;

    // Remove the panel reference for this section
    const panelKey = `${selectedItem.id}-${occurrenceNumber}-${sectionIndex}`;
    delete occurrencePanelRefs.current[panelKey];

    setOccurrencesMap((prevMap) => {
      const existingOccurrences = prevMap[selectedItem.id] || [];
      
      // Filter out the section to remove and re-index higher sections
      const updatedOccurrences = existingOccurrences
        .filter(
          (occ) => !(occ?.occurrenceNumber === occurrenceNumber && occ?.sectionIndex === sectionIndex)
        )
        .map((occ) => {
          // If this occurrence is in the same occurrenceNumber and has a higher sectionIndex,
          // decrement its sectionIndex
          if (occ?.occurrenceNumber === occurrenceNumber && occ?.sectionIndex && occ.sectionIndex > sectionIndex) {
            const oldSectionIndex = occ.sectionIndex;
            const newSectionIndex = oldSectionIndex - 1;
            
            // Update panel references: remove old key and add new key
            const oldPanelKey = `${selectedItem.id}-${occurrenceNumber}-${oldSectionIndex}`;
            const newPanelKey = `${selectedItem.id}-${occurrenceNumber}-${newSectionIndex}`;
            
            if (occurrencePanelRefs.current[oldPanelKey]) {
              occurrencePanelRefs.current[newPanelKey] = occurrencePanelRefs.current[oldPanelKey];
              delete occurrencePanelRefs.current[oldPanelKey];
            }
            
            return {
              ...occ,
              sectionIndex: newSectionIndex,
            };
          }
          return occ;
        });

      return {
        ...prevMap,
        [selectedItem.id]: updatedOccurrences,
      };
    });
  };

  const handleSave = () => {
    const updatedOccurrencesMap: Record<string, IntegrationOccurrence[]> = {};

    // Start with existing occurrences as base
    items.forEach((item) => {
      updatedOccurrencesMap[item.id] = [...(occurrencesMap[item.id] || [])];
    });

    // Update with data from registered panels
    Object.keys(occurrencePanelRefs.current).forEach((key) => {
      const parts = key.split("-");
      if (parts.length >= 3) {
        const itemId = parts[0];
        const occurrenceNumber = parseInt(parts[1]);
        const sectionIndex = parseInt(parts[2]);

        const getOccurrence = occurrencePanelRefs.current[key];
        const occurrence = getOccurrence();

        if (!updatedOccurrencesMap[itemId]) {
          updatedOccurrencesMap[itemId] = [];
        }

        if (occurrence) {
          // Find and update existing occurrence or add new one
          const existingIndex = updatedOccurrencesMap[itemId].findIndex(
            (occ) =>
              occ.occurrenceNumber === occurrenceNumber &&
              occ.sectionIndex === sectionIndex
          );

          if (existingIndex >= 0) {
            // Update existing occurrence
            updatedOccurrencesMap[itemId][existingIndex] = {
              ...occurrence,
              occurrenceNumber: occurrenceNumber,
              sectionIndex: sectionIndex,
            };
          } else {
            // Add new occurrence
            updatedOccurrencesMap[itemId].push({
              ...occurrence,
              occurrenceNumber: occurrenceNumber,
              sectionIndex: sectionIndex,
            });
          }
        }
      }
    });

    // Sort occurrences by occurrenceNumber, then by sectionIndex
    Object.keys(updatedOccurrencesMap).forEach((itemId) => {
      updatedOccurrencesMap[itemId].sort((a, b) => {
        const numCompare =
          (a.occurrenceNumber ?? 0) - (b.occurrenceNumber ?? 0);
        if (numCompare !== 0) return numCompare;
        return (a.sectionIndex ?? 0) - (b.sectionIndex ?? 0);
      });
    });

    // Map frontend items back to backend structure
    const backendItems: EngineHeaderItemResponse[] = items.map((item) => ({
      tempId: item.id,
      messageHeadersInfoId: item.messageHeadersInfoId,
      headerName: item.name,
      headerLength: item.length,
      orderNumber: item.order,
      parentTempId: item.parent,
      childLevel: item.level,
      occurences:
        updatedOccurrencesMap[item.id] || occurrencesMap[item.id] || [],
    }));

    const payload = {
      integrationId: masterIntegrationIdParam,
      MessageFormatId: selectedMessageFormatId,
      items: backendItems,
    };

    console.log("=== SAVING INTEGRATION SETUP ===");
    console.log("Items:", items);
    console.log("Occurrences Map:", occurrencesMap);
    console.log("Updated Occurrences Map:", updatedOccurrencesMap);

    saveEngineHeaderDetailsMutation(payload);
  };

  // Effect to map backend items to frontend items
  // Only populate when switching to a different messageFormatId (direction change)
  useEffect(() => {
    if (isEngineHeaderDetailsFetching || isEngineHeaderDetailsLoading) {
      return;
    }

    // This preserves user changes when navigating back from other steps
    if (selectedMessageFormatId === lastPopulatedFormatId) {
      return; // Already populated for this format, don't overwrite user changes
    }

    const backendItems: EngineHeaderItemResponse[] =
      engineHeaderDetailsResponse?.data?.data?.items ?? [];
    
    // Mark this formatId as populated
    setLastPopulatedFormatId(selectedMessageFormatId);
    
    // Hide master data banner when regular data is loaded
    setIsShowingMasterData(false);

    if (!backendItems.length) {
      setItems([]);
      setOccurrencesMap({});
      setSelectedItem(null);
      return;
    }

    const mappedItems: Item[] = backendItems.map((item, index) => ({
      id: item.tempId ?? `segment_${index}`,
      name: item.headerName ?? `Segment ${index + 1}`,
      level: item.childLevel ?? 0,
      parent: item.parentTempId ?? null,
      order: item.orderNumber ?? index + 1,
      length: item.headerLength ?? 0,
      messageHeadersInfoId: item.messageHeadersInfoId,
    }));
    setItems(mappedItems);

    const mappedOccurrences: Record<string, IntegrationOccurrence[]> = {};
    backendItems.forEach((item) => {
      if (item.tempId) {
        const existingOccurrences = item.occurences ?? [];
        const headerLength = item.headerLength ?? 0;

        // If headerLength is specified and greater than existing occurrences,
        // pad with empty occurrences
        if (headerLength > existingOccurrences.length) {
          const paddedOccurrences = [...existingOccurrences];
          for (let i = existingOccurrences.length; i < headerLength; i++) {
            // Default to "mapping" mode with base field (cannot be removed) and empty parts
            paddedOccurrences.push({
              segmentTempId: item.tempId,
              occurrenceNumber: i + 1,
              sectionIndex: 1,
              hl7Index: "1",
              flags: {
                IsRepeatable: false,
                IsRepeatingGroup: false,
                IsKeyControl: false,
                ParentField: false,
                LinkedField: false,
              },
              mappingMode: "mapping",
              mappingRule: {
                base: {
                  kind: "field",
                  field: null,
                  text: null,
                  delimiter: null,
                  delimiterCustom: null,
                },
                parts: [
                  {
                    kind: "field",
                    field: null,
                    text: null,
                    delimiter: "",
                    delimiterCustom: null,
                  },
                ],
              },
              ifRule: null,
              jsonRule: JSON.stringify({
                base: {
                  kind: "field",
                  field: null,
                  text: null,
                  delimiter: null,
                  delimiterCustom: null,
                },
                parts: [
                  {
                    kind: "field",
                    field: null,
                    text: null,
                    delimiter: "",
                    delimiterCustom: null,
                  },
                ],
              }),
              mappingFields: null,
            });
          }
          mappedOccurrences[item.tempId] = paddedOccurrences;
        } else {
          mappedOccurrences[item.tempId] = existingOccurrences;
        }
      }
    });
    setOccurrencesMap(mappedOccurrences);

    // Auto-select the first item when items are first loaded or after save/refetch
    if (mappedItems.length > 0) {
      const currentItemStillExists = selectedItem && mappedItems.some(item => item.id === selectedItem.id);
      
      if (!selectedItem || !currentItemStillExists) {
        setSelectedItem(mappedItems[0]);
      } else {
        const updatedSelectedItem = mappedItems.find(item => item.id === selectedItem.id);
        if (updatedSelectedItem) {
          setSelectedItem(updatedSelectedItem);
        }
      }
    }
  }, [
    engineHeaderDetailsResponse,
    isEngineHeaderDetailsFetching,
    isEngineHeaderDetailsLoading,
    selectedMessageFormatId,
    lastPopulatedFormatId,
  ]);

  const handleUpdateWithMaster = () => {
    if (!isMasterIntegrationIdValid || !isMessageFormatIdValid) {
      toast.error(t("Master integration ID or message format ID is missing."));
      return;
    }

    fetchMasterEngineHeaderDetails();
  };

  return (
    <>
      <div className="mb-4">
        {!isMasterIntegrationIdValid ? (
          <div className="text-warning small">
            {t("Master integration id is missing or invalid.")}
          </div>
        ) : (
          <>
            {isIntegrationConfigLoading && (
              <div className="text-muted small">
                {t("Loading integration configuration...")}
              </div>
            )}
            {isIntegrationConfigError && (
              <div className="text-danger small">
                {t("Unable to load integration configuration.")}
              </div>
            )}
            {!isIntegrationConfigLoading && messageFormats.length > 0 && (
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <div className="fw-semibold mb-2">
                    {t("Integration Flow")}{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="d-flex flex-row gap-4">
                    {messageFormats.map((format: any) => {
                      const formatId =
                        format?.messageFormatID ??
                        (format as { messageFormatId?: number })
                          ?.messageFormatId;
                      const direction = format?.direction ?? "";
                      return (
                        <label
                          key={formatId}
                          className="form-check form-check-sm form-check-solid d-flex align-items-center gap-2 mb-0"
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="integrationDirection"
                            checked={selectedMessageFormatId === Number(formatId)}
                            onChange={() => {
                              setSelectedMessageFormatId(Number(formatId));
                              // Clear items and occurrences when switching
                              setItems([]);
                              setOccurrencesMap({});
                              setSelectedItem(null);
                              // Reset last populated format ID to allow new data to be loaded
                              setLastPopulatedFormatId(null);
                              // Hide master data banner when switching formats
                              setIsShowingMasterData(false);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <span style={{ textTransform: "capitalize" }}>
                            {direction || t("Not Available")}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="fw-semibold mb-2">
                    {t("File Type")} <span className="text-danger">*</span>
                  </div>
                  <label className="form-check form-check-sm form-check-solid d-flex align-items-center gap-2 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked
                      disabled
                      readOnly
                    />
                    <span style={{ textTransform: "uppercase" }}>
                      {selectedMessageType || t("Not Available")}
                    </span>
                  </label>
                </div>
              </div>
            )}
            {!isIntegrationConfigLoading &&
              messageFormats.length === 0 &&
              !isIntegrationConfigError && (
                <div className="text-muted small">
                  {t("No integration configuration found.")}
                </div>
              )}
          </>
        )}
      </div>
      <div className="d-flex flex-row justify-content-between">
        {!isAddNewIntegration && (
          <button
            className="btn btn-primary btn-sm btn-primary--icon px-7"
            onClick={handleAddIndegration}
            disabled={
               isEngineHeaderDetailsFetching || isEngineHeaderDetailsLoading || isEngineHeaderDetailsError
            }
          >
            <span>
              <i style={{ fontSize: "15px" }} className="fa">
                &#xf067;
              </i>
              <span>{t("Add New")}</span>
            </span>
          </button>
        )}
        {isAddNewIntegration && (
          <AddIntegeration
            integrationHeaders={
              integrationHeadersResponse?.data?.data?.messageHeaderNames || []
            }
            isLoading={isIntegrationHeadersLoading}
            onAddItem={handleAddItem}
            onCancel={() => setIsAddNewIntegration(false)}
          />
        )}
        <div className="d-flex flex-row gap-2 h-25">
          <button
            className="btn btn-primary btn-sm btn-primary--icon px-7"
            onClick={handleUpdateWithMaster}
            disabled={
               isEngineHeaderDetailsFetching || 
               isEngineHeaderDetailsLoading || 
               isEngineHeaderDetailsError ||
               isLoadingMasterConfig ||
               !isMasterIntegrationIdValid ||
               !isMessageFormatIdValid
            }
          >
            <span>
              {isLoadingMasterConfig ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>{t("Loading...")}</span>
                </>
              ) : (
                <span>{t("Load Master Configuration")}</span>
              )}
            </span>
          </button>
        <button
          className="btn btn-primary btn-sm btn-primary--icon px-7 h-25"
          onClick={handleSave}
          disabled={
            isIntegrationConfigLoading ||
            isEngineHeaderDetailsLoading ||
            isEngineHeaderDetailsFetching ||
            isEngineHeaderDetailsError ||
            isLoadingMasterConfig ||
            isSavingEngineHeaderDetails ||
            !selectedMessageFormat ||
            !isMessageFormatIdValid
          }
          >
          <span>
            {isSavingEngineHeaderDetails ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>{t("Saving...")}</span>
              </>
            ) : (
              <>
                <i style={{ fontSize: "15px" }} className="fa">
                  &#xf067;
                </i>
                <span>{t("Save")}</span>
              </>
            )}
          </span>
        </button>
          </div>
      </div>
      <hr className="hr"></hr>

      {/* Master Data Banner */}
      {isShowingMasterData && (
        <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
          <i className="fas fa-info-circle me-2" style={{ fontSize: "1.1rem" }}></i>
          <div className="flex-grow-1">
            <strong>{t("Master Configuration Active")}</strong>
            <span className="ms-2">{t("You are currently viewing master portal configuration data.")}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setIsShowingMasterData(false)}
          ></button>
        </div>
      )}

      {/* Loading state for engine header details */}
      {(isEngineHeaderDetailsLoading || isEngineHeaderDetailsFetching || isLoadingMasterConfig) && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="text-muted text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">{t("Loading...")}</span>
            </div>
            <p>{t("Loading header details...")}</p>
          </div>
        </div>
      )}

      {/* Error state for engine header details */}
      {isEngineHeaderDetailsError && !isEngineHeaderDetailsLoading && !isEngineHeaderDetailsFetching && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="text-center">
            <i
              className="fas fa-exclamation-triangle text-danger mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="text-dark fw-semibold mb-2">
              {t("No Header Details Found")}
            </h5>
            <p className="text-muted mb-0">
              {t("No header details found in master or application database.")}
            </p>
            <p className="text-muted small mt-1">
              {t(
                "Please check your integration configuration or contact support."
              )}
            </p>
          </div>
        </div>
      )}

      {/* No items state - when loading is complete but no items found */}
      {!isEngineHeaderDetailsLoading &&
        !isEngineHeaderDetailsFetching &&
        !isEngineHeaderDetailsError &&
        items.length === 0 &&
        engineHeaderDetailsResponse && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
          >
            <div className="text-center">
              <i
                className="fas fa-info-circle text-muted mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="text-dark fw-semibold mb-2">
                {t("No Items Available")}
              </h5>
              <p className="text-muted mb-0">
                {t("No header items found. Please add items to continue.")}
              </p>
            </div>
          </div>
        )}

      {/* Success state - show the integration config only when items are loaded */}
      {!isEngineHeaderDetailsLoading &&
        !isEngineHeaderDetailsFetching &&
        !isEngineHeaderDetailsError &&
        !isLoadingMasterConfig &&
        items.length > 0 && (
          <div className="d-flex flex-row" style={{ minHeight: "500px" }}>
            <div
              className="flex-shrink-0"
              style={{ width: "25%", minWidth: "250px" }}
            >
              <IntegrationConfig
                handleSelectItem={handleSelectItem}
                selectedItem={selectedItem}
                items={items}
                setItems={setItems}
                onItemLengthChange={handleItemLengthChange}
              />
            </div>
            <div
              className="flex-shrink-0"
              style={{
                width: "1px",
                backgroundColor: "#e4e6ea",
                margin: "0 1rem",
                minHeight: "100%",
              }}
            />
            <div className="flex-grow-1">
              {selectedItem ? (
                <div className="accordion" id="conditionalLogicAccordion">
                  {(() => {
                    const occurrences = occurrencesMap[selectedItem.id] || [];

                    // Group occurrences by occurrenceNumber
                    const grouped = occurrences.reduce(
                      (acc, occ) => {
                        const key = occ?.occurrenceNumber ?? 0;
                        if (!acc[key]) {
                          acc[key] = [];
                        }
                        acc[key].push(occ);
                        return acc;
                      },
                      {} as Record<number, IntegrationOccurrence[]>
                    );

                    // Sort each group by sectionIndex
                    Object.keys(grouped).forEach((key) => {
                      grouped[Number(key)].sort(
                        (a, b) =>
                          (a?.sectionIndex ?? 0) - (b?.sectionIndex ?? 0)
                      );
                    });

                    // If no occurrences, show one empty accordion
                    const occurrenceNumbers =
                      Object.keys(grouped).length > 0
                        ? Object.keys(grouped)
                            .map(Number)
                            .sort((a, b) => a - b)
                        : [1];

                    return occurrenceNumbers.map((occurrenceNumber) => {
                      const occurrencesForNumber = grouped[
                        occurrenceNumber
                      ] || [null];
                      return (
                        <div
                          key={`${selectedItem.id}-${occurrenceNumber}`}
                          className="mb-3"
                        >
                          <ConditionalLogicUI
                            selectedItem={selectedItem}
                            occurrenceNumber={occurrenceNumber}
                            occurrences={occurrencesForNumber}
                            registerPanel={registerOccurrencePanel}
                            onAddSection={handleAddSection}
                            onRemoveSection={handleRemoveSection}
                            onOccurrenceUpdate={handleOccurrenceUpdate}
                          />
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : null}
            </div>
          </div>
        )}
    </>
  );
}

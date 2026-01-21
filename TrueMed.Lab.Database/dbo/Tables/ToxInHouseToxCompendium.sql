CREATE TABLE [dbo].[ToxInHouseToxCompendium] (
    [ID]               INT            NOT NULL,
    [TestName]         NVARCHAR (255) NULL,
    [RefferenceRanges] NVARCHAR (255) NULL,
    [Units]            NVARCHAR (255) NULL,
    [SpecimenType]     NVARCHAR (255) NULL,
    [TestCode]         NVARCHAR (255) NULL,
    [PerformingLab]    NVARCHAR (255) NULL,
    [TestonReq]        NVARCHAR (255) NULL,
    [ThresholdRanges]  NVARCHAR (255) NULL
);


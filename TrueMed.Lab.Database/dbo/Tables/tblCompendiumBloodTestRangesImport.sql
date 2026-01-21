CREATE TABLE [dbo].[tblCompendiumBloodTestRangesImport] (
    [Id]                 INT            IDENTITY (1, 1) NOT NULL,
    [TestName]           NVARCHAR (255) NULL,
    [TestCode]           FLOAT (53)     NULL,
    [ReferenceValueType] NVARCHAR (255) NULL,
    [Sex]                NVARCHAR (255) NULL,
    [MinAge]             FLOAT (53)     NULL,
    [MaxAge]             FLOAT (53)     NULL,
    [Low]                FLOAT (53)     NULL,
    [High]               FLOAT (53)     NULL,
    [CriticalValueLow]   NVARCHAR (255) NULL,
    [CriticalValueHigh]  NVARCHAR (255) NULL,
    [Uint]               NVARCHAR (255) NULL,
    [SpecimentType]      NVARCHAR (255) NULL,
    [LowFlag]            NVARCHAR (255) NULL,
    [InRangeFlag]        NVARCHAR (255) NULL,
    [HighFlag]           NVARCHAR (255) NULL,
    CONSTRAINT [PK_tblCompendiumBloodTestRangesImport] PRIMARY KEY CLUSTERED ([Id] ASC)
);


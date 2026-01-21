CREATE TABLE [dbo].[ToxConfirmationToxCompendium] (
    [ID]            INT            NOT NULL,
    [PanelName]     NVARCHAR (255) NULL,
    [TestName]      NVARCHAR (255) NULL,
    [Cutoff]        FLOAT (53)     NULL,
    [Linearity]     FLOAT (53)     NULL,
    [Unit]          NVARCHAR (255) NULL,
    [SpecimenType]  NVARCHAR (255) NULL,
    [TestCode]      NVARCHAR (255) NULL,
    [PerformingLab] NVARCHAR (255) NULL,
    [DrugClass]     VARCHAR (500)  NULL
);


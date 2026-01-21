CREATE TABLE [dbo].[tblTempCompendiumPanelTestUpload] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [PerformingLab]   NVARCHAR (MAX) NULL,
    [PanelName]       NVARCHAR (MAX) NULL,
    [PanelCode]       NVARCHAR (MAX) NULL,
    [AssayName]       NVARCHAR (MAX) NULL,
    [Organisim]       NVARCHAR (MAX) NULL,
    [TestCode]        NVARCHAR (MAX) NULL,
    [AntibiotecClass] NVARCHAR (MAX) NULL,
    [Resistance]      NVARCHAR (MAX) NULL,
    [UploadStatus]    NVARCHAR (MAX) NOT NULL,
    [CreatedBy]       NVARCHAR (MAX) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    CONSTRAINT [PK_tblTempCompendiumPanelTestUpload] PRIMARY KEY CLUSTERED ([ID] ASC)
);


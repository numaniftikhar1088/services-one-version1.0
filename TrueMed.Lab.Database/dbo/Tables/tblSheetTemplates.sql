CREATE TABLE [dbo].[tblSheetTemplates] (
    [ID]            INT            IDENTITY (1, 1) NOT NULL,
    [KeyofTemplate] NVARCHAR (MAX) NULL,
    [TemplateUri]   NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblSheetTemplates] PRIMARY KEY CLUSTERED ([ID] ASC)
);


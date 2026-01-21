CREATE TABLE [dbo].[tblLISResultSetting] (
    [ID]          INT            NOT NULL,
    [LabID]       INT            NULL,
    [FileType]    NVARCHAR (MAX) NULL,
    [JSONSetting] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblLISResultSetting] PRIMARY KEY CLUSTERED ([ID] ASC)
);


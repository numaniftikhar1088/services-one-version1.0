CREATE TABLE [dbo].[tblLabControlOptionDependency] (
    [ID]                 INT            IDENTITY (1, 1) NOT NULL,
    [LabID]              INT            NULL,
    [ControlID]          INT            NULL,
    [OptionID]           INT            NULL,
    [DependentControlID] INT            NULL,
    [DependencyAction]   NVARCHAR (MAX) NOT NULL,
    [CreatedBy]          NVARCHAR (MAX) NULL,
    [CreatedDate]        DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblLabControlOptionDependency] PRIMARY KEY CLUSTERED ([ID] ASC)
);


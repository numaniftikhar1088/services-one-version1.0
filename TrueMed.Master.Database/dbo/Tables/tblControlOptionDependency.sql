CREATE TABLE [dbo].[tblControlOptionDependency] (
    [ID]                 INT            IDENTITY (1, 1) NOT NULL,
    [ControlID]          INT            NULL,
    [OptionID]           INT            NULL,
    [DependentControlID] INT            NULL,
    [CreatedBy]          NVARCHAR (MAX) NULL,
    [CreatedDate]        DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblControlOptionDependency] PRIMARY KEY CLUSTERED ([ID] ASC)
);


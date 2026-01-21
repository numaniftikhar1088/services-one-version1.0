CREATE TABLE [dbo].[tblUserViewRequisition] (
    [ID]                INT            IDENTITY (1, 1) NOT NULL,
    [UserID]            NVARCHAR (MAX) NULL,
    [ViewRequisitionID] INT            NULL,
    [ColumnOrder]       INT            NULL,
    [LabID]             INT            NULL,
    CONSTRAINT [PK_tblUserViewRequisition] PRIMARY KEY CLUSTERED ([ID] ASC)
);


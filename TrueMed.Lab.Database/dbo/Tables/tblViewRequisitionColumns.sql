CREATE TABLE [dbo].[tblViewRequisitionColumns] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [ColumnLabel] NVARCHAR (MAX) NULL,
    [ColumnName]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblViewRequisitionColumns] PRIMARY KEY CLUSTERED ([ID] ASC)
);


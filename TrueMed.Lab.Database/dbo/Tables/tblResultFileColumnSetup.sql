CREATE TABLE [dbo].[tblResultFileColumnSetup] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [LabId]           INT            NULL,
    [SystemCellName]  NVARCHAR (MAX) NULL,
    [CustomCellName]  NVARCHAR (MAX) NULL,
    [CustomCellOrder] INT            NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblResultFileColumnSetup_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]       NVARCHAR (MAX) NULL,
    [CreatedDate]     DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblResultFileColumnSetup] PRIMARY KEY CLUSTERED ([Id] ASC)
);


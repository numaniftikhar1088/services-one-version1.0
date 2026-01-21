CREATE TABLE [dbo].[tblLISStatus] (
    [LISStatusID]    INT            IDENTITY (1, 1) NOT NULL,
    [Name]           NVARCHAR (50)  NOT NULL,
    [LISStatusColor] NVARCHAR (MAX) NULL,
    [CreatedBy]      NVARCHAR (200) NOT NULL,
    [CreatedDate]    DATETIME2 (7)  NOT NULL,
    [UpdatedBy]      NVARCHAR (200) NULL,
    [UpdatedDate]    DATETIME2 (7)  NULL,
    [DeletedBy]      NVARCHAR (200) NULL,
    [DeletedDate]    DATETIME2 (7)  NULL,
    [IsDeleted]      BIT            CONSTRAINT [DF_tblLISStatus_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblLISStatus] PRIMARY KEY CLUSTERED ([LISStatusID] ASC)
);


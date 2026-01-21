CREATE TABLE [dbo].[tblRequisitionStatus] (
    [ReqStatusID]    INT            IDENTITY (1, 1) NOT NULL,
    [Name]           NVARCHAR (50)  NOT NULL,
    [ReqStatusColor] NVARCHAR (MAX) NULL,
    [CreatedBy]      NVARCHAR (200) NOT NULL,
    [CreatedDate]    DATETIME2 (7)  NOT NULL,
    [UpdatedBy]      NVARCHAR (200) NULL,
    [UpdatedDate]    DATETIME2 (7)  NULL,
    [DeletedBy]      NVARCHAR (200) NULL,
    [DeletedDate]    DATETIME2 (7)  NULL,
    [IsDeleted]      BIT            CONSTRAINT [DF_tblRequisitionStatus_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblRequisitionStatus] PRIMARY KEY CLUSTERED ([ReqStatusID] ASC)
);


CREATE TABLE [dbo].[tblNetworkType] (
    [NetworkTypeID]   INT            IDENTITY (1, 1) NOT NULL,
    [NetworkTypeName] NVARCHAR (MAX) NULL,
    [IsActive]        BIT            CONSTRAINT [DF_Table_1_NetworkStatus] DEFAULT ((1)) NOT NULL,
    [CreatedBy]       NVARCHAR (MAX) NULL,
    [CreatedDate]     DATETIME       NULL,
    [UpdatedBy]       NVARCHAR (MAX) NULL,
    [UpdatedDate]     DATETIME       NULL,
    [DeletedBy]       NVARCHAR (MAX) NULL,
    [DeletedDate]     DATETIME       NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblNetworkType_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblNetworkType] PRIMARY KEY CLUSTERED ([NetworkTypeID] ASC)
);


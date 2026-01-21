CREATE TABLE [dbo].[tblRequisitionType] (
    [ReqTypeID]           INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionType]     NVARCHAR (50)  NOT NULL,
    [RequisitionTypeName] NVARCHAR (MAX) NOT NULL,
    [RequisitionColor]    NVARCHAR (MAX) NULL,
    [CreatedBy]           NVARCHAR (200) NOT NULL,
    [CreatedDate]         DATETIME2 (7)  NOT NULL,
    [UpdatedBy]           NVARCHAR (200) NULL,
    [UpdatedDate]         DATETIME2 (7)  NULL,
    [DeletedBy]           NVARCHAR (200) NULL,
    [DeletedDate]         DATETIME2 (7)  NULL,
    [IsDeleted]           BIT            CONSTRAINT [DF_tblRequisitionType_RequisitionTypeStatus] DEFAULT ((0)) NOT NULL,
    [ReqStatus]           BIT            CONSTRAINT [DF_tblRequisitionType_ReqStatus] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_tblRequisitionType] PRIMARY KEY CLUSTERED ([ReqTypeID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'RequisitionType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type Name like Infectious Disease, Blood, Tox etc.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'RequisitionTypeName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'DeletedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionType', @level2type = N'COLUMN', @level2name = N'IsDeleted';


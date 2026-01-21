CREATE TABLE [dbo].[tblRequisitionOrders] (
    [RequisitionOrderID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionID]      INT            NOT NULL,
    [RecordID]           NVARCHAR (50)  NULL,
    [ReqTypeID]          INT            NULL,
    [LabID]              INT            NOT NULL,
    [LabType]            INT            NULL,
    [DateReceived]       DATETIME       NULL,
    [ValidatedBy]        NVARCHAR (MAX) NULL,
    [ValidationDate]     DATETIME2 (7)  NULL,
    [PublishBy]          NVARCHAR (MAX) NULL,
    [PublishedDate]      DATETIME2 (7)  NULL,
    [BillingDate]        DATETIME       NULL,
    [WorkFlowStatus]     NVARCHAR (50)  NULL,
    [LastWorkFlowStatus] NVARCHAR (50)  NULL,
    [LISStatus]          NVARCHAR (50)  NULL,
    [ReferenceID]        NVARCHAR (50)  NULL,
    [CreatedBy]          NVARCHAR (200) NOT NULL,
    [CreatedDate]        DATETIME2 (7)  NOT NULL,
    [UpdatedBy]          NVARCHAR (200) NULL,
    [UpdatedDate]        DATETIME2 (7)  NULL,
    [DeletedBy]          NVARCHAR (200) NULL,
    [DeletedDate]        DATETIME2 (7)  NULL,
    [IsDeleted]          BIT            CONSTRAINT [DF_tblRequisitionGroupInfo_IsDeleted] DEFAULT ((0)) NULL,
    CONSTRAINT [PK__tblRequi__8A7C36E0914DD4D4] PRIMARY KEY CLUSTERED ([RequisitionOrderID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'RequisitionOrderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Record ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'RecordID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Reference Lab ID (tblRefLabAssignment Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'LabID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Receive Date', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'DateReceived';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Validation Date', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'ValidationDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Publish Date', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'PublishedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Billing Date', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'BillingDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Status (Auto Update)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'WorkFlowStatus';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Last Status of Requisition(Auto Update)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'LastWorkFlowStatus';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'LIS Status (Auto Update)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'LISStatus';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Reference ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'ReferenceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Updated By', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Updated Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Deleted Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionOrders', @level2type = N'COLUMN', @level2name = N'DeletedDate';


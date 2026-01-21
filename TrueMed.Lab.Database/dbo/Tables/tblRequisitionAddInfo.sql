CREATE TABLE [dbo].[tblRequisitionAddInfo] (
    [RequisitionAddInfoID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID]   INT            NOT NULL,
    [RequisitionID]        INT            NULL,
    [ReqTypeID]            INT            NULL,
    [SectionID]            INT            NULL,
    [ControlID]            INT            NULL,
    [ControlValue]         NVARCHAR (MAX) NULL,
    [KeyID]                NVARCHAR (50)  NULL,
    [KeyValue]             NVARCHAR (MAX) NULL,
    [SectionIdentifier]    INT            NOT NULL,
    CONSTRAINT [PK_tblRequisitionAddInfo] PRIMARY KEY CLUSTERED ([RequisitionAddInfoID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionAddInfo', @level2type = N'COLUMN', @level2name = N'RequisitionAddInfoID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Group ID (tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionAddInfo', @level2type = N'COLUMN', @level2name = N'RequisitionOrderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionAddInfo', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionAddInfo', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Key ID (JSN)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionAddInfo', @level2type = N'COLUMN', @level2name = N'KeyID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Key Value (JSN)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionAddInfo', @level2type = N'COLUMN', @level2name = N'KeyValue';


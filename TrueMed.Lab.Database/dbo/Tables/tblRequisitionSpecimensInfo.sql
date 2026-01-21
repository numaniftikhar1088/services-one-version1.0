CREATE TABLE [dbo].[tblRequisitionSpecimensInfo] (
    [RequisitionSpecimenID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID]    INT            NOT NULL,
    [RequisitionID]         INT            NOT NULL,
    [ReqTypeID]             INT            NULL,
    [SpecimenType]          INT            NULL,
    [PanelID]               INT            NULL,
    [SpecimenID]            NVARCHAR (MAX) NULL,
    [CreatedBy]             NVARCHAR (MAX) NULL,
    [CreatedDate]           DATETIME2 (7)  NULL,
    [UpdatedBy]             NVARCHAR (MAX) NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblRequisitionSpecimens] PRIMARY KEY CLUSTERED ([RequisitionSpecimenID] ASC),
    CONSTRAINT [FK_tblRequisitionSpecimens_tblRequisitionGroupInfo] FOREIGN KEY ([RequisitionOrderID]) REFERENCES [dbo].[tblRequisitionOrders] ([RequisitionOrderID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'RequisitionSpecimenID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Group ID (tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'RequisitionOrderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType  / tblRequisitionGroupinfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Specimen Type (tblSpecimenType Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'SpecimenType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Panel ID (tblPanelSetup Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'PanelID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Specimen Bar Code', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionSpecimensInfo', @level2type = N'COLUMN', @level2name = N'SpecimenID';


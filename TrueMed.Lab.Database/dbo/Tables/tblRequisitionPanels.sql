CREATE TABLE [dbo].[tblRequisitionPanels] (
    [RequisitionPanelID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID] INT            NOT NULL,
    [RequisitionID]      INT            NOT NULL,
    [ReqTypeID]          INT            NULL,
    [GroupID]            INT            NULL,
    [GroupName]          NVARCHAR (MAX) NULL,
    [PanelID]            INT            NULL,
    [PanelName]          NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblRequisitionPanels] PRIMARY KEY CLUSTERED ([RequisitionPanelID] ASC),
    CONSTRAINT [FK_tblRequisitionPanels_tblRequisitionGroupInfo] FOREIGN KEY ([RequisitionOrderID]) REFERENCES [dbo].[tblRequisitionOrders] ([RequisitionOrderID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPanels', @level2type = N'COLUMN', @level2name = N'RequisitionPanelID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Group ID (tblRequisitionGroupInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPanels', @level2type = N'COLUMN', @level2name = N'RequisitionOrderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPanels', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPanels', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Panel ID (tblPanelSetup / tblGPT_Assignment Tables)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionPanels', @level2type = N'COLUMN', @level2name = N'PanelID';


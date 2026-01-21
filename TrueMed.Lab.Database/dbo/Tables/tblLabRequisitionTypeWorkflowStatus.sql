CREATE TABLE [dbo].[tblLabRequisitionTypeWorkflowStatus] (
    [ID]                         INT            IDENTITY (1, 1) NOT NULL,
    [LabID]                      INT            NOT NULL,
    [ReqTypeID]                  INT            NOT NULL,
    [PortalTypeID]               INT            NOT NULL,
    [CurrentWorkFlowID]          INT            NULL,
    [ActionPerformed]            NVARCHAR (MAX) NULL,
    [NextWorkFlowIDForPhysician] INT            NULL,
    [NextWorkFlowIDForAdmin]     INT            NULL,
    [CreatedBy]                  NVARCHAR (MAX) NOT NULL,
    [CreatedDate]                DATETIME2 (7)  NOT NULL,
    [UpdatedBy]                  NVARCHAR (MAX) NULL,
    [UpdatedDate]                DATETIME2 (7)  NULL,
    [IsActive]                   BIT            CONSTRAINT [DF_tblRequisitionWorkflowStatues_IsActive] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_tblRequisitionWorkflowStatues] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblLabRequisitionTypeWorkflowStatues_tblLabRequisitionType] FOREIGN KEY ([ReqTypeID]) REFERENCES [dbo].[tblLabRequisitionType] ([ReqTypeID]),
    CONSTRAINT [FK_tblLabRequisitionTypeWorkflowStatues_tblWorkFlowStatuses] FOREIGN KEY ([CurrentWorkFlowID]) REFERENCES [dbo].[tblWorkFlowStatuses] ([ID]),
    CONSTRAINT [FK_tblLabRequisitionTypeWorkflowStatues_tblWorkFlowStatuses1] FOREIGN KEY ([NextWorkFlowIDForAdmin]) REFERENCES [dbo].[tblWorkFlowStatuses] ([ID]),
    CONSTRAINT [FK_tblLabRequisitionTypeWorkflowStatues_tblWorkFlowStatuses2] FOREIGN KEY ([NextWorkFlowIDForPhysician]) REFERENCES [dbo].[tblWorkFlowStatuses] ([ID])
);


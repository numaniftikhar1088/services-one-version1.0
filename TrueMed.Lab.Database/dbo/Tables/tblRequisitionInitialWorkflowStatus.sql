CREATE TABLE [dbo].[tblRequisitionInitialWorkflowStatus] (
    [ID]                INT            IDENTITY (1, 1) NOT NULL,
    [LabID]             INT            NULL,
    [ReqTypeID]         INT            NULL,
    [PortalTypeID]      INT            NULL,
    [JSONSetting]       NVARCHAR (MAX) NULL,
    [InitialWorkFlowID] INT            NULL,
    [CreatedBy]         NVARCHAR (MAX) NULL,
    [CreatedDate]       DATETIME2 (7)  NULL,
    [DeletedBy]         NVARCHAR (MAX) NULL,
    [DeletedDate]       DATETIME2 (7)  NULL,
    [IsDeleted]         BIT            CONSTRAINT [DF_tblRequisitionInitialWorkflowStatus_IsDeleted] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_tblRequisitionInitialWorkflowStatus] PRIMARY KEY CLUSTERED ([ID] ASC)
);


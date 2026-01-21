CREATE TABLE [dbo].[tblWorkFlowStatuses] (
    [ID]                  INT            IDENTITY (1, 1) NOT NULL,
    [WorkFlowstatus]      NVARCHAR (MAX) NOT NULL,
    [WorkFlowDescription] NVARCHAR (MAX) NULL,
    [WorkFlowColorStatus] NVARCHAR (MAX) NULL,
    [WorkFlowDisplayName] NVARCHAR (MAX) NULL,
    [CreatedBy]           NVARCHAR (MAX) NOT NULL,
    [CreatedDate]         DATETIME2 (7)  NOT NULL,
    [UpdatedBy]           NVARCHAR (MAX) NULL,
    [UpdatedDate]         DATETIME2 (7)  NULL,
    [IsActive]            BIT            CONSTRAINT [DF_WorkFlowStatuses_IsActive] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_WorkFlowStatuses] PRIMARY KEY CLUSTERED ([ID] ASC)
);

